import React, { useState } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import {
  CommissionRecord,
  WithdrawalRequest,
  CommissionRule,
  CommissionLedgerEntry,
  HierarchyTransaction,
} from '../../types';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  ArrowDownToLine,
  Sliders,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  FileText,
  GitBranch,
  Layers,
  PlusCircle,
  Building2,
  Briefcase,
  Store,
  Users,
} from 'lucide-react';

export const AdminCommissionTab: React.FC = () => {
  const { t } = useLanguage();
  const [subTab, setSubTab] = useState<'ledger' | 'transactions' | 'withdrawals' | 'rules'>('ledger');

  const [commissions, setCommissions] = useState<CommissionRecord[]>(() => Storage.getCommissions());
  const [hierarchyLedgers, setHierarchyLedgers] = useState<CommissionLedgerEntry[]>(() =>
    Storage.getCommissionLedger()
  );
  const [transactions, setTransactions] = useState<HierarchyTransaction[]>(() =>
    Storage.getHierarchyTransactions()
  );
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => Storage.getWithdrawals());
  const [rules, setRules] = useState<CommissionRule[]>(() => Storage.getCommissionRules());
  const [searchQuery, setSearchQuery] = useState('');

  // Process transaction modal
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [txAmount, setTxAmount] = useState(3500);
  const [productType, setProductType] = useState<'fair_price_card' | 'grocery' | 'appliance'>('grocery');

  const allCustomers = Storage.getNetworkPeople().filter((p) => p.role === 'customer');

  const reloadData = () => {
    setCommissions(Storage.getCommissions());
    setHierarchyLedgers(Storage.getCommissionLedger());
    setTransactions(Storage.getHierarchyTransactions());
    setWithdrawals(Storage.getWithdrawals());
    setRules(Storage.getCommissionRules());
  };

  const handleUpdateWithdrawalStatus = (id: string, status: WithdrawalRequest['status'], note?: string) => {
    Storage.updateWithdrawalStatus(id, status, note);
    reloadData();
  };

  const handleProcessTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      alert(t('গ্রাহক নির্বাচন করুন।', 'Please select a customer.'));
      return;
    }

    Storage.processHierarchyTransaction({
      customerId: selectedCustomerId,
      productType,
      totalAmount: Number(txAmount) || 1000,
    });

    reloadData();
    setIsProcessModalOpen(false);
  };

  const totalHierarchyCommissions = hierarchyLedgers.reduce((sum, c) => sum + c.commissionAmount, 0);
  const pendingWithdrawalsTotal = withdrawals
    .filter((w) => w.status === 'pending')
    .reduce((sum, w) => sum + w.amount, 0);
  const totalPaidOut = withdrawals
    .filter((w) => w.status === 'paid')
    .reduce((sum, w) => sum + w.amount, 0);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'dealer':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
            <Store className="w-2.5 h-2.5" />
            <span>মূল ডিলার</span>
          </span>
        );
      case 'sub_dealer':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
            <Building2 className="w-2.5 h-2.5" />
            <span>সাব-ডিলার</span>
          </span>
        );
      case 'worker':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
            <Briefcase className="w-2.5 h-2.5" />
            <span>কর্মী (Worker)</span>
          </span>
        );
      default:
        return <span className="text-[10px] text-slate-400">{role}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <DollarSign className="w-4 h-4" />
            <span>স্বয়ংক্রিয় মাল্টি-টিয়ার কমিশন ও পে-আউট ইঞ্জিন</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {t('কমিশন লেজার ও উত্তোলন (Payouts) ব্যবস্থাপনা', 'Multi-Tier Commission Ledger & Withdrawals')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t(
              'গ্রাহকের কেনাকাটায় কর্মী (৳৫০), সাব-ডিলার (৳৫০) ও মূল ডিলারের (৳১০০) স্বয়ংক্রিয় ক্রেডিট ও উত্তোলন অনুমোদন।',
              'Automated tiered commission distribution to Workers, Sub-Dealers, and Main Dealers.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsProcessModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ট্রানজেকশন প্রসেস / টেস্ট</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>সর্বমোট বণ্টিত কমিশন</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-emerald-400 font-mono">
            ৳ {totalHierarchyCommissions.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            {hierarchyLedgers.length} টি লেজার এন্ট্রিতে জমা হয়েছে
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>অপেক্ষমান উত্তোলন অনুরোধ</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-amber-400 font-mono">
            ৳ {pendingWithdrawalsTotal.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            {withdrawals.filter((w) => w.status === 'pending').length} টি আবেদন অনুমোদনের অপেক্ষায়
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>মোট পরিশোধিত উইথড্রয়াল</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl font-black text-blue-400 font-mono">
            ৳ {totalPaidOut.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">বিকাশ/নগদ/ব্যাংকে সফল সেটেলমেন্ট</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>হায়ারার্কি ট্রানজেকশন</span>
            <GitBranch className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-2xl font-black text-purple-400 font-mono">
            {transactions.length} টি
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">স্বয়ংক্রিয় মাল্টি-লেভেল ডিসপ্যাচ</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setSubTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'ledger'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>কমিশন লেজার ({hierarchyLedgers.length})</span>
        </button>

        <button
          onClick={() => setSubTab('transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'transactions'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>হায়ারার্কি ট্রানজেকশনসমূহ ({transactions.length})</span>
        </button>

        <button
          onClick={() => setSubTab('withdrawals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'withdrawals'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowDownToLine className="w-3.5 h-3.5" />
          <span>উত্তোলন অনুরোধ ({withdrawals.length})</span>
        </button>

        <button
          onClick={() => setSubTab('rules')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'rules'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>কমিশন রুলস ও হার ({rules.length})</span>
        </button>
      </div>

      {/* ----------------------------------------------------
          SUB-TAB 1: HIERARCHY COMMISSION LEDGER
      ----------------------------------------------------- */}
      {subTab === 'ledger' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">লেজার রেফারেন্স</th>
                  <th className="py-3 px-4">প্রাপক সদস্য ও রোল</th>
                  <th className="py-3 px-4">ট্রানজেকশন রেফারেন্স</th>
                  <th className="py-3 px-4">গণনার ভিত্তি (Base)</th>
                  <th className="py-3 px-4">কমিশন রেট ও আর্নিং</th>
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {hierarchyLedgers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      কোনো লেজার এন্ট্রি পাওয়া যায়নি। ট্রানজেকশন প্রসেস করে পরীক্ষা করুন।
                    </td>
                  </tr>
                ) : (
                  hierarchyLedgers.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {entry.id}
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-white block">{entry.recipientName}</span>
                          <div className="flex items-center gap-1.5">
                            {getRoleBadge(entry.recipientRole)}
                            <span className="text-[10px] text-slate-500 font-mono">
                              {entry.recipientId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-400">
                        {entry.transactionId}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-300">
                        ৳ {entry.calculationBase.toLocaleString()}
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-emerald-400 font-mono font-black text-sm block">
                          +৳ {entry.commissionAmount.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {entry.commissionType === 'flat' ? 'ফ্ল্যাট রেট' : `${entry.commissionRate}%`}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          {entry.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          SUB-TAB 2: HIERARCHY TRANSACTIONS
      ----------------------------------------------------- */}
      {subTab === 'transactions' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">ট্রানজেকশন আইডি</th>
                  <th className="py-3 px-4">গ্রাহক</th>
                  <th className="py-3 px-4">পণ্য ও পরিমাণ</th>
                  <th className="py-3 px-4">হায়ারার্কি চেইন (Worker ➔ Sub ➔ Dealer)</th>
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      কোনো ট্রানজেকশন সম্পন্ন হয়নি।
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {tx.id}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-white block">{tx.customerName}</span>
                        <span className="font-mono text-[10px] text-slate-400">{tx.customerId}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-emerald-400 text-sm">
                          ৳ {tx.totalAmount.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-400 block uppercase">
                          {(tx.productType || 'general').replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[11px] font-mono">
                        <div className="space-y-0.5">
                          {tx.workerId && (
                            <div className="text-purple-300">WRK: {tx.workerId} (+৳৫০)</div>
                          )}
                          {tx.subDealerId && (
                            <div className="text-blue-300">SUB: {tx.subDealerId} (+৳৫০)</div>
                          )}
                          {tx.dealerId && (
                            <div className="text-amber-400">DLR: {tx.dealerId} (+৳১০০)</div>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {new Date(tx.createdAt || tx.date).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          {tx.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          SUB-TAB 3: WITHDRAWAL REQUESTS
      ----------------------------------------------------- */}
      {subTab === 'withdrawals' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">অনুরোধ আইডি</th>
                  <th className="py-3 px-4">সদস্যের নাম ও পদবী</th>
                  <th className="py-3 px-4">পরিমাণ</th>
                  <th className="py-3 px-4">পেমেন্ট মেথড ও একাউন্ট</th>
                  <th className="py-3 px-4">আবেদনের তারিখ</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      কোনো উত্তোলনের আবেদন জমা পড়েনি।
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((wth) => (
                    <tr key={wth.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {wth.id}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-white block">{wth.requesterName}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {getRoleBadge(wth.requesterRole)}
                          <span className="font-mono text-[10px] text-slate-400">
                            {wth.requesterId}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-black text-amber-400 text-sm">
                        ৳ {wth.amount.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span className="uppercase font-bold text-slate-200 block">
                          {wth.payoutMethod}
                        </span>
                        <span className="text-[11px] text-slate-400">{wth.payoutDetails}</span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {new Date(wth.requestedAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4">
                        {wth.status === 'pending' && (
                          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                            অপেক্ষমান
                          </span>
                        )}
                        {wth.status === 'paid' && (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                            পরিশোধিত
                          </span>
                        )}
                        {wth.status === 'rejected' && (
                          <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                            বাতিল
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {wth.status === 'pending' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleUpdateWithdrawalStatus(wth.id, 'paid')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm"
                            >
                              অনুমোদন
                            </button>
                            <button
                              onClick={() => handleUpdateWithdrawalStatus(wth.id, 'rejected')}
                              className="px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg text-[10px] font-bold transition-all"
                            >
                              বাতিল
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          SUB-TAB 4: COMMISSION RULES
      ----------------------------------------------------- */}
      {subTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-base">{rule.eventName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {getRoleBadge(rule.role)}
                    <span className="text-[10px] text-slate-400 font-mono">{rule.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black font-mono text-emerald-400">
                    {rule.rewardType === 'flat' ? `৳ ${rule.amount}` : `${rule.amount}%`}
                  </span>
                  <span className="text-[10px] text-slate-500 block">কমিশন রেট</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{rule.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Process Transaction Simulation Modal */}
      {isProcessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                <span>নতুন ট্রানজেকশন প্রসেস করুন</span>
              </h3>
              <button onClick={() => setIsProcessModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessTransaction} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">গ্রাহক নির্বাচন করুন *</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                  required
                >
                  <option value="">-- গ্রাহক নির্বাচন করুন --</option>
                  {allCustomers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.area}) - {c.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">পণ্যের ধরন (Product Category)</label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="grocery">নিত্যপ্রয়োজনীয় পণ্য (Grocery)</option>
                  <option value="appliance">ইলেকট্রনিক্স ও হোম অ্যাপ্লায়েন্স</option>
                  <option value="fair_price_card">নায্যমূল্য কার্ড সাবস্ক্রিপশন</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">মোট কেনাকাটার পরিমাণ (টাকা) *</label>
                <input
                  type="number"
                  min={100}
                  value={txAmount}
                  onChange={(e) => setTxAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1">
                <span className="text-amber-400 font-bold block mb-1">স্বয়ংক্রিয় বণ্টন:</span>
                <div className="text-slate-300">১. ফিল্ড কর্মী: ৳৫০</div>
                <div className="text-slate-300">২. সাব-ডিলার: ৳৫০</div>
                <div className="text-slate-300">৩. মূল ডিলার: ৳১০০</div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProcessModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  প্রসেস করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
