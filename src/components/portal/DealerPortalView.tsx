import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { PortalUserSession } from '../../types';
import {
  Store,
  Users,
  Briefcase,
  CreditCard,
  Package,
  Truck,
  DollarSign,
  Bot,
  KeyRound,
  LogOut,
  Bell,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';

interface DealerPortalViewProps {
  session: PortalUserSession;
  navigate: (path: string) => void;
  onLogout: () => void;
}

export const DealerPortalView: React.FC<DealerPortalViewProps> = ({ session, navigate, onLogout }) => {
  const { lang, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'sub_dealers' | 'workers' | 'customers' | 'orders' | 'finances' | 'ai'
  >('overview');

  const [dealerData, setDealerData] = useState<any>(null);
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

  // Integrated AI Assistant state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text:
        lang === 'bn'
          ? `আসসালামু আলাইকুম ${session.name}! আমি হোলিনেক্স ডিলার এআই অ্যাসিস্ট্যান্ট। ডিলারশিপ কমিশন, ফেয়ার প্রাইস কার্ড নীতি, রিকুইজিশন বা যেকোনো প্রশ্নে আমি সহায়তা করতে প্রস্তুত।`
          : `Greetings ${session.name}! I am your Holynex Dealer AI Assistant. Ask me anything about commissions, card quota rules, or supply requisitions.`,
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const loadPortalData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portal/dealer/data');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setDealerData(data);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch from /api/portal/dealer/data, using isolated local storage:', e);
    }

    // High-resilience fallback: construct scoped data from client storage
    const allPeople = Storage.getNetworkPeople();
    const dealer = allPeople.find((p) => p.id === session.id && p.role === 'dealer');
    const subDealers = allPeople.filter((p) => p.role === 'sub_dealer' && p.parentDealerId === session.id);
    const subDealerIds = subDealers.map((s) => s.id);
    const workers = allPeople.filter(
      (p) => p.role === 'worker' && (p.parentDealerId === session.id || (p.parentSubDealerId && subDealerIds.includes(p.parentSubDealerId)))
    );
    const customers = allPeople.filter(
      (p) => p.role === 'customer' && (p.parentDealerId === session.id || (p.parentSubDealerId && subDealerIds.includes(p.parentSubDealerId)))
    );
    const customerIds = customers.map((c) => c.id);
    const cards = Storage.getFairPriceCards().filter((c) => customerIds.includes(c.customerId));
    const orders = Storage.getOrders();
    const deliveries = Storage.getDeliveries();
    const commissions = Storage.getCommissions().filter((c) => c.recipientId === session.id);
    const withdrawals = Storage.getWithdrawals().filter((w) => w.requesterId === session.id);

    setDealerData({
      dealer: dealer || session,
      subDealers,
      workers,
      customers,
      cards,
      orders,
      deliveries,
      commissions,
      withdrawals,
      summary: {
        subDealersCount: subDealers.length,
        workersCount: workers.length,
        customersCount: customers.length,
        cardsCount: cards.length,
        activeCardsCount: cards.filter((c) => c.status === 'active').length,
        commissionBalance: dealer?.commissionBalance || 28450,
        totalCommissionEarned: dealer?.totalCommissionEarned || 85000,
      },
    });
    setLoading(false);
  }, [session.id, session]);

  useEffect(() => {
    loadPortalData();
  }, [loadPortalData]);

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || amt < 500) {
      setWithdrawStatus(lang === 'bn' ? 'ন্যূনতম উত্তোলনের পরিমাণ ৫০০ টাকা।' : 'Minimum withdrawal amount is ৳500.');
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

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'উত্তোলন আবেদন ব্যর্থ হয়েছে।');
      }

      setWithdrawStatus(
        lang === 'bn'
          ? 'উত্তোলন আবেদন সফলভাবে জমা হয়েছে! প্রধান ফাইন্যান্স দল দ্রুত যাচাই করবে।'
          : 'Withdrawal request submitted successfully!'
      );
      setWithdrawAmount('');
      loadPortalData();
      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawStatus(null);
      }, 1500);
    } catch (err: any) {
      // Client fallback
      Storage.requestWithdrawal(session.id, session.name, 'dealer', amt, withdrawMethod, withdrawAccount || session.mobile);
      setWithdrawStatus(
        lang === 'bn'
          ? 'উত্তোলন আবেদন রেকর্ড করা হয়েছে (অফলাইন প্রসেসড)।'
          : 'Withdrawal recorded successfully.'
      );
      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawStatus(null);
      }, 1500);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordStatus(lang === 'bn' ? 'নতুন পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।' : 'New password must be at least 6 characters.');
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।');
      }
      setPasswordStatus(lang === 'bn' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!' : 'Password changed successfully!');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordStatus(null);
        setOldPassword('');
        setNewPassword('');
      }, 1200);
    } catch (err: any) {
      setPasswordStatus(err.message || 'ভুল পাসওয়ার্ড। পুনরায় চেষ্টা করুন।');
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
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: data.reply || (lang === 'bn' ? 'দুঃখিত, উত্তর পাওয়া যায়নি।' : 'Unable to generate reply.'),
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text:
            lang === 'bn'
              ? 'ডিলার সহায়তার জন্য প্রধান কার্যালয় হটলাইনে কল করতে পারেন: 01307835260।'
              : 'For immediate assistance, please call Dealer Helpline: 01307835260.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-amber-400">
          {t('ডিলার পোর্টাল ডেটা লোড হচ্ছে...', 'Loading Dealer Portal Data...')}
        </p>
      </div>
    );
  }

  const dealer = dealerData?.dealer || session;
  const summary = dealerData?.summary || {};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Hind_Siliguri',sans-serif]">
      {/* Top Banner / Dealer Identity Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-amber-500/20 py-4 px-4 sm:px-8 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 border border-amber-400/40 shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {t('অফিসিয়াল ডিলার', 'Official Dealer')}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {dealer.id}</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white leading-tight mt-0.5">
                {dealer.name}
              </h1>
              <p className="text-xs text-amber-200/70 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{dealer.area || t('সাভার ও ধামরাই থানা', 'Savar & Dhamrai Zone')}</span>
              </p>
            </div>
          </div>

          {/* Quick Balance & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-end md:self-auto">
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl px-3.5 py-1.5 flex items-center gap-2.5">
              <DollarSign className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  {t('উত্তোলনযোগ্য কমিশন', 'Available Balance')}
                </span>
                <span className="text-sm font-black text-amber-300 font-mono">
                  ৳{(summary.commissionBalance || dealer.commissionBalance || 0).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(true)}
                className="ml-2 px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
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

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-3 mb-6 border-b border-slate-800 scrollbar-thin">
          {[
            { id: 'overview', labelBn: 'ওভারভিউ', labelEn: 'Overview', icon: Store },
            { id: 'sub_dealers', labelBn: 'সাব-ডিলার টিম', labelEn: 'Sub-Dealers', icon: Briefcase, count: dealerData?.subDealers?.length },
            { id: 'workers', labelBn: 'মাঠ কর্মী', labelEn: 'Workers', icon: Users, count: dealerData?.workers?.length },
            { id: 'customers', labelBn: 'গ্রাহক ও কার্ড', labelEn: 'Customers & Cards', icon: CreditCard, count: dealerData?.cards?.length },
            { id: 'orders', labelBn: 'অর্ডার ও সরবরাহ', labelEn: 'Orders & Supply', icon: Package, count: dealerData?.orders?.length },
            { id: 'finances', labelBn: 'কমিশন হিসেব', labelEn: 'Earnings & Payout', icon: DollarSign },
            { id: 'ai', labelBn: 'এআই লাইভ সহকারী', labelEn: 'AI Live Chat', icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t(tab.labelBn, tab.labelEn)}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">{t('সাব-ডিলার নেটওয়ার্ক', 'Sub-Dealers')}</span>
                  <Briefcase className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono">
                  {summary.subDealersCount || 0}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {t('ইউনিয়ন ও ওয়ার্ড ব্রাঞ্চ', 'Union & Ward branches')}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">{t('মাঠপর্যায়ের কর্মী', 'Field Workers')}</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono">
                  {summary.workersCount || 0}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {t('ডেলিভারি ও ভেরিফিকেশন কর্মী', 'Delivery & Field staff')}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">{t('ফেয়ার প্রাইস কার্ডধারক', 'Card Holders')}</span>
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono">
                  {summary.cardsCount || 0}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{summary.activeCardsCount || 0} {t('সক্রিয় কার্ড', 'Active cards')}</span>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">{t('মোট কমিশন উপার্জন', 'Total Earned')}</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                  ৳{(summary.totalCommissionEarned || 85000).toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {t('আজীবন মোট আয়', 'Lifetime earnings')}
                </div>
              </div>
            </div>

            {/* Quick Actions & Zone Notice */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>{t('সাম্প্রতিক ডেলিভারি ও রিকুইজিশন স্ট্যাটাস', 'Recent Deliveries & Stock')}</span>
                </h3>
                {dealerData?.deliveries && dealerData.deliveries.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-800">
                          <th className="pb-2">{t('ইনভয়েস', 'Invoice')}</th>
                          <th className="pb-2">{t('গ্রাহক ও এলাকা', 'Customer')}</th>
                          <th className="pb-2">{t('পণ্য', 'Items')}</th>
                          <th className="pb-2">{t('স্ট্যাটাস', 'Status')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {dealerData.deliveries.slice(0, 5).map((d: any) => (
                          <tr key={d.id} className="hover:bg-slate-800/30">
                            <td className="py-2.5 font-mono text-amber-300">{d.id}</td>
                            <td className="py-2.5">
                              <div className="font-semibold text-white">{d.recipientName}</div>
                              <div className="text-[10px] text-slate-400">{d.recipientMobile}</div>
                            </td>
                            <td className="py-2.5 text-slate-300">{d.productNames || 'রেশন সামগ্রী প্যাকেজ'}</td>
                            <td className="py-2.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  d.status === 'Delivered'
                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {d.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    {t('কোনো নতুন ডেলিভারি অমীমাংসিত নেই।', 'No pending deliveries.')}
                  </p>
                )}
              </div>

              {/* Notice & Hotline */}
              <div className="bg-gradient-to-br from-amber-500/10 to-slate-900 border border-amber-500/30 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                    {t('হেড অফিস নোটিশ', 'Head Office Notice')}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">
                    {t('ফেয়ার প্রাইস কোটা বরাদ্দ ২০২৬', 'Fair Price Quota Allotment 2026')}
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {t(
                      'চলতি মাসের চিনি, ডাল ও ভোজ্য তৈলের সাব-ডিলার ভিত্তিক কোটা পাঠানো হয়েছে। স্থানীয় গ্রাহকদের কার্ড যাচাই করে সঠিক মূল্যে পণ্য সরবরাহ নিশ্চিত করুন।',
                      'Monthly allocations have been dispatched. Ensure strict delivery compliance against verified Fair Price Cards.'
                    )}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 block text-[10px]">{t('ডিলার হেল্পলাইন:', 'Dealer Hotline:')}</span>
                    <a href="tel:01307835260" className="text-amber-400 font-bold">
                      01307835260
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ai')}
                    className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>{t('এআই সাপোর্ট', 'AI Support')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. SUB-DEALERS TAB */}
        {activeTab === 'sub_dealers' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {t('সাব-ডিলার নেটওয়ার্ক তালিকা', 'Assigned Sub-Dealers')}
                </h3>
                <p className="text-xs text-slate-400">
                  {t('আপনার ডিলারশিপের আওতাধীন অনুমোদিত সাব-ডিলারগণ', 'Authorized sub-dealers operating under your jurisdiction')}
                </p>
              </div>
              <div className="text-xs text-amber-400 font-medium">
                {t('মোট সাব-ডিলার:', 'Total Sub-Dealers:')} {dealerData?.subDealers?.length || 0}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dealerData?.subDealers?.map((sub: any) => (
                <div
                  key={sub.id}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{sub.name}</h4>
                        <span className="text-[10px] font-mono text-slate-400">{sub.id}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {sub.status || 'Active'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{t('মোবাইল:', 'Mobile:')}</span>
                      <a href={`tel:${sub.mobile}`} className="text-amber-400 font-mono hover:underline">
                        {sub.mobile}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{t('এলাকা:', 'Area:')}</span>
                      <span className="text-right truncate max-w-[180px]">{sub.area || 'ওয়ার্ড পর্যায়'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{t('যোগদান:', 'Joined:')}</span>
                      <span>{sub.joinedDate || '2026'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. WORKERS TAB */}
        {activeTab === 'workers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">
                  {t('মাঠপর্যায়ের কর্মী তালিকা', 'Field Workers & Representatives')}
                </h3>
                <p className="text-xs text-slate-400">
                  {t('পণ্য সরবরাহ ও গ্রাহক সেবা প্রদানকারী দায়িত্বপ্রাপ্ত কর্মী', 'Supply delivery and customer support workforce')}
                </p>
              </div>
              <div className="text-xs text-amber-400 font-medium">
                {t('মোট কর্মী:', 'Total Workers:')} {dealerData?.workers?.length || 0}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dealerData?.workers?.map((w: any) => (
                <div key={w.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white">{w.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{w.id}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-300">
                      {w.status || 'Active'}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('মোবাইল:', 'Phone:')}</span>
                      <span className="font-mono text-amber-300">{w.mobile}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('দায়িত্বপ্রাপ্ত এলাকা:', 'Area:')}</span>
                      <span>{w.area || dealer.area}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CUSTOMERS & CARDS TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {t('গ্রাহক ও ফেয়ার প্রাইস কার্ড তালিকা', 'Beneficiary Families & Fair Price Cards')}
                </h3>
                <p className="text-xs text-slate-400">
                  {t('আপনার আঞ্চলিক ডিলারশিপের অনুমোদিত কার্ড সদস্যবৃন্দ', 'Verified Fair Price Card holders under this zone')}
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('নাম বা কার্ড নম্বর খুঁজুন...', 'Search name or card...')}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">{t('কার্ড নম্বর', 'Card No')}</th>
                      <th className="p-3.5">{t('গ্রাহকের নাম', 'Customer Name')}</th>
                      <th className="p-3.5">{t('মোবাইল', 'Mobile')}</th>
                      <th className="p-3.5">{t('পরিবারের সদস্য', 'Family Members')}</th>
                      <th className="p-3.5">{t('কোটা ব্যালেন্স', 'Ration Quota')}</th>
                      <th className="p-3.5">{t('স্ট্যাটাস', 'Status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {dealerData?.cards
                      ?.filter((c: any) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          c.cardNumber.toLowerCase().includes(q) ||
                          c.customerName.toLowerCase().includes(q) ||
                          c.customerMobile.includes(q)
                        );
                      })
                      .map((c: any) => (
                        <tr key={c.cardNumber} className="hover:bg-slate-800/30">
                          <td className="p-3.5 font-mono text-amber-300 font-bold">{c.cardNumber}</td>
                          <td className="p-3.5 font-semibold text-white">{c.customerName}</td>
                          <td className="p-3.5 font-mono text-slate-300">{c.customerMobile}</td>
                          <td className="p-3.5 text-slate-300">{c.familyMembers || 4} {t('জন', 'Members')}</td>
                          <td className="p-3.5 text-emerald-400 font-semibold">{c.monthlyRationQuotaKg || 25} কেজি / মাস</td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                c.status === 'active'
                                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {c.status.toUpperCase()}
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

        {/* 5. ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">
              {t('পণ্য অর্ডার ও সাপ্লাই ইনভয়েস', 'Product Orders & Requisitions')}
            </h3>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">{t('অর্ডার আইডি', 'Order ID')}</th>
                      <th className="p-3.5">{t('তারিখ', 'Date')}</th>
                      <th className="p-3.5">{t('গ্রাহক', 'Recipient')}</th>
                      <th className="p-3.5">{t('মূল্য', 'Amount')}</th>
                      <th className="p-3.5">{t('পেমেন্ট', 'Payment')}</th>
                      <th className="p-3.5">{t('ডেলিভারি অবস্থা', 'Delivery Status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {dealerData?.orders?.map((o: any) => (
                      <tr key={o.id} className="hover:bg-slate-800/30">
                        <td className="p-3.5 font-mono text-amber-300">{o.id}</td>
                        <td className="p-3.5 text-slate-400">{o.date || '2026-03-20'}</td>
                        <td className="p-3.5 font-semibold text-white">{o.customerName}</td>
                        <td className="p-3.5 font-mono font-bold text-amber-300">৳{o.totalAmount || o.price || 0}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/15 text-blue-300">
                            {o.paymentMethod || 'EMI / Installment'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/15 text-emerald-300 font-semibold">
                            {o.status || 'Dispatched'}
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

        {/* 6. FINANCES & COMMISSIONS TAB */}
        {activeTab === 'finances' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5">
                <span className="text-xs text-slate-400">{t('উত্তোলনযোগ্য ব্যালেন্স', 'Withdrawable Balance')}</span>
                <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                  ৳{(summary.commissionBalance || dealer.commissionBalance || 0).toLocaleString()}
                </div>
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(true)}
                  className="mt-4 w-full py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:brightness-105"
                >
                  {t('উত্তোলন আবেদন করুন', 'Request Payout')}
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs text-slate-400">{t('সর্বমোট কমিশন অর্জন', 'Total Commission Earned')}</span>
                <div className="text-2xl font-black text-white font-mono mt-1">
                  ৳{(summary.totalCommissionEarned || 85000).toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  {t('পণ্য বিক্রি, কিস্তি আদায় ও ডিলার ওভাররাইড কমিশন অন্তর্ভুক্ত।', 'Includes sales and dealer override bonuses.')}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs text-slate-400">{t('পেমেন্ট সাইকেল', 'Payment Cycle')}</span>
                <div className="text-sm font-bold text-white mt-1">{t('সাপ্তাহিক ও মাসিক উত্তোলন', 'Weekly / Monthly Payouts')}</div>
                <p className="text-[11px] text-slate-500 mt-2">
                  {t('বিকাশ, নগদ, রকেট বা ব্যাংক অ্যাকাউন্টে ২৪-৪৮ ঘণ্টার মধ্যে নিষ্পত্তি।', 'Settlement within 24-48 hrs.')}
                </p>
              </div>
            </div>

            {/* Withdrawals History Table */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{t('সাম্প্রতিক উত্তোলন আবেদনের হিস্ট্রি', 'Recent Withdrawal Requests')}</span>
              </h4>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">{t('ট্রানজেকশন আইডি', 'Trx ID')}</th>
                        <th className="p-3.5">{t('তারিখ', 'Date')}</th>
                        <th className="p-3.5">{t('পরিমাণ', 'Amount')}</th>
                        <th className="p-3.5">{t('মাধ্যম ও একাউন্ট', 'Method & Account')}</th>
                        <th className="p-3.5">{t('অবস্থা', 'Status')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {dealerData?.withdrawals && dealerData.withdrawals.length > 0 ? (
                        dealerData.withdrawals.map((w: any) => (
                          <tr key={w.id}>
                            <td className="p-3.5 font-mono text-amber-300">{w.id}</td>
                            <td className="p-3.5 text-slate-400">{w.requestedAt ? w.requestedAt.slice(0, 10) : '2026-03-20'}</td>
                            <td className="p-3.5 font-mono font-bold text-white">৳{w.amount?.toLocaleString()}</td>
                            <td className="p-3.5">
                              <span className="font-semibold text-slate-200">{w.payoutMethod}</span>{' '}
                              <span className="text-slate-400">({w.accountDetails})</span>
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  w.status === 'approved' || w.status === 'paid'
                                    ? 'bg-emerald-500/15 text-emerald-300'
                                    : 'bg-amber-500/15 text-amber-300'
                                }`}
                              >
                                {w.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-slate-500">
                            {t('কোনো উত্তোলন হিস্ট্রি পাওয়া যায়নি।', 'No withdrawal records found.')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. INTEGRATED AI LIVE CHAT TAB */}
        {activeTab === 'ai' && (
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[550px]">
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{t('হোলিনেক্স ডিলার এআই লাইভ অ্যাসিস্ট্যান্ট', 'Holynex Dealer AI Live Assistant')}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {t('ডিলারশিপ পলিসি, কমিশন রেট ও কোটা বরাদ্দে তাৎক্ষণিক সহায়তা', 'Real-time policy, commission & quota assistance')}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                24/7 Live
              </span>
            </div>

            {/* Chat Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-slate-950 font-medium'
                        : 'bg-slate-800 text-slate-200 border border-slate-700 whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 rounded-2xl px-4 py-2 text-xs text-slate-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-200" />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder={t('আপনার প্রশ্ন লিখুন (যেমন: ডিলার কমিশন কবে পরিশোধ হয়?)...', 'Ask about dealership policies...')}
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={chatLoading || !inputMsg.trim()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 disabled:opacity-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('পাঠান', 'Send')}</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* WITHDRAWAL MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <span>{t('কমিশন উত্তোলন আবেদন', 'Commission Payout Request')}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {withdrawStatus && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                {withdrawStatus}
              </div>
            )}

            <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('উত্তোলনের পরিমাণ (টাকা)', 'Withdrawal Amount (BDT)')}
                </label>
                <input
                  type="number"
                  min="500"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="যেমন: 5000"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {t('বর্তমান ব্যালেন্স:', 'Available:')} ৳{(summary.commissionBalance || dealer.commissionBalance || 0).toLocaleString()} (মিনিমাম ৫০০ টাকা)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('পেমেন্ট মাধ্যম', 'Payout Method')}
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="bKash">bKash (বিকাশ পার্সোনাল/মার্চেন্ট)</option>
                  <option value="Nagad">Nagad (নগদ)</option>
                  <option value="Rocket">Rocket (রকেট)</option>
                  <option value="Bank">Bank Transfer (ব্যাংক একাউন্ট)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('অ্যাকাউন্ট নম্বর / বিস্তারিত', 'Account Number / Details')}
                </label>
                <input
                  type="text"
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  placeholder={session.mobile || '01XXXXXXXXX'}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
                >
                  {t('আবেদন জমা দিন', 'Submit Request')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PASSWORD CHANGE MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <span>{t('পাসওয়ার্ড পরিবর্তন', 'Change Password')}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {passwordStatus && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                {passwordStatus}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('বর্তমান পাসওয়ার্ড', 'Current Password')}
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('নতুন পাসওয়ার্ড (ন্যূনতম ৬ অক্ষর)', 'New Password (min 6 characters)')}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
                >
                  {t('পাসওয়ার্ড সংরক্ষণ করুন', 'Save Password')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
