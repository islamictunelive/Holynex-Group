import React, { useState } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { FairPriceCardRecord, ProductScheduleItem } from '../../types';
import {
  CreditCard,
  Calendar,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Edit2,
  Sparkles,
  ShoppingBag,
  User,
  Phone,
  ShieldCheck,
  XCircle,
  DollarSign,
  Package,
} from 'lucide-react';

export const AdminCardsTab: React.FC = () => {
  const { t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'cards' | 'schedules'>('cards');

  const [cards, setCards] = useState<FairPriceCardRecord[]>(() => Storage.getFairPriceCards());
  const [schedules, setSchedules] = useState<ProductScheduleItem[]>(() => Storage.getProductSchedules());
  const [searchQuery, setSearchQuery] = useState('');

  // Card Modal
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    customerId: '',
    customerName: '',
    customerMobile: '',
    representativeId: 'REP-000401',
    representativeName: 'ফারহানা শারমিন (প্রতিনিধি)',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '2027-03-31',
    status: 'active' as FairPriceCardRecord['status'],
    cardFee: 500,
    paidFee: 500,
    monthlyQuotaKg: 50,
  });

  // Schedule Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    scheduleCode: '',
    customerId: '',
    customerName: '',
    customerMobile: '',
    cardNumber: '',
    productNameBn: 'মিনিকেট চাউল (১০ কেজি স্পেশাল ফেয়ার প্যাক)',
    productNameEn: 'Miniket Rice (10kg Fair Pack)',
    quantity: '১০ কেজি',
    allocatedPrice: 700,
    retailPrice: 950,
    subsidySavings: 250,
    scheduledDate: '2026-10-10',
    status: 'Scheduled' as ProductScheduleItem['status'],
    deliveryPoint: 'সাভার সেন্ট্রাল ডিলার পয়েন্ট (দোকান ১২)',
    representativeId: 'REP-000401',
  });

  const reloadData = () => {
    setCards(Storage.getFairPriceCards());
    setSchedules(Storage.getProductSchedules());
  };

  const handleOpenCreateCard = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setCardForm({
      cardNumber: `FPC-2026-${randomNum}`,
      customerId: `CUS-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: '',
      customerMobile: '',
      representativeId: 'REP-000401',
      representativeName: 'ফারহানা শারমিন (প্রতিনিধি)',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '2027-03-31',
      status: 'active',
      cardFee: 500,
      paidFee: 500,
      monthlyQuotaKg: 50,
    });
    setIsCardModalOpen(true);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.customerName || !cardForm.customerMobile) {
      alert(t('গ্রাহকের নাম ও মোবাইল আবশ্যক।', 'Customer name and mobile required.'));
      return;
    }

    const newCard: FairPriceCardRecord = {
      id: `fpc-${Date.now()}`,
      cardNumber: cardForm.cardNumber,
      customerId: cardForm.customerId,
      customerName: cardForm.customerName,
      customerMobile: cardForm.customerMobile,
      representativeId: cardForm.representativeId,
      representativeName: cardForm.representativeName,
      issueDate: cardForm.issueDate,
      expiryDate: cardForm.expiryDate,
      status: cardForm.status,
      cardFee: Number(cardForm.cardFee),
      paidFee: Number(cardForm.paidFee),
      remainingFee: Math.max(0, Number(cardForm.cardFee) - Number(cardForm.paidFee)),
      monthlyQuotaKg: Number(cardForm.monthlyQuotaKg),
    };

    Storage.saveFairPriceCard(newCard);
    reloadData();
    setIsCardModalOpen(false);
  };

  const handleOpenCreateSchedule = () => {
    const randomCode = `SCH-2026-${Math.floor(100 + Math.random() * 900)}`;
    const sampleCard = cards[0];
    setScheduleForm({
      scheduleCode: randomCode,
      customerId: sampleCard ? sampleCard.customerId : 'CUS-000501',
      customerName: sampleCard ? sampleCard.customerName : 'আব্দুর রহিম',
      customerMobile: sampleCard ? sampleCard.customerMobile : '01733445566',
      cardNumber: sampleCard ? sampleCard.cardNumber : 'FPC-2026-8899',
      productNameBn: 'মিনিকেট চাউল (১০ কেজি স্পেশাল ফেয়ার প্যাক)',
      productNameEn: 'Miniket Rice (10kg Fair Pack)',
      quantity: '১০ কেজি',
      allocatedPrice: 700,
      retailPrice: 950,
      subsidySavings: 250,
      scheduledDate: '2026-10-10',
      status: 'Scheduled',
      deliveryPoint: 'সাভার সেন্ট্রাল ডিলার পয়েন্ট (দোকান ১২)',
      representativeId: 'REP-000401',
    });
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchedule: ProductScheduleItem = {
      id: `sch-${Date.now()}`,
      scheduleCode: scheduleForm.scheduleCode,
      customerId: scheduleForm.customerId,
      customerName: scheduleForm.customerName,
      customerMobile: scheduleForm.customerMobile,
      cardNumber: scheduleForm.cardNumber,
      productNameBn: scheduleForm.productNameBn,
      productNameEn: scheduleForm.productNameEn,
      quantity: scheduleForm.quantity,
      allocatedPrice: Number(scheduleForm.allocatedPrice),
      retailPrice: Number(scheduleForm.retailPrice),
      subsidySavings: Number(scheduleForm.retailPrice) - Number(scheduleForm.allocatedPrice),
      scheduledDate: scheduleForm.scheduledDate,
      status: scheduleForm.status,
      deliveryPoint: scheduleForm.deliveryPoint,
      representativeId: scheduleForm.representativeId,
    };

    Storage.saveProductSchedule(newSchedule);
    reloadData();
    setIsScheduleModalOpen(false);
  };

  // Filtered
  const filteredCards = cards.filter(
    (c) =>
      c.cardNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerMobile.includes(searchQuery)
  );

  const filteredSchedules = schedules.filter(
    (s) =>
      s.scheduleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.cardNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <CreditCard className="w-4 h-4" />
            <span>ফেয়ার প্রাইস কার্ড ও খাদ্য সামগ্রী শিডিউল মাস্টার কন্ট্রোল</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {t('নায্যমূল্য কার্ড তালিকা ও কাস্টমার এনটাইটেলমেন্ট', 'Fair Price Card & Product Entitlements')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('নিবন্ধিত কার্ডধারী পরিবারসমূহ এবং তাদের মাসিক খাদ্য সরবরাহের কেন্দ্রীয় শিডিউলার।', 'Manage registered family cards and central delivery calendar.')}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleOpenCreateCard}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ কার্ড ইস্যু করুন</span>
          </button>
          <button
            onClick={handleOpenCreateSchedule}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>+ খাদ্য শিডিউল যোগ</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveSubTab('cards')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'cards'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>ইস্যুকৃত কার্ডসমূহ ({cards.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('schedules')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'schedules'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>খাদ্য সামগ্রী ক্যালেন্ডার/শিডিউল ({schedules.length})</span>
          </button>
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('কার্ড নম্বর, নাম বা মোবাইল দিয়ে সার্চ...', 'Search card number, name, mobile...')}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
          />
        </div>
      </div>

      {/* ----------------------------------------------------
          TAB 1: FAIR PRICE CARDS TABLE
      ----------------------------------------------------- */}
      {activeSubTab === 'cards' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">কার্ড নম্বর</th>
                  <th className="px-4 py-3.5">কার্ডধারী গ্রাহক</th>
                  <th className="px-4 py-3.5">দায়িত্বপ্রাপ্ত প্রতিনিধি</th>
                  <th className="px-4 py-3.5">মাসিক কোটা</th>
                  <th className="px-4 py-3.5">কার্ড ফি</th>
                  <th className="px-4 py-3.5">মেয়াদকাল</th>
                  <th className="px-4 py-3.5">স্ট্যাটাস</th>
                  <th className="px-5 py-3.5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCards.map((card) => (
                  <tr key={card.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        <span className="font-mono font-bold text-amber-300 text-xs">{card.cardNumber}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-white text-xs block">{card.customerName}</span>
                      <span className="font-mono text-[10px] text-slate-400">{card.customerMobile}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="text-slate-300 block">{card.representativeName}</span>
                      <span className="font-mono text-[10px] text-slate-500">{card.representativeId}</span>
                    </td>

                    <td className="px-4 py-3.5 font-bold text-white">
                      {card.monthlyQuotaKg} কেজি
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-mono text-emerald-400 font-bold">৳ {card.paidFee}</span>
                      {card.remainingFee > 0 && (
                        <span className="text-rose-400 text-[10px] block font-mono">বাকি: ৳ {card.remainingFee}</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400">
                      {card.expiryDate}
                    </td>

                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => {
                          const next = card.status === 'active' ? 'blocked' : 'active';
                          Storage.updateCardStatus(card.id, next);
                          reloadData();
                        }}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          card.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {card.status === 'active' ? 'সক্রিয় (Active)' : 'স্থগিত (Blocked)'}
                      </button>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => {
                          // Pre-fill schedule for this card
                          setScheduleForm({
                            ...scheduleForm,
                            customerId: card.customerId,
                            customerName: card.customerName,
                            customerMobile: card.customerMobile,
                            cardNumber: card.cardNumber,
                            scheduleCode: `SCH-2026-${Math.floor(100 + Math.random() * 900)}`,
                          });
                          setIsScheduleModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-[11px] font-bold border border-blue-500/40"
                      >
                        + শিডিউল বরাদ্দ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: PRODUCT SCHEDULES & CALENDAR
      ----------------------------------------------------- */}
      {activeSubTab === 'schedules' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">শিডিউল কোড</th>
                  <th className="px-4 py-3.5">কার্ড ও গ্রাহক</th>
                  <th className="px-4 py-3.5">পণ্য ও পরিমাণ</th>
                  <th className="px-4 py-3.5">নায্যমূল্য বরাদ্দ</th>
                  <th className="px-4 py-3.5">সরবরাহের নির্ধারিত তারিখ</th>
                  <th className="px-4 py-3.5">বিতরণ পয়েন্ট</th>
                  <th className="px-4 py-3.5">ডেলিভারি অবস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSchedules.map((sch) => (
                  <tr key={sch.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-amber-400 text-xs">{sch.scheduleCode}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-white block">{sch.customerName}</span>
                      <span className="font-mono text-[10px] text-amber-300/90">{sch.cardNumber}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-white block">{sch.productNameBn}</span>
                      <span className="text-[11px] text-slate-400">পরিমাণ: {sch.quantity}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-emerald-400 text-xs">৳ {sch.allocatedPrice}</span>
                      <span className="text-[10px] text-slate-500 block">বাজার মূল্য: ৳ {sch.retailPrice}</span>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-white text-xs font-bold">
                      {sch.scheduledDate}
                    </td>

                    <td className="px-4 py-3.5 text-[11px] text-slate-300 max-w-[180px]">
                      {sch.deliveryPoint}
                    </td>

                    <td className="px-4 py-3.5">
                      <select
                        value={sch.status}
                        onChange={(e) => {
                          Storage.updateScheduleStatus(sch.id, e.target.value as ProductScheduleItem['status']);
                          reloadData();
                        }}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-white font-bold"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Ready for Pickup">Ready for Pickup</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Skipped">Skipped</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL: CREATE CARD
      ----------------------------------------------------- */}
      {isCardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span>নতুন নায্যমূল্য কার্ড ইস্যু করুন</span>
              </h3>
              <button onClick={() => setIsCardModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">কার্ড নম্বর</label>
                  <input
                    type="text"
                    value={cardForm.cardNumber}
                    onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">মাসিক খাদ্য কোটা (কেজি)</label>
                  <input
                    type="number"
                    value={cardForm.monthlyQuotaKg}
                    onChange={(e) => setCardForm({ ...cardForm, monthlyQuotaKg: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">গ্রাহকের নাম (Cardholder Name)</label>
                <input
                  type="text"
                  value={cardForm.customerName}
                  onChange={(e) => setCardForm({ ...cardForm, customerName: e.target.value })}
                  placeholder="যেমন: মোঃ আব্দুর রহিম"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    value={cardForm.customerMobile}
                    onChange={(e) => setCardForm({ ...cardForm, customerMobile: e.target.value })}
                    placeholder="017xxxxxxxx"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">কার্ড ফি (টাকা)</label>
                  <input
                    type="number"
                    value={cardForm.cardFee}
                    onChange={(e) => setCardForm({ ...cardForm, cardFee: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCardModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  কার্ড সংরক্ষণ ও সক্রিয় করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL: CREATE SCHEDULE
      ----------------------------------------------------- */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>খাদ্য সামগ্রী সরবরাহের শিডিউল যোগ করুন</span>
              </h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">কার্ড নম্বর</label>
                  <input
                    type="text"
                    value={scheduleForm.cardNumber}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, cardNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">গ্রাহকের নাম</label>
                  <input
                    type="text"
                    value={scheduleForm.customerName}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, customerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">খাদ্য সামগ্রীর নাম ও প্যাকেজ</label>
                <input
                  type="text"
                  value={scheduleForm.productNameBn}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, productNameBn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">পরিমাণ</label>
                  <input
                    type="text"
                    value={scheduleForm.quantity}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, quantity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">নায্যমূল্য (টাকা)</label>
                  <input
                    type="number"
                    value={scheduleForm.allocatedPrice}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, allocatedPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">নির্ধারিত তারিখ</label>
                  <input
                    type="date"
                    value={scheduleForm.scheduledDate}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">বিতরণ পয়েন্ট (Pickup Point)</label>
                <input
                  type="text"
                  value={scheduleForm.deliveryPoint}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, deliveryPoint: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  শিডিউল কনফার্ম করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
