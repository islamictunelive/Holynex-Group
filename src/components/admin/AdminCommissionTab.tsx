import React, { useState } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { CommissionRecord, WithdrawalRequest, CommissionRule } from '../../types';
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
} from 'lucide-react';

export const AdminCommissionTab: React.FC = () => {
  const { t } = useLanguage();
  const [subTab, setSubTab] = useState<'ledger' | 'withdrawals' | 'rules'>('withdrawals');

  const [commissions, setCommissions] = useState<CommissionRecord[]>(() => Storage.getCommissions());
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => Storage.getWithdrawals());
  const [rules, setRules] = useState<CommissionRule[]>(() => Storage.getCommissionRules());
  const [searchQuery, setSearchQuery] = useState('');

  const reloadData = () => {
    setCommissions(Storage.getCommissions());
    setWithdrawals(Storage.getWithdrawals());
    setRules(Storage.getCommissionRules());
  };

  const handleUpdateWithdrawalStatus = (id: string, status: WithdrawalRequest['status'], note?: string) => {
    Storage.updateWithdrawalStatus(id, status, note);
    reloadData();
  };

  const handleUpdateCommissionStatus = (id: string, status: CommissionRecord['status']) => {
    Storage.updateCommissionStatus(id, status);
    reloadData();
  };

  const totalCommissionsEarned = commissions.reduce((sum, c) => sum + c.amount, 0);
  const pendingWithdrawalsTotal = withdrawals
    .filter((w) => w.status === 'pending')
    .reduce((sum, w) => sum + w.amount, 0);
  const totalPaidOut = withdrawals
    .filter((w) => w.status === 'paid')
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <DollarSign className="w-4 h-4" />
            <span>কমিশন ইঞ্জিন ও ফাইন্যান্সিয়াল সেটেলমেন্ট</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {t('কমিশন লেজার ও উত্তোলন (Withdrawal) অনুরোধ', 'Commission Ledger & Withdrawal Payouts')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('ডিলার, সাব-ডিলার, কর্মী ও প্রতিনিধিদের উপার্জিত কমিশন এবং পেমেন্ট অনুমোদন।', 'Approve withdrawals via bKash, Nagad, and bank accounts for the network.')}
          </p>
        </div>

        <div className="flex gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setSubTab('withdrawals')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'withdrawals' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>উত্তোলন অনুরোধ ({withdrawals.length})</span>
          </button>
          <button
            onClick={() => setSubTab('ledger')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'ledger' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>কমিশন লেজার ({commissions.length})</span>
          </button>
          <button
            onClick={() => setSubTab('rules')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'rules' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>কমিশন রুলস ({rules.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur">
          <span className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider">মোট জেনারেটেড কমিশন</span>
          <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
            ৳ {totalCommissionsEarned.toLocaleString()}
          </span>
        </div>
        <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-2xl backdrop-blur">
          <span className="text-[11px] text-amber-400 block font-bold uppercase tracking-wider">পেন্ডিং উইথড্রয়াল পে-আউট</span>
          <span className="text-2xl font-black text-white font-mono mt-1 block">
            ৳ {pendingWithdrawalsTotal.toLocaleString()}
          </span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur">
          <span className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider">পরিশোধিত উইথড্রয়াল (Paid Out)</span>
          <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
            ৳ {totalPaidOut.toLocaleString()}
          </span>
        </div>
      </div>

      {/* ----------------------------------------------------
          TAB 1: WITHDRAWALS REQUESTS & PAYOUTS
      ----------------------------------------------------- */}
      {subTab === 'withdrawals' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">উত্তোলন আইডি</th>
                  <th className="px-4 py-3.5">অনুরোধকারী ও পদবী</th>
                  <th className="px-4 py-3.5">টাকার পরিমাণ</th>
                  <th className="px-4 py-3.5">পেমেন্ট মেথড ও তথ্য</th>
                  <th className="px-4 py-3.5">অনুরোধের সময়</th>
                  <th className="px-4 py-3.5">স্ট্যাটাস</th>
                  <th className="px-5 py-3.5 text-right">পে-আউট অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {withdrawals.map((wth) => (
                  <tr key={wth.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-amber-400">{wth.id}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-white block">{wth.requesterName}</span>
                      <span className="font-mono text-[10px] text-slate-400">{wth.requesterId} • {wth.requesterRole.toUpperCase()}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="text-base font-black text-emerald-400 font-mono">
                        ৳ {wth.amount.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-white block">{wth.payoutMethod}</span>
                      <span className="font-mono text-[11px] text-slate-300">{wth.payoutDetails}</span>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-400 text-[11px]">
                      {new Date(wth.requestedAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          wth.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : wth.status === 'approved'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : wth.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {wth.status === 'paid' ? 'পরিশোধিত (Paid)' : wth.status === 'approved' ? 'অনুমোদিত' : wth.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      {wth.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateWithdrawalStatus(wth.id, 'paid', 'অ্যাডমিন কর্তৃক সরাসরি পেইড করা হয়েছে')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-all shadow"
                          >
                            Mark Paid
                          </button>
                          <button
                            onClick={() => handleUpdateWithdrawalStatus(wth.id, 'rejected', 'তথ্য অমিল রয়েছে')}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg text-xs transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {wth.status === 'paid' && (
                        <span className="text-[11px] text-emerald-400 flex items-center justify-end gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>সেটেল্ড</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: COMMISSION LEDGER
      ----------------------------------------------------- */}
      {subTab === 'ledger' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">লেজার রেফারেন্স</th>
                  <th className="px-4 py-3.5">প্রাপক সদস্য</th>
                  <th className="px-4 py-3.5">কমিশন ইভেন্ট ও সূত্র</th>
                  <th className="px-4 py-3.5">অর্জিত টাকা</th>
                  <th className="px-4 py-3.5">তারিখ</th>
                  <th className="px-4 py-3.5">অবস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {commissions.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-amber-400">{c.id}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-white block">{c.recipientName}</span>
                      <span className="font-mono text-[10px] text-slate-400">{c.recipientId} • {c.recipientRole}</span>
                    </td>

                    <td className="px-4 py-3.5 text-slate-200">
                      {c.sourceEvent}
                    </td>

                    <td className="px-4 py-3.5 font-mono font-black text-emerald-400 text-sm">
                      ৳ {c.amount.toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 3: COMMISSION RULES
      ----------------------------------------------------- */}
      {subTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase">
                    {rule.role.replace('_', ' ')}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-2">{rule.eventName}</h4>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    {rule.rewardType === 'flat' ? `৳ ${rule.amount}` : `${rule.amount}%`}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{rule.rewardType.toUpperCase()}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
