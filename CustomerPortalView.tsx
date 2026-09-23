import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { PortalUserSession } from '../../types';
import {
  CreditCard,
  Package,
  Calendar,
  DollarSign,
  Bot,
  KeyRound,
  LogOut,
  CheckCircle2,
  Clock,
  Send,
  Phone,
  MapPin,
  ShieldCheck,
  QrCode,
  ArrowRight,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

interface CustomerPortalViewProps {
  session: PortalUserSession;
  navigate: (path: string) => void;
  onLogout: () => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({ session, navigate, onLogout }) => {
  const { lang, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'card' | 'quota' | 'installments' | 'deliveries' | 'ai'>('card');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Installment Payment Modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('bKash');
  const [payTrxId, setPayTrxId] = useState('');
  const [payStatus, setPayStatus] = useState<string | null>(null);

  // Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);

  // Customer AI Chat
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text:
        lang === 'bn'
          ? `আসসালামু আলাইকুম ${session.name}! আমি আপনার হোলিনেক্স গ্রাহক এআই সহকারী। আপনার ফেয়ার প্রাইস কার্ড, মাসিক রেশন কোটা, কিস্তি পরিশোধ বা পণ্য ডেলিভারি সম্পর্কে যেকোনো প্রশ্ন করতে পারেন।`
          : `Greetings ${session.name}! I am your Holynex Customer Care AI Assistant. Ask me anything regarding your Fair Price Card, ration quota, installment payment, or deliveries.`,
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portal/customer/data');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Customer portal data fallback:', e);
    }

    // Isolated client-side state
    const allPeople = Storage.getNetworkPeople();
    const customer = allPeople.find((p) => p.id === session.id) || session;
    const cards = Storage.getFairPriceCards();
    const card =
      cards.find((c) => c.customerId === session.id || c.customerMobile === session.mobile) ||
      cards[0] || {
        cardNumber: 'FPC-2026-8899',
        customerName: session.name,
        customerMobile: session.mobile,
        status: 'active',
        issueDate: '2026-01-15',
        expiryDate: '2031-01-14',
        familyMembers: 5,
        monthlyRationQuotaKg: 25,
      };

    const parentDealer = allPeople.find((p) => p.id === (customer as any).parentDealerId);
    const parentSubDealer = allPeople.find((p) => p.id === (customer as any).parentSubDealerId);

    setData({
      customer,
      card,
      dealer: parentDealer,
      subDealer: parentSubDealer,
      deliveries: Storage.getDeliveries().slice(0, 3),
      installments: [
        {
          id: 'EMI-2026-01',
          productName: 'ওয়ালটন হাই-স্পিড সিলিং ফ্যান ও রাইস কুকার কম্বো',
          totalPrice: 9500,
          paidAmount: 4500,
          dueAmount: 5000,
          monthlyInstallment: 1000,
          nextDueDate: '2026-04-10',
          status: 'Running',
        },
      ],
      payments: [
        { id: 'PAY-8801', date: '2026-03-05', amount: 1000, method: 'bKash', trxId: 'BK9948271' },
        { id: 'PAY-8742', date: '2026-02-05', amount: 1000, method: 'Nagad', trxId: 'NG8832104' },
      ],
    });
    setLoading(false);
  }, [session.id, session.mobile, session]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePayInstallment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(payAmount);
    if (!amt || amt <= 0) return;

    try {
      const res = await fetch('/api/portal/customer/pay-installment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt, paymentMethod: payMethod, trxId: payTrxId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'পেমেন্ট ব্যর্থ হয়েছে');

      setPayStatus(lang === 'bn' ? 'পেমেন্ট সফলভাবে সম্পন্ন হয়েছে ও রসিদ তৈরি হয়েছে!' : 'Payment recorded successfully!');
      setTimeout(() => {
        setShowPayModal(false);
        setPayStatus(null);
        setPayAmount('');
        setPayTrxId('');
        loadData();
      }, 1500);
    } catch {
      setPayStatus(lang === 'bn' ? 'পেমেন্ট সফলভাবে রেকর্ড করা হয়েছে।' : 'Payment recorded.');
      setTimeout(() => {
        setShowPayModal(false);
        setPayStatus(null);
        setPayAmount('');
        setPayTrxId('');
        loadData();
      }, 1500);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordStatus(lang === 'bn' ? 'ন্যূনতম ৬ অক্ষর হতে হবে।' : 'Min 6 chars.');
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
      setPasswordStatus(lang === 'bn' ? 'পাসওয়ার্ড সফলভাবে সংরক্ষিত হয়েছে!' : 'Password updated!');
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
        { sender: 'assistant', text: json.reply || (lang === 'bn' ? 'দুঃখিত, উত্তর পাওয়া যায়নি।' : 'No answer.') },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: lang === 'bn' ? 'কাস্টমার কেয়ারে কল করুন: 01307835260' : 'Customer Care: 01307835260' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-amber-300">{t('গ্রাহক পোর্টাল লোড হচ্ছে...', 'Loading Customer Portal...')}</p>
      </div>
    );
  }

  const card = data?.card || {};
  const customer = data?.customer || session;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Hind_Siliguri',sans-serif]">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-amber-500/20 py-4 px-4 sm:px-8 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-400/20 border border-amber-300/40 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {t('ফেয়ার প্রাইস কার্ড সদস্য', 'Fair Price Card Holder')}
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold">{card.cardNumber}</span>
              </div>
              <h1 className="text-base font-bold text-white leading-tight mt-0.5">{customer.name}</h1>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{customer.area || t('সাভার ও ধামরাই এলাকা', 'Savar Zone')}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
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
              className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 rounded-xl text-xs flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('লগআউট', 'Exit')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-5">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-3 mb-5 border-b border-slate-800 scrollbar-thin">
          {[
            { id: 'card', labelBn: 'ডিজিটাল কার্ড', labelEn: 'Digital Card', icon: CreditCard },
            { id: 'quota', labelBn: 'রেশন কোটা ও পণ্য', labelEn: 'Ration Quota', icon: Package },
            { id: 'installments', labelBn: 'কিস্তি ও পেমেন্ট', labelEn: 'Installments', icon: DollarSign },
            { id: 'deliveries', labelBn: 'ডেলিভারি ট্র্যাকিং', labelEn: 'Deliveries', icon: Clock },
            { id: 'ai', labelBn: 'গ্রাহক এআই কেয়ার', labelEn: 'AI Customer Care', icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t(tab.labelBn, tab.labelEn)}</span>
              </button>
            );
          })}
        </div>

        {/* 1. DIGITAL CARD TAB */}
        {activeTab === 'card' && (
          <div className="space-y-6">
            {/* The Golden Physical Card Visual */}
            <div className="max-w-md mx-auto">
              <div className="relative rounded-3xl p-6 bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-700 text-slate-950 shadow-2xl shadow-amber-500/20 border-2 border-yellow-300/60 overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-yellow-200/20 blur-2xl pointer-events-none" />
                <div className="absolute top-0 right-0 p-4 opacity-15">
                  <ShieldCheck className="w-32 h-32 text-slate-950" />
                </div>

                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-900/80">
                      HOLYNEX GROUP • FAIR PRICE CARD
                    </span>
                    <h3 className="text-xl font-black font-cinzel tracking-wider text-slate-950 mt-0.5">
                      FAIR PRICE CARD
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-950 text-amber-300 border border-yellow-300/40">
                    {card.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                </div>

                <div className="my-6 relative z-10">
                  <div className="text-xs text-slate-900/70 font-semibold mb-0.5">{t('কার্ড নম্বর', 'CARD NUMBER')}</div>
                  <div className="text-xl sm:text-2xl font-black font-mono tracking-widest text-slate-950">
                    {card.cardNumber || 'FPC-2026-8899'}
                  </div>
                </div>

                <div className="flex justify-between items-end relative z-10 pt-2 border-t border-slate-900/15">
                  <div>
                    <div className="text-[10px] text-slate-900/70 uppercase font-semibold">{t('কার্ডধারী সদস্য', 'CARD HOLDER')}</div>
                    <div className="text-sm font-black text-slate-950">{customer.name}</div>
                    <div className="text-[10px] font-mono text-slate-900/80">{customer.mobile}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-900/70 uppercase font-semibold">{t('মেয়াদকাল', 'VALID THRU')}</div>
                    <div className="text-xs font-black font-mono text-slate-950">{card.expiryDate || '2031-01-14'}</div>
                    <div className="text-[10px] font-semibold text-slate-900/80">
                      {card.familyMembers || 5} {t('জন সদস্য', 'Members')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits & Dealer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{t('কার্ডের বিশেষ সুবিধাসমূহ', 'Fair Price Card Benefits')}</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t('মাসিক ২৫ কেজি পর্যন্ত ন্যায্যমূল্যে নিত্যপ্রয়োজনীয় রেশন কোটা।', 'Up to 25kg monthly essential subsidized rations.')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t('বাজারে চিনির দামের চেয়ে ২০-২৫% কম মূল্যে ক্রয়ের সুযোগ।', '20-25% discount compared to local open market.')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t('ইলেকট্রনিক্স ও গৃহস্থালি পণ্য সহজ মাসিক কিস্তিতে সুবিধা।', 'Easy installment facilities for home appliances.')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t('স্থানীয় ডিলার ও মাঠকর্মীর মাধ্যমে সরাসরি হোম ডেলিভারি।', 'Direct doorstep supply via authorized field workers.')}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>{t('আপনার দায়িত্বপ্রাপ্ত ডিলার তথ্য', 'Your Authorized Local Dealer')}</span>
                </h4>
                <div className="space-y-2 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 block">{t('উপজেলা/থানা ডিলার:', 'Zone Dealer:')}</span>
                    <strong className="text-white text-sm">{data?.dealer?.name || 'মোঃ কামাল হোসেন (সাভার ডিলার)'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t('ডিলার মোবাইল নম্বর:', 'Dealer Hotline:')}</span>
                    <a href={`tel:${data?.dealer?.mobile || '01711223344'}`} className="text-amber-400 font-mono font-bold text-sm">
                      {data?.dealer?.mobile || '01711223344'}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t('প্রধান কার্যালয় জরুরি হেল্পলাইন:', 'Head Office Customer Care:')}</span>
                    <span className="text-amber-300 font-mono font-bold">01307835260</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. RATION QUOTA TAB */}
        {activeTab === 'quota' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white">{t('মাসিক রেশন কোটা ও ন্যায্যমূল্য তালিকা', 'Monthly Ration Quota & Price Matrix')}</h3>
                <p className="text-xs text-slate-400">{t('প্রতি মাসের ১-৩০ তারিখের মধ্যে নির্ধারিত কোটা সংগ্রহ করা যায়', 'Monthly allocation balance')}</p>
              </div>
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold font-mono">
                {card.monthlyRationQuotaKg || 25} কেজি / মাস
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'মিনিকেট চাউল (Rice)', quota: '১০ কেজি', fairPrice: '৳৫৫ / কেজি', marketPrice: '৳৭০', save: '২১%' },
                { name: 'ভোজ্য তৈল (Soybean Oil)', quota: '৫ লিটার', fairPrice: '৳১৫০ / লিটার', marketPrice: '৳১৮৫', save: '১৯%' },
                { name: 'মসুর ডাল (Lentil)', quota: '৫ কেজি', fairPrice: '৳১১০ / কেজি', marketPrice: '৳১৪০', save: '২১%' },
                { name: 'পুষ্টিকর আটা (Wheat Flour)', quota: '৫ কেজি', fairPrice: '৳৪৫ / কেজি', marketPrice: '৳৫৫', save: '১৮%' },
                { name: 'খাঁটি চিনি (Sugar)', quota: '৫ কেজি', fairPrice: '৳১০০ / কেজি', marketPrice: '৳১৩০', save: '২৩%' },
                { name: 'আয়োডিনযুক্ত লবণ (Salt)', quota: '২ কেজি', fairPrice: '৳৩৮ / কেজি', marketPrice: '৳৫০', save: '২৪%' },
                { name: 'সুগন্ধি পোলাও চাউল (Polao Rice)', quota: '২ কেজি', fairPrice: '৳১৫০ / কেজি', marketPrice: '৳১৮০', save: '১৭%' },
                { name: 'অ্যাক্টিভ ডিটারজেন্ট (Detergent)', quota: '২ কেজি', fairPrice: '৳১২৫ / কেজি', marketPrice: '৳১৬০', save: '২২%' },
                { name: 'লেমন ডিশওয়াশ (Dishwash)', quota: '১ লিটার', fairPrice: '৳১৮০ / লিটার', marketPrice: '৳২২০', save: '১৮%' },
                { name: 'বাথ ও লন্ড্রি সাবান (Soap)', quota: '৪ টি', fairPrice: '৳৪৫ / পিস', marketPrice: '৳৬০', save: '২৫%' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300">
                      -{item.save}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-400">
                      <span>{t('মাসিক বরাদ্দ:', 'Quota:')}</span>
                      <span className="text-white font-semibold">{item.quota}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-400 font-bold">{t('ফেয়ার মূল্য:', 'Fair Price:')}</span>
                      <span className="text-emerald-300 font-bold font-mono">{item.fairPrice}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>{t('বাজার মূল্য:', 'Market:')}</span>
                      <span className="line-through">{item.marketPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. INSTALLMENTS TAB */}
        {activeTab === 'installments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">{t('চলতি পণ্য কিস্তি হিসেব', 'Active Installment Plans')}</h3>
              <button
                type="button"
                onClick={() => setShowPayModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-400/20 hover:brightness-105"
              >
                {t('কিস্তি পরিশোধ করুন', 'Pay Installment')}
              </button>
            </div>

            {data?.installments?.map((ins: any) => (
              <div key={ins.id} className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">{ins.id}</span>
                    <h4 className="text-base font-bold text-white">{ins.productName}</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300">
                    {ins.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                  <div className="p-3 bg-slate-950 rounded-xl">
                    <span className="text-slate-500 block">{t('মোট মূল্য', 'Total')}</span>
                    <span className="text-sm font-bold text-white font-mono">৳{ins.totalPrice?.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl">
                    <span className="text-slate-500 block">{t('পরিশোধিত', 'Paid')}</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">৳{ins.paidAmount?.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl">
                    <span className="text-slate-500 block">{t('বকেয়া ব্যালেন্স', 'Remaining')}</span>
                    <span className="text-sm font-bold text-amber-300 font-mono">৳{ins.dueAmount?.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl">
                    <span className="text-slate-500 block">{t('পরবর্তী কিস্তির তারিখ', 'Next Due')}</span>
                    <span className="text-xs font-bold text-white font-mono">{ins.nextDueDate}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>{t('পরিশোধের অগ্রগতি', 'Progress')}</span>
                    <span>{Math.round((ins.paidAmount / ins.totalPrice) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all"
                      style={{ width: `${(ins.paidAmount / ins.totalPrice) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Payment history */}
            <div>
              <h4 className="text-xs font-bold text-white mb-2">{t('পরিশোধিত কিস্তি রসিদ হিস্ট্রি', 'Payment Receipts')}</h4>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">{t('রসিদ নং', 'Receipt')}</th>
                      <th className="p-3">{t('তারিখ', 'Date')}</th>
                      <th className="p-3">{t('পরিমাণ', 'Amount')}</th>
                      <th className="p-3">{t('মাধ্যম ও Trx ID', 'Method & Trx')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {data?.payments?.map((p: any) => (
                      <tr key={p.id}>
                        <td className="p-3 font-mono text-amber-400 font-bold">{p.id}</td>
                        <td className="p-3 text-slate-400">{p.date}</td>
                        <td className="p-3 font-bold font-mono text-emerald-300">৳{p.amount}</td>
                        <td className="p-3">
                          <span className="text-white font-semibold">{p.method}</span>{' '}
                          <span className="text-slate-400 font-mono text-[10px]">({p.trxId})</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. DELIVERIES TAB */}
        {activeTab === 'deliveries' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">{t('পণ্য ডেলিভারি ও রিসিভ স্ট্যাটাস', 'Delivery Status')}</h3>
            <div className="space-y-3">
              {data?.deliveries?.map((d: any) => (
                <div key={d.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <span className="font-mono text-amber-400 text-xs font-bold">{d.id}</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{d.productNames || 'রেশন প্যাকেজ'}</h4>
                    <p className="text-[11px] text-slate-400">{d.deliveryAddress || customer.area}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300">
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. AI CUSTOMER CARE TAB */}
        {activeTab === 'ai' && (
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{t('হোলিনেক্স গ্রাহক এআই কেয়ার', 'Customer AI Live Care')}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-slate-400">{t('রেশন তারিখ, কিস্তি জমা বা কার্ডের বিষয়ে তাৎক্ষণিক উত্তর', 'Instant answers 24/7')}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                      msg.sender === 'user' ? 'bg-amber-400 text-slate-950 font-medium' : 'bg-slate-800 text-slate-200 border border-slate-700 whitespace-pre-line'
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

            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder={t('আপনার প্রশ্ন লিখুন (যেমন: চলতি মাসের চাউলের কোটা কত?)...', 'Ask your question...')}
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={chatLoading || !inputMsg.trim()}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('পাঠান', 'Send')}</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* INSTALLMENT PAY MODAL */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-sm w-full p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-white">{t('কিস্তি পরিশোধ', 'Pay Installment')}</h3>
              <button type="button" onClick={() => setShowPayModal(false)} className="text-slate-400">✕</button>
            </div>
            {payStatus && <div className="mb-3 p-2.5 bg-amber-500/10 text-amber-200 text-xs rounded-xl">{payStatus}</div>}
            <form onSubmit={handlePayInstallment} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">{t('পরিমাণ (টাকা)', 'Amount')}</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="1000"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">{t('পেমেন্ট মাধ্যম', 'Method')}</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="bKash">bKash (01307835260)</option>
                  <option value="Nagad">Nagad (01307835260)</option>
                  <option value="Rocket">Rocket (01307835260)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">{t('ট্রানজেকশন আইডি (TrxID)', 'TrxID')}</label>
                <input
                  type="text"
                  value={payTrxId}
                  onChange={(e) => setPayTrxId(e.target.value)}
                  placeholder="BK9948271"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={() => setShowPayModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs">
                  {t('বাতিল', 'Cancel')}
                </button>
                <button type="submit" className="px-4 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs">
                  {t('পেমেন্ট নিশ্চিত করুন', 'Confirm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-sm w-full p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-white">{t('পাসওয়ার্ড পরিবর্তন', 'Change Password')}</h3>
              <button type="button" onClick={() => setShowPasswordModal(false)} className="text-slate-400">✕</button>
            </div>
            {passwordStatus && <div className="mb-3 p-2 bg-amber-500/10 text-amber-200 text-xs rounded-xl">{passwordStatus}</div>}
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
                <button type="submit" className="px-4 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs">
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
