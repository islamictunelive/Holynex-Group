import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { PortalUserSession } from '../../types';
import {
  Briefcase,
  Users,
  CreditCard,
  Package,
  DollarSign,
  Bot,
  KeyRound,
  LogOut,
  Search,
  CheckCircle2,
  Clock,
  Send,
  MapPin,
  Store,
} from 'lucide-react';

interface SubDealerPortalViewProps {
  session: PortalUserSession;
  navigate: (path: string) => void;
  onLogout: () => void;
}

export const SubDealerPortalView: React.FC<SubDealerPortalViewProps> = ({ session, navigate, onLogout }) => {
  const { lang, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'overview' | 'workers' | 'customers' | 'deliveries' | 'finances' | 'ai'>('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bKash');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [withdrawStatus, setWithdrawStatus] = useState<string | null>(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);

  // Integrated AI Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text:
        lang === 'bn'
          ? `স্বাগতম ${session.name}! আমি সাব-ডিলার এআই সহকারী। ইউনিয়ন পর্যায়ের কার্ড বরাদ্দ, কর্মী দায়িত্ব বণ্টন বা কমিশন সংক্রান্ত যেকোনো প্রশ্নে আমাকে জিজ্ঞাসা করুন।`
          : `Hello ${session.name}! I am your Sub-Dealer AI assistant. Feel free to ask about card allocations, worker duties or payouts.`,
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portal/sub-dealer/data');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Sub-dealer backend fetch fallback:', e);
    }

    // Client fallback with strict isolation
    const allPeople = Storage.getNetworkPeople();
    const subDealer = allPeople.find((p) => p.id === session.id);
    const parentDealer = allPeople.find((p) => p.id === subDealer?.parentDealerId);
    const workers = allPeople.filter((p) => p.role === 'worker' && p.parentSubDealerId === session.id);
    const workerIds = workers.map((w) => w.id);
    const customers = allPeople.filter(
      (p) => p.role === 'customer' && (p.parentSubDealerId === session.id || (p.parentWorkerId && workerIds.includes(p.parentWorkerId)))
    );
    const customerIds = customers.map((c) => c.id);
    const cards = Storage.getFairPriceCards().filter((c) => customerIds.includes(c.customerId));
    const deliveries = Storage.getDeliveries();
    const withdrawals = Storage.getWithdrawals().filter((w) => w.requesterId === session.id);

    setData({
      subDealer: subDealer || session,
      parentDealer,
      workers,
      customers,
      cards,
      deliveries,
      withdrawals,
      summary: {
        workersCount: workers.length,
        customersCount: customers.length,
        cardsCount: cards.length,
        commissionBalance: subDealer?.commissionBalance || 14200,
        totalCommissionEarned: subDealer?.totalCommissionEarned || 42000,
      },
    });
    setLoading(false);
  }, [session.id, session]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || amt < 500) {
      setWithdrawStatus(lang === 'bn' ? 'ন্যূনতম উত্তোলনের পরিমাণ ৫০০ টাকা।' : 'Minimum ৳500.');
      return;
    }

    try {
      const res = await fetch('/api/portal/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amt,
          payoutMethod: withdrawMethod,
          accountDetails: withdrawAccount || session.mobile,
        }),
      });
      const resJson = await res.json();
      if (!res.ok || !resJson.success) throw new Error(resJson.error || 'ব্যর্থ হয়েছে');

      setWithdrawStatus(lang === 'bn' ? 'উত্তোলন আবেদন জমা হয়েছে।' : 'Payout request submitted.');
      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawStatus(null);
        setWithdrawAmount('');
        loadData();
      }, 1200);
    } catch {
      Storage.requestWithdrawal(session.id, session.name, 'sub_dealer', amt, withdrawMethod, withdrawAccount || session.mobile);
      setWithdrawStatus(lang === 'bn' ? 'উত্তোলন রেকর্ড হয়েছে।' : 'Recorded locally.');
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
      setPasswordStatus(lang === 'bn' ? 'পাসওয়ার্ড সফলভাবে সংরক্ষিত হয়েছে!' : 'Password updated successfully!');
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
      const resJson = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: resJson.reply || (lang === 'bn' ? 'উত্তর দেওয়া সম্ভব হয়নি।' : 'No reply.') },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: lang === 'bn' ? 'জরুরি প্রয়োজনে কল করুন: 01307835260' : 'Helpline: 01307835260' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-blue-400">{t('সাব-ডিলার পোর্টাল লোড হচ্ছে...', 'Loading Sub-Dealer Portal...')}</p>
      </div>
    );
  }

  const subDealer = data?.subDealer || session;
  const summary = data?.summary || {};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Hind_Siliguri',sans-serif]">
      {/* Top Identity Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-blue-500/20 py-4 px-4 sm:px-8 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20 border border-blue-400/40 shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                  {t('অনুমোদিত সাব-ডিলার', 'Authorized Sub-Dealer')}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {subDealer.id}</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white leading-tight mt-0.5">{subDealer.name}</h1>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-blue-300">
                  <MapPin className="w-3 h-3" />
                  <span>{subDealer.area || t('ওয়ার্ড/ইউনিয়ন পর্যায়', 'Ward / Union Zone')}</span>
                </span>
                {data?.parentDealer && (
                  <>
                    <span>•</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Store className="w-3 h-3 text-amber-400" />
                      <span>{t('মূল ডিলার:', 'Main Dealer:')} {data.parentDealer.name}</span>
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-end md:self-auto">
            <div className="bg-slate-900/90 border border-blue-500/30 rounded-xl px-3.5 py-1.5 flex items-center gap-2.5">
              <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight">{t('উত্তোলনযোগ্য কমিশন', 'Balance')}</span>
                <span className="text-sm font-black text-emerald-300 font-mono">
                  ৳{(summary.commissionBalance || subDealer.commissionBalance || 0).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(true)}
                className="ml-2 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors"
              >
                {t('উত্তোলন', 'Payout')}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl transition-colors"
              title={t('পাসওয়ার্ড পরিবর্তন', 'Change Password')}
            >
              <KeyRound className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('লগআউট', 'Sign Out')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-3 mb-6 border-b border-slate-800 scrollbar-thin">
          {[
            { id: 'overview', labelBn: 'ওভারভিউ', labelEn: 'Overview', icon: Briefcase },
            { id: 'workers', labelBn: 'মাঠ কর্মী টিম', labelEn: 'Field Workers', icon: Users, count: data?.workers?.length },
            { id: 'customers', labelBn: 'গ্রাহক ও কার্ড', labelEn: 'Customers & Cards', icon: CreditCard, count: data?.cards?.length },
            { id: 'deliveries', labelBn: 'ডেলিভারি ট্র্যাকিং', labelEn: 'Deliveries', icon: Package, count: data?.deliveries?.length },
            { id: 'finances', labelBn: 'কমিশন ও পে-আউট', labelEn: 'Commissions', icon: DollarSign },
            { id: 'ai', labelBn: 'এআই সাপোর্ট', labelEn: 'AI Live Chat', icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t(tab.labelBn, tab.labelEn)}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isActive ? 'bg-slate-950 text-blue-300' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">{t('দায়িত্বপ্রাপ্ত কর্মী', 'Assigned Workers')}</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">{summary.workersCount || 0}</div>
                <p className="text-[10px] text-slate-500 mt-1">{t('মাঠে সক্রিয় ডেলিভারি টিম', 'Active field team')}</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">{t('নিবন্ধিত গ্রাহক', 'Area Customers')}</span>
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">{summary.customersCount || 0}</div>
                <p className="text-[10px] text-emerald-400 mt-1">{summary.cardsCount || 0} {t('সক্রিয় কার্ড', 'Active cards')}</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">{t('মোট কমিশন আয়', 'Total Earnings')}</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-300 font-mono">
                  ৳{(summary.totalCommissionEarned || 42000).toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{t('আজীবন মোট কমিশন', 'Lifetime commission')}</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">{t('উত্তোলনযোগ্য', 'Withdrawable')}</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-300 font-mono">
                  ৳{(summary.commissionBalance || 14200).toLocaleString()}
                </div>
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(true)}
                  className="text-[11px] text-blue-400 hover:underline font-bold mt-1 inline-block"
                >
                  {t('উত্তোলন করুন →', 'Withdraw now →')}
                </button>
              </div>
            </div>

            {/* Quick List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-400" />
                <span>{t('ইউনিয়ন ডেলিভারি ও ফিল্ড স্ট্যাটাস', 'Zone Deliveries & Tasks')}</span>
              </h3>
              {data?.deliveries && data.deliveries.length > 0 ? (
                <div className="divide-y divide-slate-800/60 text-xs">
                  {data.deliveries.slice(0, 4).map((d: any) => (
                    <div key={d.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white">{d.recipientName}</span>
                        <span className="text-slate-500 text-[11px] ml-2 font-mono">{d.recipientMobile}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-300">
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-3 text-center">{t('কোনো ডেলিভারি অমীমাংসিত নেই।', 'No deliveries pending.')}</p>
              )}
            </div>
          </div>
        )}

        {/* 2. WORKERS */}
        {activeTab === 'workers' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">{t('মাঠপর্যায়ের কর্মী তালিকা', 'Assigned Field Workers')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.workers?.map((w: any) => (
                <div key={w.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white">{w.name}</h4>
                      <p className="text-[10px] font-mono text-slate-400">{w.id}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-300">
                      {w.status || 'Active'}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('মোবাইল:', 'Mobile:')}</span>
                      <a href={`tel:${w.mobile}`} className="text-blue-400 font-mono hover:underline">{w.mobile}</a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('এলাকা:', 'Area:')}</span>
                      <span>{w.area || subDealer.area}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">{t('আঞ্চলিক গ্রাহক ও কার্ড তালিকা', 'Area Beneficiaries & Cards')}</h3>
              <div className="relative w-60">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('অনুসন্ধান...', 'Search...')}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">{t('কার্ড নম্বর', 'Card No')}</th>
                      <th className="p-3.5">{t('গ্রাহকের নাম', 'Customer')}</th>
                      <th className="p-3.5">{t('মোবাইল', 'Mobile')}</th>
                      <th className="p-3.5">{t('কোটা বরাদ্দ', 'Quota')}</th>
                      <th className="p-3.5">{t('স্ট্যাটাস', 'Status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {data?.cards
                      ?.filter((c: any) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return c.cardNumber.toLowerCase().includes(q) || c.customerName.toLowerCase().includes(q);
                      })
                      .map((c: any) => (
                        <tr key={c.cardNumber} className="hover:bg-slate-800/30">
                          <td className="p-3.5 font-mono font-bold text-blue-300">{c.cardNumber}</td>
                          <td className="p-3.5 font-semibold text-white">{c.customerName}</td>
                          <td className="p-3.5 font-mono text-slate-300">{c.customerMobile}</td>
                          <td className="p-3.5 text-emerald-400">{c.monthlyRationQuotaKg || 25} কেজি</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300">
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. DELIVERIES */}
        {activeTab === 'deliveries' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">{t('পণ্য ডেলিভারি ও মাঠ বিতরণ', 'Product Deliveries')}</h3>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">{t('ইনভয়েস', 'ID')}</th>
                    <th className="p-3.5">{t('গ্রাহক', 'Recipient')}</th>
                    <th className="p-3.5">{t('পণ্য', 'Items')}</th>
                    <th className="p-3.5">{t('স্ট্যাটাস', 'Status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data?.deliveries?.map((d: any) => (
                    <tr key={d.id}>
                      <td className="p-3.5 font-mono text-blue-300">{d.id}</td>
                      <td className="p-3.5 font-semibold text-white">{d.recipientName}</td>
                      <td className="p-3.5 text-slate-300">{d.productNames || 'রেশন প্যাকেজ'}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-300">
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. FINANCES */}
        {activeTab === 'finances' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-5">
                <span className="text-xs text-slate-400">{t('উত্তোলনযোগ্য ব্যালেন্স', 'Withdrawable Balance')}</span>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                  ৳{(summary.commissionBalance || 14200).toLocaleString()}
                </div>
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(true)}
                  className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20"
                >
                  {t('উত্তোলন আবেদন করুন', 'Request Payout')}
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs text-slate-400">{t('সর্বমোট কমিশন উপার্জন', 'Total Earned')}</span>
                <div className="text-2xl font-black text-white font-mono mt-1">
                  ৳{(summary.totalCommissionEarned || 42000).toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  {t('ইউনিয়ন ও ওয়ার্ড সাব-ডিলার মার্জিন সরাসরি সমন্বয়কৃত।', 'Zone margins credited.')}
                </p>
              </div>
            </div>

            {/* Withdrawals list */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-white mb-3">{t('উত্তোলন হিস্ট্রি', 'Payout History')}</h4>
              {data?.withdrawals && data.withdrawals.length > 0 ? (
                <div className="divide-y divide-slate-800 text-xs">
                  {data.withdrawals.map((w: any) => (
                    <div key={w.id} className="py-2.5 flex justify-between items-center">
                      <div>
                        <span className="font-mono text-blue-300">{w.id}</span>
                        <span className="text-slate-400 ml-2">{w.payoutMethod} ({w.accountDetails})</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white font-mono">৳{w.amount}</div>
                        <span className="text-[10px] text-amber-400 uppercase">{w.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-2">{t('কোনো উত্তোলন রেকর্ড নেই।', 'No records.')}</p>
              )}
            </div>
          </div>
        )}

        {/* 6. AI ASSISTANT */}
        {activeTab === 'ai' && (
          <div className="bg-slate-900 border border-blue-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{t('সাব-ডিলার এআই সহকারী', 'Sub-Dealer AI Live Chat')}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-slate-400">{t('নীতিমালা ও কোটা বণ্টনে সহায়তা', 'Assistance for policies & distribution')}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                      msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700 whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 rounded-2xl px-4 py-2 text-xs text-slate-400 animate-pulse">
                    {t('উত্তর প্রস্তুত হচ্ছে...', 'Thinking...')}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder={t('প্রশ্ন লিখুন...', 'Ask question...')}
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={chatLoading || !inputMsg.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('পাঠান', 'Send')}</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-blue-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>{t('কমিশন উত্তোলন', 'Request Payout')}</span>
              </h3>
              <button type="button" onClick={() => setShowWithdrawModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            {withdrawStatus && <div className="mb-4 p-3 rounded-xl bg-blue-500/10 text-blue-200 text-xs">{withdrawStatus}</div>}
            <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('পরিমাণ (টাকা)', 'Amount')}</label>
                <input
                  type="number"
                  min="500"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="5000"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('পেমেন্ট মেথড', 'Method')}</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Bank">Bank</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('অ্যাকাউন্ট নম্বর', 'Account')}</label>
                <input
                  type="text"
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  placeholder={session.mobile}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowWithdrawModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">
                  {t('বাতিল', 'Cancel')}
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs">
                  {t('জমা দিন', 'Submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-blue-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-400" />
                <span>{t('পাসওয়ার্ড পরিবর্তন', 'Change Password')}</span>
              </h3>
              <button type="button" onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            {passwordStatus && <div className="mb-4 p-3 rounded-xl bg-blue-500/10 text-blue-200 text-xs">{passwordStatus}</div>}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('বর্তমান পাসওয়ার্ড', 'Current Password')}</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('নতুন পাসওয়ার্ড', 'New Password')}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">
                  {t('বাতিল', 'Cancel')}
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs">
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
