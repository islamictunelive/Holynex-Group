import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Settings,
  BookOpen,
  BarChart3,
  Terminal,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Check,
  Phone,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  Send,
  Eye,
} from 'lucide-react';
import { useLanguage } from '../../lib/languageContext';
import { AISettings, AIKnowledgeItem, AIChatAnalytics } from '../../types';
import { initialAISettings, initialAIKnowledge, initialAIChatAnalytics } from '../../lib/aiData';
import { Storage } from '../../lib/storage';

export const AdminAIAssistantTab: React.FC = () => {
  const { t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'settings' | 'knowledge' | 'analytics' | 'playground'>('settings');

  // State
  const [settings, setSettings] = useState<AISettings>(() => Storage.getAISettings() || initialAISettings);
  const [knowledgeList, setKnowledgeList] = useState<AIKnowledgeItem[]>(() => Storage.getAIKnowledge() || initialAIKnowledge);
  const [analytics, setAnalytics] = useState<AIChatAnalytics>(() => Storage.getAIChatAnalytics() || initialAIChatAnalytics);

  // Status & Feedback
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal for Edit / Add Knowledge
  const [editingItem, setEditingItem] = useState<AIKnowledgeItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');

  // Playground State
  const [testPrompt, setTestPrompt] = useState('ফেয়ার প্রাইস কার্ডের সুবিধা কী এবং কিস্তিতে ফ্রিজ কীভাবে নিতে পারি?');
  const [testLookupId, setTestLookupId] = useState('FPC-2026-8899');
  const [testLang, setTestLang] = useState<'bn' | 'en'>('bn');
  const [testOutput, setTestOutput] = useState<{ mode?: string; response?: string; lookupFound?: boolean } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Fetch live settings & analytics from backend API if available
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [settingsRes, knowledgeRes, analyticsRes] = await Promise.all([
          fetch('/api/admin/ai/settings'),
          fetch('/api/admin/ai/knowledge'),
          fetch('/api/admin/ai/analytics'),
        ]);

        if (settingsRes.ok) {
          const sData = await settingsRes.json();
          if (sData.success && sData.settings) {
            setSettings(sData.settings);
            Storage.saveAISettings(sData.settings);
          }
        }

        if (knowledgeRes.ok) {
          const kData = await knowledgeRes.json();
          if (kData.success && kData.knowledge) {
            setKnowledgeList(kData.knowledge);
          }
        }

        if (analyticsRes.ok) {
          const aData = await analyticsRes.json();
          if (aData.success && aData.analytics) {
            setAnalytics(aData.analytics);
          }
        }
      } catch {
        // Fallback to client-side localStorage
      }
    };

    fetchBackendData();
  }, []);

  // Save Settings
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await fetch('/api/admin/ai/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      Storage.saveAISettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      Storage.saveAISettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Knowledge Save
  const handleSaveKnowledge = async () => {
    if (!editingItem || !editingItem.questionBn.trim() || !editingItem.answerBn.trim()) {
      alert('প্রশ্ন এবং উত্তর (বাংলা) পূরণ করা আবশ্যক।');
      return;
    }

    try {
      const res = await fetch('/api/admin/ai/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.item) {
          Storage.saveAIKnowledgeItem(data.item);
          setKnowledgeList(Storage.getAIKnowledge());
        }
      } else {
        Storage.saveAIKnowledgeItem(editingItem);
        setKnowledgeList(Storage.getAIKnowledge());
      }
    } catch {
      Storage.saveAIKnowledgeItem(editingItem);
      setKnowledgeList(Storage.getAIKnowledge());
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Knowledge Delete
  const handleDeleteKnowledge = async (id: string) => {
    if (!window.confirm('আপনি কি এই প্রশ্নোত্তরটি মুছে ফেলতে চান?')) return;
    try {
      await fetch(`/api/admin/ai/knowledge/${id}`, { method: 'DELETE' });
    } catch {
      // Offline fallback
    }
    Storage.deleteAIKnowledgeItem(id);
    setKnowledgeList(Storage.getAIKnowledge());
  };

  // Toggle Item Active
  const handleToggleKnowledgeActive = (item: AIKnowledgeItem) => {
    const updated = { ...item, active: !item.active };
    Storage.saveAIKnowledgeItem(updated);
    setKnowledgeList(Storage.getAIKnowledge());
  };

  // Reset Analytics
  const handleResetAnalytics = async () => {
    if (!window.confirm('আপনি কি সমস্ত চ্যাট কোয়েরি লগ মুছে ফেলতে চান?')) return;
    try {
      await fetch('/api/admin/ai/analytics/reset', { method: 'POST' });
    } catch {
      // Offline
    }
    Storage.resetAIAnalytics();
    setAnalytics(Storage.getAIChatAnalytics());
  };

  // Run Playground Test
  const handleRunTest = async () => {
    if (!testPrompt.trim()) return;
    setIsTesting(true);
    setTestOutput(null);
    try {
      const res = await fetch('/api/admin/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: testPrompt,
          lang: testLang,
          testLookupId: testLookupId.trim() || undefined,
        }),
      });
      const data = await res.json();
      setTestOutput({
        mode: data.mode || 'gemini-3.8-flash',
        response: data.response || 'কোনো প্রতিক্রিয়া পাওয়া যায়নি।',
        lookupFound: data.lookupFound,
      });
    } catch (err: any) {
      setTestOutput({
        mode: 'Client Fallback Error',
        response: `পরীক্ষামূলক অনুরোধ ব্যর্থ হয়েছে: ${err.message}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Filtered Knowledge
  const filteredKnowledge = knowledgeList.filter((k) => {
    const matchesCategory = categoryFilter === 'all' || k.category === categoryFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      k.questionBn.toLowerCase().includes(term) ||
      k.questionEn.toLowerCase().includes(term) ||
      k.answerBn.toLowerCase().includes(term) ||
      k.keywords.some((kw) => kw.toLowerCase().includes(term));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {t('এআই অ্যাসিস্ট্যান্ট ও লাইভ চ্যাট নিয়ন্ত্রণ কেন্দ্র', 'Corporate AI Assistant & Live Chat Control')}
                </h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  settings.enabled
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                }`}>
                  {settings.enabled ? '● সক্রিয় (Online)' : '○ নিষ্ক্রিয় (Offline)'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {t(
                  'গুগল জেমিনাই ৩.৮ ফ্ল্যাশ চালিত বুদ্ধিমান অ্যাসিস্ট্যান্ট। ফেয়ার প্রাইস কার্ড, ডিলার ভেরিফিকেশন ও কাস্টমার সাপোর্টে রিয়েলটাইম সেবা প্রদান করে।',
                  'Powered by Google Gemini 3.8 Flash with grounded business logic, Fair Price Card lookup, and strict anti-hallucination guardrails.'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const nextState = !settings.enabled;
                setSettings({ ...settings, enabled: nextState });
                handleSaveSettings();
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                settings.enabled
                  ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold'
              }`}
            >
              {settings.enabled ? (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>{t('চ্যাট সাময়িক বন্ধ করুন', 'Disable Live AI')}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('চ্যাট চালু করুন', 'Enable Live AI')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{t('কনফিগারেশন সেটিংস', 'AI Configuration')}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('knowledge')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'knowledge'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('নলেজ বেস ম্যানেজার', 'Knowledge Base')}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-amber-300 text-[10px]">
              {knowledgeList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'analytics'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t('অ্যানালিটিক্স ও ইন্টারঅ্যাকশন লগ', 'Analytics & Logs')}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('playground')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'playground'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{t('লাইভ টেস্ট প্লেগ্রাউন্ড', 'Live AI Playground')}</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{t('এআই অ্যাসিস্ট্যান্টের সেটিংস সফলভাবে সংরক্ষিত হয়েছে।', 'AI Assistant settings successfully updated and deployed.')}</span>
        </div>
      )}

      {/* SUB-TAB 1: SETTINGS */}
      {activeSubTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Identity & Personas */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span>{t('অ্যাসিস্ট্যান্ট পরিচিতি ও নাম', 'Assistant Identity & Tone')}</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t('অ্যাসিস্ট্যান্ট নাম (বাংলা)', 'Assistant Name (Bangla)')}
                  </label>
                  <input
                    type="text"
                    value={settings.assistantNameBn}
                    onChange={(e) => setSettings({ ...settings, assistantNameBn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t('অ্যাসিস্ট্যান্ট নাম (ইংরেজি)', 'Assistant Name (English)')}
                  </label>
                  <input
                    type="text"
                    value={settings.assistantNameEn}
                    onChange={(e) => setSettings({ ...settings, assistantNameEn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t('টোন ও আচরণ', 'Conversation Tone')}
                  </label>
                  <select
                    value={settings.tone}
                    onChange={(e) => setSettings({ ...settings, tone: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="professional">প্রফেশনাল ও কর্পোরেট (Professional & Corporate)</option>
                    <option value="friendly">বন্ধুত্বপূর্ণ ও আন্তরিক (Warm & Friendly)</option>
                    <option value="concise">সংক্ষিপ্ত ও টু-দ্য-পয়েন্ট (Concise & Direct)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Welcome Messages */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>{t('স্বাগতম বার্তা (Welcome Messages)', 'Welcome Greetings')}</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t('ওয়েলকাম মেসেজ (বাংলা)', 'Welcome Message (Bangla)')}
                  </label>
                  <textarea
                    rows={3}
                    value={settings.welcomeMessageBn}
                    onChange={(e) => setSettings({ ...settings, welcomeMessageBn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-2.5 text-xs text-white leading-relaxed resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t('ওয়েলকাম মেসেজ (ইংরেজি)', 'Welcome Message (English)')}
                  </label>
                  <textarea
                    rows={3}
                    value={settings.welcomeMessageEn}
                    onChange={(e) => setSettings({ ...settings, welcomeMessageEn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-2.5 text-xs text-white leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Human Support Escalation Info */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{t('হিউম্যান সাপোর্ট ও জরুরি হটলাইন', 'Escalation & Support Hotlines')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t('হটলাইন ফোন নম্বর', 'Support Phone')}
                  </label>
                  <input
                    type="text"
                    value={settings.supportPhone}
                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t('হোয়াটসঅ্যাপ নম্বর', 'WhatsApp Number')}
                  </label>
                  <input
                    type="text"
                    value={settings.supportWhatsapp}
                    onChange={(e) => setSettings({ ...settings, supportWhatsapp: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t('অফিস কর্মঘণ্টা (বাংলা)', 'Operating Hours (Bangla)')}
                  </label>
                  <input
                    type="text"
                    value={settings.supportHoursBn}
                    onChange={(e) => setSettings({ ...settings, supportHoursBn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Anti-Hallucination & Verified Database Guardrails */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{t('ভেরিফায়েড ডাটাবেজ লুকআপ ও গার্ডরেইল', 'Database Lookup & Guardrails')}</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableCustomerLookup}
                    onChange={(e) => setSettings({ ...settings, enableCustomerLookup: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <div>
                    <span className="font-bold text-white block">
                      {t('ফেয়ার প্রাইস কার্ড স্বয়ংক্রিয় স্ট্যাটাস যাচাই', 'Enable Fair Price Card Lookup')}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {t(
                        'গ্রাহক কার্ড নম্বর বা ফোন প্রদান করলে ডাটাবেজ থেকে আসল কোটা ও শিডিউল জানিয়ে দেওয়া হবে।',
                        'Allows real-time verification of card quota and pickup schedules from the cardholder database.'
                      )}
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableDealerLookup}
                    onChange={(e) => setSettings({ ...settings, enableDealerLookup: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <div>
                    <span className="font-bold text-white block">
                      {t('ডিলারশিপ আবেদন স্বয়ংক্রিয় ট্র্যাকিং', 'Enable Dealer Application Tracking')}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {t(
                        'আবেদনকারী HNX আইডি বা ফোন দিলে অনুমোদনের আসল স্ট্যাটাস নির্ভুলভাবে প্রদর্শন করবে।',
                        'Checks live status of HNX-2026 application tracking records securely without hallucination.'
                      )}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? t('সংরক্ষণ হচ্ছে...', 'Saving...') : t('সেটিংস সংরক্ষণ করুন', 'Save AI Configuration')}</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 2: KNOWLEDGE BASE */}
      {activeSubTab === 'knowledge' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('নলেজ বেস খুঁজুন...', 'Search knowledge...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-slate-300"
              >
                <option value="all">{t('সকল ক্যাটাগরি', 'All Categories')}</option>
                <option value="fair_price_card">{t('ফেয়ার প্রাইস কার্ড', 'Fair Price Card')}</option>
                <option value="installments">{t('কিস্তি ও শর্তাবলী', 'Installments')}</option>
                <option value="dealer">{t('ডিলারশিপ ও ট্র্যাকিং', 'Dealership')}</option>
                <option value="products">{t('পণ্য ও ওয়ারেন্টি', 'Products & Catalog')}</option>
                <option value="general">{t('কর্পোরেট পরিচিতি', 'Corporate & Mission')}</option>
                <option value="contact">{t('যোগাযোগ ও হটলাইন', 'Contact & Hours')}</option>
              </select>
            </div>

            <button
              onClick={() => {
                setEditingItem({
                  id: `kb-${Date.now()}`,
                  category: 'general',
                  questionBn: '',
                  questionEn: '',
                  answerBn: '',
                  answerEn: '',
                  keywords: [],
                  active: true,
                  priority: 5,
                  updatedAt: new Date().toISOString(),
                });
                setKeywordInput('');
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors shadow-md shadow-amber-500/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t('নতুন প্রশ্নোত্তর যোগ করুন', 'Add Knowledge Q&A')}</span>
            </button>
          </div>

          {/* List of Knowledge Items */}
          <div className="space-y-3">
            {filteredKnowledge.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/30 rounded-xl p-4 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 uppercase tracking-wider">
                        {item.category.replace(/_/g, ' ')}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {item.active ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Inactive)'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white pt-1">
                      {item.questionBn}
                    </h4>
                    {item.questionEn && (
                      <p className="text-xs text-slate-400 italic">
                        {item.questionEn}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleKnowledgeActive(item)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        item.active
                          ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                          : 'border-slate-700 text-slate-500 hover:bg-slate-800'
                      }`}
                      title={item.active ? 'Disable' : 'Enable'}
                    >
                      {item.active ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        setEditingItem({ ...item });
                        setKeywordInput(item.keywords.join(', '));
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg border border-slate-700 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteKnowledge(item.id)}
                      className="p-1.5 rounded-lg border border-slate-700 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950/80 rounded-lg p-3 text-xs text-slate-300 leading-relaxed whitespace-pre-line border border-slate-800/80">
                  {item.answerBn}
                </div>

                {item.keywords && item.keywords.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 text-[11px] pt-1">
                    <span className="text-slate-500">কীওয়ার্ড:</span>
                    {item.keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[10px]">
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {filteredKnowledge.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs bg-slate-900/50 rounded-2xl border border-slate-800">
                {t('কোনো প্রশ্নোত্তর পাওয়া যায়নি।', 'No matching knowledge items found.')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Knowledge Item Add/Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{editingItem.id.startsWith('kb-') && editingItem.questionBn ? 'প্রশ্নোত্তর সম্পাদনা' : 'নতুন প্রশ্নোত্তর যোগ'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">ক্যাটাগরি</label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="fair_price_card">ফেয়ার প্রাইস কার্ড (Fair Price Card)</option>
                  <option value="installments">কিস্তি সুবিধা ও ডাউনপেমেন্ট (Installments)</option>
                  <option value="dealer">ডিলারশিপ আবেদন ও ট্র্যাকিং (Dealer)</option>
                  <option value="products">পণ্য তালিকা ও ওয়ারেন্টি (Products)</option>
                  <option value="general">কর্পোরেট পরিচিতি ও নেতৃত্ব (General)</option>
                  <option value="contact">যোগাযোগ ও হটলাইন (Contact)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">প্রশ্ন (বাংলা) *</label>
                <input
                  type="text"
                  value={editingItem.questionBn}
                  onChange={(e) => setEditingItem({ ...editingItem, questionBn: e.target.value })}
                  placeholder="যেমন: ফেয়ার প্রাইস কার্ডের সুবিধা কী?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">প্রশ্ন (ইংরেজি - ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={editingItem.questionEn}
                  onChange={(e) => setEditingItem({ ...editingItem, questionEn: e.target.value })}
                  placeholder="e.g. What is the benefit of Fair Price Card?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">অনুমোদিত উত্তর (বাংলা) *</label>
                <textarea
                  rows={4}
                  value={editingItem.answerBn}
                  onChange={(e) => setEditingItem({ ...editingItem, answerBn: e.target.value })}
                  placeholder="অফিসিয়াল সঠিক উত্তর বিস্তারিত লিখুন..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white leading-relaxed resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">অনুমোদিত উত্তর (ইংরেজি - ঐচ্ছিক)</label>
                <textarea
                  rows={3}
                  value={editingItem.answerEn}
                  onChange={(e) => setEditingItem({ ...editingItem, answerEn: e.target.value })}
                  placeholder="Official English response..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white leading-relaxed resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  সার্চ কীওয়ার্ড (কমা দিয়ে আলাদা করুন)
                </label>
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => {
                    setKeywordInput(e.target.value);
                    const kws = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                    setEditingItem({ ...editingItem, keywords: kws });
                  }}
                  placeholder="card, কার্ড, সুবিধা, fair price, discount"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="active_check"
                  checked={editingItem.active}
                  onChange={(e) => setEditingItem({ ...editingItem, active: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <label htmlFor="active_check" className="text-slate-200 text-xs font-semibold cursor-pointer">
                  এই প্রশ্নোত্তরটি এআই এর জন্য সক্রিয় রাখুন (Active in AI Knowledge Base)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleSaveKnowledge}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow-md"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ANALYTICS & LOGS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Metrics Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <span className="text-slate-400 text-xs">{t('মোট বার্তা সংখ্যা', 'Total Messages')}</span>
              <div className="text-2xl font-black text-white mt-1">
                {analytics.totalMessages}
              </div>
              <span className="text-[10px] text-amber-400">রিয়েলটাইম কথোপকথন</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <span className="text-slate-400 text-xs">{t('এআই দ্বারা উত্তর', 'Answered by AI')}</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {analytics.answeredByAI}
              </div>
              <span className="text-[10px] text-emerald-300">জেমিনাই মডেল সফল</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <span className="text-slate-400 text-xs">{t('নলেজ বেস থেকে ম্যাচ', 'Knowledge Matches')}</span>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {analytics.answeredByKnowledgeBase}
              </div>
              <span className="text-[10px] text-amber-300">ভেরিফায়েড কর্পোরেট তথ্য</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <span className="text-slate-400 text-xs">{t('হিউম্যান এসকেলেশন', 'Human Escalated')}</span>
              <div className="text-2xl font-black text-rose-400 mt-1">
                {analytics.escalatedToHuman}
              </div>
              <span className="text-[10px] text-rose-300">সরাসরি হটলাইন রিকোয়েস্ট</span>
            </div>
          </div>

          {/* Language Breakdown */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-white">ভাষা পছন্দ অনুপাত (Language Ratio)</span>
              <span className="text-amber-400">
                বাংলা {analytics.banglaPercentage}% | ইংরেজি {analytics.englishPercentage}%
              </span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
              <div style={{ width: `${analytics.banglaPercentage}%` }} className="bg-amber-500 h-full"></div>
              <div style={{ width: `${analytics.englishPercentage}%` }} className="bg-blue-500 h-full"></div>
            </div>
          </div>

          {/* Top Inquiries */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-amber-400">শীর্ষ অনুসন্ধিত প্রশ্নসমূহ (Top Inquiries)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analytics.topQueries.map((tq, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span className="text-white font-medium truncate pr-2">{tq.query}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold shrink-0">
                    {tq.count} বার
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interaction Logs Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>সাম্প্রতিক ইউজার কোয়েরি লগ (Recent Chat Inquiries)</span>
              </h3>
              <button
                onClick={handleResetAnalytics}
                className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 text-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>লগ পরিষ্কার করুন</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">সময়</th>
                    <th className="pb-3 font-semibold">ব্যবহারকারীর প্রশ্ন</th>
                    <th className="pb-3 font-semibold">এআই উত্তর সারসংক্ষেপ</th>
                    <th className="pb-3 font-semibold">ভাষা</th>
                    <th className="pb-3 font-semibold">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {analytics.recentLogs && analytics.recentLogs.length > 0 ? (
                    analytics.recentLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-3 text-[11px] text-slate-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 font-medium text-white max-w-[220px] truncate">
                          {log.query}
                        </td>
                        <td className="py-3 text-slate-400 max-w-[260px] truncate">
                          {log.replySnippet}
                        </td>
                        <td className="py-3 text-[11px] uppercase font-bold text-amber-400">
                          {log.lang}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'lookup_success'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : log.status === 'answered_ai'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : log.status === 'escalated'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {log.status === 'lookup_success'
                              ? 'DB Lookup'
                              : log.status === 'answered_ai'
                              ? 'Gemini AI'
                              : log.status === 'escalated'
                              ? 'Escalated'
                              : 'Knowledge Base'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                        কোনো সাম্প্রতিক লগ রেকর্ড পাওয়া যায়নি।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PLAYGROUND */}
      {activeSubTab === 'playground' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-amber-400" />
              <span>{t('লাইভ এআই টেস্ট প্লেগ্রাউন্ড', 'Live AI Test Playground')}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              অ্যাডমিন হিসেবে সরাসরি সার্ভার-সাইড জেমিনাই মডেল ও ডাটাবেজ লুকআপের প্রতিক্রিয়া পরীক্ষা করুন।
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  পরীক্ষামূলক প্রশ্ন (Test User Prompt)
                </label>
                <input
                  type="text"
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white"
                  placeholder="যেমন: আমার ফেয়ার প্রাইস কার্ডের অবস্থা কী?"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  টেস্ট লুকআপ আইডি বা মোবাইল (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={testLookupId}
                  onChange={(e) => setTestLookupId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  placeholder="FPC-2026-8899 / HNX-2026-000101"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">ভাষা:</span>
                <button
                  onClick={() => setTestLang('bn')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    testLang === 'bn' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  বাংলা (BN)
                </button>
                <button
                  onClick={() => setTestLang('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    testLang === 'en' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  English (EN)
                </button>
              </div>

              <button
                onClick={handleRunTest}
                disabled={isTesting || !testPrompt.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow transition-all disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>মডেল প্রসেসিং হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>রান টেস্ট (Run Test)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Test Results Output */}
          {testOutput && (
            <div className="p-5 bg-slate-950 rounded-2xl border border-amber-500/30 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">ব্যবহৃত ইঞ্জিন:</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px]">
                    {testOutput.mode}
                  </span>
                </div>
                {testOutput.lookupFound && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    ✓ ভেরিফায়েড ডাটাবেজ রেকর্ড ম্যাচ
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {testOutput.response}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
