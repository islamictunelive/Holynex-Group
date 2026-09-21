import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { PortalUserSession } from '../../types';
import {
  Users,
  Package,
  CreditCard,
  DollarSign,
  Bot,
  KeyRound,
  LogOut,
  CheckCircle2,
  Clock,
  Send,
  Phone,
  MapPin,
  Truck,
  AlertCircle,
} from 'lucide-react';

interface WorkerPortalViewProps {
  session: PortalUserSession;
  navigate: (path: string) => void;
  onLogout: () => void;
}

export const WorkerPortalView: React.FC<WorkerPortalViewProps> = ({ session, navigate, onLogout }) => {
  const { lang, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'tasks' | 'customers' | 'earnings' | 'ai'>('tasks');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Delivery action modal
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [otpInput, setOtpInput] = useState('');
  const [deliverySuccess, setDeliverySuccess] = useState<string | null>(null);

  // Withdraw modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bKash');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [withdrawStatus, setWithdrawStatus] = useState<string | null>(null);

  // Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);

  // AI Field Chat
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text:
        lang === 'bn'
          ? `আসসালামু আলাইকুম ${session.name}! আমি মাঠকর্মী এআই সহকারী। ডেলিভারি নিয়ম, কিস্তি হিসাব বা গ্রাহকের কার্ড সংক্রান্ত যেকোনো তথ্য জানতে প্রশ্ন করুন।`
          : `Hello ${session.name}! I am your Field Worker AI Assistant. Ask me anything about delivery verification, card quotas, or installment rules.`,
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portal/worker/data');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Worker portal fetch fallback:', e);
    }

    // Client fallback
    const allPeople = Storage.getNetworkPeople();
    const worker = allPeople.find((p) => p.id === session.id);
    const customers = allPeople.filter((p) => p.role === 'customer' && p.parentWorkerId === session.id);
    const customerIds = customers.map((c) => c.id);
    const cards = Storage.getFairPriceCards().filter((c) => customerIds.includes(c.customerId));
    const deliveries = Storage.getDeliveries().filter(
      (d) => d.assignedRepresentative === session.id || d.assignedRepresentative === session.name || d.recipientMobile
    );
    const withdrawals = Storage.getWithdrawals().filter((w) => w.requesterId === session.id);

    setData({
      worker: worker || session,
      customers,
      cards,
      deliveries: deliveries.length > 0 ? deliveries : Storage.getDeliveries().slice(0, 5),
      withdrawals,
      summary: {
        assignedCustomersCount: customers.length,
        pendingDeliveriesCount: deliveries.filter((d) => d.status !== 'delivered').length,
        completedDeliveriesCount: deliveries.filter((d) => d.status === 'delivered').length,
        commissionBalance: worker?.commissionBalance || 4850,
      },
    });
    setLoading(false);
  }, [session.id, session]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCompleteDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDelivery) return;

    try {
      const res = await fetch('/api/portal/worker/complete-delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryId: selectedDelivery.id, otp: otpInput }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'ডেলিভারি সম্পন্ন হয়নি');

      setDeliverySuccess(lang === 'bn' ? 'ডেলিভারি সফলভাবে কনফার্ম করা হয়েছে!' : 'Delivery verified & confirmed!');
      setTimeout(() => {
        setSelectedDelivery(null);
        setDeliverySuccess(null);
        setOtpInput('');
        loadData();
      }, 1200);
    } catch {
      // Offline fallback
      Storage.recordDeliveryUpdate(selectedDelivery.id, 'delivered', 'Worker field confirmation');
      setDeliverySuccess(lang === 'bn' ? 'ডেলিভারি সফলভাবে সম্পন্ন হয়েছে।' : 'Delivery completed locally.');
      setTimeout(() => {
        setSelectedDelivery(null);
        setDeliverySuccess(null);
        setOtpInput('');
        loadData();
      }, 1200);
    }
  };

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || amt < 300) {
      setWithdrawStatus(lang === 'bn' ? 'ন্যূনতম উত্তোলনের পরিমাণ ৩০০ টাকা।' : 'Minimum payout is ৳300.');
      return;
    }
    try {
      await fetch('/api/portal/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amt,
          payoutMethod: withdrawMethod,
          accountDetails: withdrawAccount || session.mobile,
        }),
      });
      setWithdrawStatus(lang === 'bn' ? 'আবেদন জমা হয়েছে।' : 'Submitted.');
      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawStatus(null);
        setWithdrawAmount('');
        loadData();
      }, 1200);
    } catch {
      Storage.requestWithdrawal(session.id, session.name, 'worker', amt, withdrawMethod, withdrawAccount || session.mobile);
      setWithdrawStatus(lang === 'bn' ? 'আবেদন জমা হয়েছে।' : 'Submitted.');
      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawStatus(null);
        setWithdrawAmount('');
        loadData();
      }, 1200);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordStatus(lang === 'bn' ? 'ন্যূনতম ৬ অক্ষর আবশ্যক।' : 'Minimum 6 characters.');
      return;
    }
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const resJson = await res.json();
      if (!res.ok || !resJson.success) throw new Error(resJson.error);
      setPasswordStatus(lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তিত হয়েছে!' : 'Password changed!');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordStatus(null);
        setOldPassword('');
        setNewPassword('');
      }, 1200);
    } catch (err: any) {
      setPasswordStatus(err.message || 'ভুল পাসওয়ার্ড।');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || chatLoading) return;
    const userText = inputMsg.trim();
    setInputMsg('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          lang,
          history: chatMessages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });
      const json = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: json.reply || (lang === 'bn' ? 'উত্তর পাওয়া যায়নি।' : 'No answer.') },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: lang === 'bn' ? 'হেল্পলাইনে যোগাযোগ করুন: 01307835260' : 'Helpline: 01307835260' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-emerald-400">{t('কর্মী পোর্টাল লোড হচ্ছে...', 'Loading Worker Portal...')}</p>
      </div>
    );
  }

  const worker = data?.worker || session;
  const summary = data?.summary || {};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Hind_Siliguri',sans-serif]">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-emerald-500/20 py-4 px-4 sm:px-8 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 border border-emerald-400/40 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {t('মাঠ কর্মী / ডেলিভারি প্রতিনিধি', 'Field Worker / Delivery Agent')}
                </span>
                <span className="text-xs font-mono text-slate-400">ID: {worker.id}</span>
              </div>
              <h1 className="text-base font-bold text-white leading-tight mt-0.5">{worker.name}</h1>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{worker.area || t('ফিল্ড ডেলিভারি জোন', 'Field Zone')}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="bg-slate-900 border border-emerald-500/30 rounded-xl px-3 py-1.5 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[9px] text-slate-400 block">{t('ইনসেনটিভ ব্যালেন্স', 'Incentives')}</span>
                <span className="text-xs font-black text-emerald-300 font-mono">
                  ৳{(summary.commissionBalance || worker.commissionBalance || 0).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(true)}
                className="ml-1 px-2 py-0.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] rounded"
              >
                {t('উত্তোলন', 'Payout')}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700"
              title={t('পাসওয়ার্ড', 'Password')}
            >
              <KeyRound className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="px-2.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 rounded-xl text-xs flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('বাহির', 'Exit')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-5">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-3 mb-5 border-b border-slate-800 scrollbar-thin">
          {[
            { id: 'tasks', labelBn: 'ডেলিভারি টাস্ক', labelEn: 'Delivery Tasks', icon: Truck, count: data?.deliveries?.length },
            { id: 'customers', labelBn: 'দায়িত্বপ্রাপ্ত পরিবার', labelEn: 'Assigned Families', icon: CreditCard, count: data?.cards?.length },
            { id: 'earnings', labelBn: 'ইনসেনটিভ হিসেব', labelEn: 'Earnings', icon: DollarSign },
            { id: 'ai', labelBn: 'মাঠ এআই গাইড', labelEn: 'Field AI Guide', icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t(tab.labelBn, tab.labelEn)}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-slate-950 text-emerald-400' : 'bg-slate-800'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 1. TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white">{t('আজকের ডেলিভারি ও ফিল্ড টাস্ক', 'Assigned Supply Deliveries')}</h3>
                <p className="text-[11px] text-slate-400">{t('পণ্য বুঝিয়ে দিয়ে নিশ্চিতকরণ বাটন চাপুন', 'Deliver packages & confirm verification')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.deliveries?.map((d: any) => {
                const isDelivered = d.status === 'Delivered';
                return (
                  <div
                    key={d.id}
                    className={`bg-slate-900 border rounded-2xl p-4 transition-all ${
                      isDelivered ? 'border-slate-800 opacity-80' : 'border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-mono text-emerald-400 text-xs font-bold">{d.id}</span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{d.recipientName}</h4>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isDelivered ? 'bg-slate-800 text-emerald-400' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300 my-3">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <a href={`tel:${d.recipientMobile}`} className="text-emerald-400 font-mono hover:underline">
                          {d.recipientMobile}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate">{d.deliveryAddress || 'স্থানীয় ঠিকানা'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Package className="w-3.5 h-3.5 text-slate-500" />
                        <span>{d.productNames || 'মাসিক রেশন প্যাকেজ'}</span>
                      </div>
                    </div>

                    {!isDelivered ? (
                      <button
                        type="button"
                        onClick={() => setSelectedDelivery(d)}
                        className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('ডেলিভারি সম্পন্ন করুন', 'Confirm Delivered')}</span>
                      </button>
                    ) : (
                      <div className="text-[11px] text-emerald-400 flex items-center justify-center gap-1 pt-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('ডেলিভারি সম্পন্ন হয়েছে', 'Delivered & Recorded')}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">{t('দায়িত্বপ্রাপ্ত গ্রাহক ও পরিবারসমূহ', 'Assigned Beneficiary Families')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {data?.cards?.map((c: any) => (
                <div key={c.cardNumber} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">{c.cardNumber}</span>
                      <h4 className="text-xs font-bold text-white">{c.customerName}</h4>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/15 text-emerald-300 uppercase">
                      {c.status}
                    </span>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('ফোন:', 'Phone:')}</span>
                      <a href={`tel:${c.customerMobile}`} className="text-emerald-400 font-mono">{c.customerMobile}</a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('রেশন কোটা:', 'Quota:')}</span>
                      <span className="text-white font-semibold">{c.monthlyRationQuotaKg || 25} কেজি / মাস</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. EARNINGS TAB */}
        {activeTab === 'earnings' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5">
                <span className="text-xs text-slate-400">{t('বর্তমান উত্তোলনযোগ্য ইনসেনটিভ', 'Incentive Balance')}</span>
                <div className="text-2xl font-black text-emerald-300 font-mono mt-1">
                  ৳{(summary.commissionBalance || worker.commissionBalance || 0).toLocaleString()}
                </div>
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(true)}
                  className="mt-4 w-full py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
                >
                  {t('উত্তোলন আবেদন করুন', 'Request Payout')}
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs text-slate-400">{t('ডেলিভারি ইনসেনটিভ নীতি', 'Incentive Rules')}</span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {t(
                    'প্রতিটি সফল ফেয়ার প্রাইস কার্ড ডেলিভারি এবং কিস্তি উত্তোলনে নির্ধারিত নগদ ইনসেনটিভ স্বয়ংক্রিয়ভাবে অ্যাকাউন্টে জমা হয়।',
                    'Cash incentives are credited automatically upon successful delivery verification.'
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. AI FIELD GUIDE TAB */}
        {activeTab === 'ai' && (
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
            <div className="bg-slate-950 p-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{t('মাঠকর্মী এআই লাইভ গাইড', 'Field Worker AI Live Guide')}</h4>
                  <p className="text-[10px] text-slate-400">{t('পণ্য স্পেসিফিকেশন ও ফিল্ড প্রশ্নের তাৎক্ষণিক উত্তর', 'Instant answers for field queries')}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs ${
                      msg.sender === 'user' ? 'bg-emerald-500 text-slate-950 font-medium' : 'bg-slate-800 text-slate-200 border border-slate-700 whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-400">...</div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-2.5 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder={t('প্রশ্ন লিখুন...', 'Ask question...')}
                className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={chatLoading || !inputMsg.trim()}
                className="px-3.5 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>{t('পাঠান', 'Send')}</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* CONFIRM DELIVERY MODAL */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-sm w-full p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-2">{t('ডেলিভারি কনফার্মেশন', 'Confirm Delivery')}</h3>
            <p className="text-xs text-slate-300 mb-3">
              {t('গ্রাহক:', 'Customer:')} <strong>{selectedDelivery.recipientName}</strong> ({selectedDelivery.recipientMobile})
            </p>

            {deliverySuccess && (
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                {deliverySuccess}
              </div>
            )}

            <form onSubmit={handleCompleteDelivery} className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  {t('গ্রাহকের ওটিপি / নোট (ঐচ্ছিক)', 'Customer OTP / Note (Optional)')}
                </label>
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="যেমন: 4589"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedDelivery(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  {t('সম্পন্ন নিশ্চিত করুন', 'Confirm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-sm w-full p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-white">{t('ইনসেনটিভ উত্তোলন', 'Incentive Payout')}</h3>
              <button type="button" onClick={() => setShowWithdrawModal(false)} className="text-slate-400">✕</button>
            </div>
            {withdrawStatus && <div className="mb-3 p-2 bg-emerald-500/10 text-emerald-300 text-xs rounded-xl">{withdrawStatus}</div>}
            <form onSubmit={handleWithdrawalSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">{t('পরিমাণ (টাকা)', 'Amount')}</label>
                <input
                  type="number"
                  min="300"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="1000"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">{t('মাধ্যম', 'Method')}</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">{t('নম্বর', 'Account')}</label>
                <input
                  type="text"
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  placeholder={session.mobile}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={() => setShowWithdrawModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs">
                  {t('বাতিল', 'Cancel')}
                </button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs">
                  {t('আবেদন করুন', 'Submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-sm w-full p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-white">{t('পাসওয়ার্ড পরিবর্তন', 'Change Password')}</h3>
              <button type="button" onClick={() => setShowPasswordModal(false)} className="text-slate-400">✕</button>
            </div>
            {passwordStatus && <div className="mb-3 p-2 bg-emerald-500/10 text-emerald-300 text-xs rounded-xl">{passwordStatus}</div>}
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">{t('বর্তমান পাসওয়ার্ড', 'Current')}</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">{t('নতুন পাসওয়ার্ড', 'New')}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs">
                  {t('বাতিল', 'Cancel')}
                </button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs">
                  {t('সংরক্ষণ করুন', 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
