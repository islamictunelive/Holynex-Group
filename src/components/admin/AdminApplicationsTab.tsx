import React, { useState } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { DealerApplication, AdminUser } from '../../types';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Camera,
  AlertCircle,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  X,
  MessageSquare,
  Sparkles,
  Check,
} from 'lucide-react';

interface AdminApplicationsTabProps {
  currentUser: AdminUser | null;
  onRefresh: () => void;
}

export const AdminApplicationsTab: React.FC<AdminApplicationsTabProps> = ({
  currentUser,
  onRefresh,
}) => {
  const { t } = useLanguage();
  const [applications, setApplications] = useState<DealerApplication[]>(() =>
    Storage.getApplications()
  );
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<DealerApplication | null>(null);

  // Direct Messaging Modal State
  const [messagingApp, setMessagingApp] = useState<DealerApplication | null>(null);
  const [directMessageText, setDirectMessageText] = useState('');
  const [directMessageTitle, setDirectMessageTitle] = useState('হোলিনেক্স ডিলার নোটিশ');
  const [messageChannel, setMessageChannel] = useState<'sms' | 'push' | 'system'>('sms');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Review fields
  const [statusInput, setStatusInput] = useState<'Pending' | 'Under Review' | 'Approved' | 'Rejected'>('Pending');
  const [publicMsg, setPublicMsg] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [autoSmsNotify, setAutoSmsNotify] = useState(true);
  const [feedback, setFeedback] = useState('');

  const refreshList = () => {
    setApplications(Storage.getApplications());
    onRefresh();
  };

  const openReview = (app: DealerApplication) => {
    setSelectedApp(app);
    setStatusInput(app.status);
    setPublicMsg(app.publicMessage || '');
    setAdminNote(app.adminPrivateNotes || app.adminNote || '');
    setAutoSmsNotify(true);
  };

  const handleStatusSelect = (st: 'Pending' | 'Under Review' | 'Approved' | 'Rejected') => {
    setStatusInput(st);
    if (!selectedApp) return;

    if (st === 'Approved') {
      const code = `DLR-${selectedApp.id.replace('HNX-2026-', '')}`;
      setPublicMsg(
        `অভিনন্দন! আপনার হোলিনেক্স ডিলারশিপ আবেদন অনুমোদিত হয়েছে। আপনার অফিশিয়াল ডিলার কোড: ${code}। ডিলার কিট, ব্যানার ও চুক্তিপত্র গ্রহণের জন্য প্রধান কার্যালয়ে যোগাযোগ করুন: 01307835260`
      );
    } else if (st === 'Under Review') {
      setPublicMsg(
        `আপনার ডিলারশিপ আবেদনপত্রটি প্রাথমিক মূল্যায়ন সাপেক্ষে বিবেচনায় রয়েছে। আমাদের প্রতিনিধি খুব শীঘ্রই আপনার প্রদত্ত নম্বরে যোগাযোগ করবেন।`
      );
    } else if (st === 'Rejected') {
      setPublicMsg(
        `দুঃখিত, বর্তমান কোটা এবং ভৌগোলিক নীতিমালার সাথে সামঞ্জস্যপূর্ণ না হওয়ায় আপনার আবেদনটি এই মুহূর্তে অনুমোদন করা সম্ভব হয়নি।`
      );
    }
  };

  const saveReview = async () => {
    if (!selectedApp) return;

    // 1. Update in Storage with auto notification
    Storage.updateApplicationStatus(
      selectedApp.id,
      statusInput,
      adminNote,
      publicMsg,
      autoSmsNotify
    );

    // 2. Try Server
    try {
      await fetch(`/api/admin/applications/${selectedApp.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusInput,
          publicMessage: publicMsg,
          adminPrivateNotes: adminNote,
        }),
      });
    } catch {}

    setFeedback(
      statusInput === 'Approved'
        ? t(
            `আবেদন #${selectedApp.id} অনুমোদিত হয়েছে এবং ডিলারের কাছে স্বয়ংক্রিয় কনফার্মেশন মেসেজ প্রেরিত হয়েছে!`,
            `Application #${selectedApp.id} Approved and auto-message sent to dealer!`
          )
        : t(`আবেদন #${selectedApp.id} সফলভাবে আপডেট হয়েছে`, `Application #${selectedApp.id} status updated`)
    );
    setSelectedApp(null);
    refreshList();
    setTimeout(() => setFeedback(''), 4000);
  };

  const openDirectMessage = (app: DealerApplication) => {
    setMessagingApp(app);
    setDirectMessageTitle(`জরুরি বার্তা: ${app.fullName}`);
    setDirectMessageText(
      `সম্মানিত ${app.fullName} (${app.id}), হোলিনেক্স গ্রুপ ডিলার নেটওয়ার্ক থেকে জানানো যাচ্ছে যে, `
    );
  };

  const applyTemplate = (tmpl: string) => {
    if (!messagingApp) return;
    const dealerName = messagingApp.fullName;
    const dealerId = messagingApp.id;

    if (tmpl === 'welcome') {
      setDirectMessageText(
        `অভিনন্দন ${dealerName}! আপনার ডিলারশিপ আইডি: ${dealerId}। হোলিনেক্স ফেয়ার প্রাইস কার্ড ও কিস্তি সিস্টেমের অফিসিয়াল ডিলার পোর্টাল অ্যাক্সেস এবং পণ্যের ক্যাটালগের জন্য যোগাযোগ করুন: 01307835260`
      );
    } else if (tmpl === 'doc_request') {
      setDirectMessageText(
        `শ্রদ্ধেয় ${dealerName} (${dealerId}), আপনার ডিলারশিপ ফাইনাল এগ্রিমেন্টের জন্য ট্রেড লাইসেন্স ও ২ কপি পাসপোর্ট ছবি প্রধান কার্যালয়ে প্রেরণের অনুরোধ করা হচ্ছে।`
      );
    } else if (tmpl === 'visit_hq') {
      setDirectMessageText(
        `জনাব ${dealerName}, আপনার ডিলারশিপ চুক্তি স্বাক্ষর ও অফিসিয়াল স্টোর ব্র্যান্ডিং কিট গ্রহণের জন্য আগামী কার্যদিবসে হোলিনেক্স প্রধান কার্যালয়ে আসার আমন্ত্রণ জানানো হলো।`
      );
    } else if (tmpl === 'stock_update') {
      setDirectMessageText(
        `সম্মানিত ডিলার ${dealerName}, চাল, আটা, ডাল, তেল ও হোম অ্যাপ্লায়েন্সের নতুন কিস্তি স্টক আপনার নির্দিষ্ট জোনে পৌঁছানোর প্রস্তুতি চলছে।`
      );
    }
  };

  const sendDirectMessage = () => {
    if (!messagingApp || !directMessageText.trim()) return;
    setIsSendingMessage(true);

    const res = Storage.sendMessageToDealer(
      messagingApp.id,
      directMessageText.trim(),
      messageChannel,
      directMessageTitle
    );

    setIsSendingMessage(false);
    if (res.success) {
      setFeedback(
        t(
          `ডিলার ${messagingApp.fullName} (${messagingApp.mobile})-কে সফলভাবে মেসেজ পাঠানো হয়েছে!`,
          `Message successfully sent to ${messagingApp.fullName} (${messagingApp.mobile})!`
        )
      );
      setMessagingApp(null);
      refreshList();
      setTimeout(() => setFeedback(''), 4500);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      app.fullName.toLowerCase().includes(q) ||
      app.id.toLowerCase().includes(q) ||
      app.mobile.includes(q) ||
      app.dealerArea.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 p-6 rounded-2xl border border-amber-500/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
              {t('ডিলারশিপ আবেদনপত্র ও মেসেজিং সিস্টেম', 'Dealer Verification & Messaging System')}
            </h2>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/40">
              {applications.length} {t('টি আবেদন', 'Applications')}
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            {t(
              'আবেদন অনুমোদন হলে আবেদনকারী সাথে সাথে অটোমেসেজ পাবেন। এছাড়া যেকোনো সময় যেকোনো ডিলারকে সরাসরি কাস্টম মেসেজ পাঠাতে পারেন।',
              'Dealers receive automatic SMS on approval. You can also dispatch instant direct messages anytime.'
            )}
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {['all', 'Pending', 'Under Review', 'Approved', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterStatus === st
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {st === 'all' ? t('সকল (All)', 'All') : st}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('আইডি, নাম, মোবাইল বা এলাকা দিয়ে খুঁজুন...', 'Search by ID, name, mobile, area...')}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 text-white rounded-xl border border-amber-500/30 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder-slate-500"
        />
      </div>

      {/* Applications Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-amber-500/20 shadow-xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/90 border-b border-amber-500/20 text-amber-300/90 font-semibold">
                <th className="p-3.5">{t('ছবি ও ট্র্যাকিং আইডি', 'Photo & ID')}</th>
                <th className="p-3.5">{t('আবেদনকারী ও পিতা', 'Applicant & Father')}</th>
                <th className="p-3.5">{t('যোগাযোগ ও এলাকা', 'Contact & Territory')}</th>
                <th className="p-3.5">{t('বর্তমান অবস্থা', 'Status')}</th>
                <th className="p-3.5">{t('সর্বশেষ বার্তা', 'Latest Notice')}</th>
                <th className="p-3.5 text-right">{t('অ্যাকশন', 'Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium text-slate-200">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    {t('কোনো ডিলারশিপ আবেদন পাওয়া যায়নি', 'No applications found')}
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-black border border-amber-500/30 shrink-0">
                          {app.photoUrl ? (
                            <img
                              src={app.photoUrl}
                              alt="Applicant"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Camera className="w-5 h-5 text-slate-500 m-auto mt-2.5" />
                          )}
                        </div>
                        <div>
                          <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 block text-[11px]">
                            {app.id}
                          </span>
                          {app.smsNotified && (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
                              <Check className="w-2.5 h-2.5" /> SMS প্রেরিত
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{app.fullName}</div>
                      <div className="text-[11px] text-slate-400">পিতা: {app.fatherName}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-mono font-bold text-amber-200">{app.mobile}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{app.dealerArea}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1 ${
                          app.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : app.status === 'Under Review'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : app.status === 'Rejected'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}
                      >
                        {app.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                        {app.status === 'Under Review' && <Clock className="w-3 h-3" />}
                        {app.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                        {app.status === 'Pending' && <AlertCircle className="w-3 h-3" />}
                        {app.status}
                      </span>
                    </td>

                    <td className="p-3.5 max-w-[200px]">
                      <p className="truncate text-slate-300 text-[11px] italic" title={app.publicMessage}>
                        {app.publicMessage || '—'}
                      </p>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Instant Message Dealer Button */}
                        <button
                          onClick={() => openDirectMessage(app)}
                          className="px-2.5 py-1.5 bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                          title="ডিলারকে সরাসরি বার্তা পাঠান"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{t('মেসেজ পাঠান', 'Send Msg')}</span>
                        </button>

                        {/* Review Application Button */}
                        <button
                          onClick={() => openReview(app)}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 rounded-lg font-black text-xs transition-colors shadow-sm"
                        >
                          {t('যাচাই ও সম্পাদন', 'Review')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Dealer Messaging Modal */}
      {messagingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-xl w-full my-8 shadow-2xl p-6 sm:p-8 space-y-5 text-white animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {t('ডিলারকে সরাসরি মেসেজ পাঠান', 'Send Direct Message to Dealer')}
                  </h3>
                  <p className="text-xs text-amber-400/90 font-mono">
                    {messagingApp.fullName} • {messagingApp.mobile} ({messagingApp.id})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMessagingApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Template Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-amber-300/80 block">
                {t('রেডিমেড টেমপ্লেট থেকে দ্রুত সিলেক্ট করুন:', 'Quick Message Templates:')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyTemplate('welcome')}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700 text-slate-300 transition-colors"
                >
                  ✓ অনুমোদন ও কিট নোটিশ
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('doc_request')}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700 text-slate-300 transition-colors"
                >
                  ✓ এনআইডি ও ট্রেড লাইসেন্স চাওয়া
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('visit_hq')}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700 text-slate-300 transition-colors"
                >
                  ✓ প্রধান কার্যালয়ে আমন্ত্রণ
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('stock_update')}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700 text-slate-300 transition-colors"
                >
                  ✓ কিস্তি ও খাদ্যপণ্য স্টক আপডেট
                </button>
              </div>
            </div>

            {/* Title / Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t('বার্তার শিরোনাম / বিষয়', 'Message Subject')}
              </label>
              <input
                type="text"
                value={directMessageTitle}
                onChange={(e) => setDirectMessageTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Message Body */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-300">
                  {t('বার্তার বিবরণ (Message Body) *', 'Message Content *')}
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {directMessageText.length} অক্ষর
                </span>
              </div>
              <textarea
                rows={4}
                required
                value={directMessageText}
                onChange={(e) => setDirectMessageText(e.target.value)}
                placeholder="এখানে আপনার কাঙ্ক্ষিত বার্তা লিখুন যা ডিলারের মোবাইলে এবং স্ট্যাটাস প্যানেলে প্রদর্শিত হবে..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>

            {/* Channel options */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">প্রেরণের মাধ্যম:</span>
              <div className="flex gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer text-amber-300 font-bold">
                  <input
                    type="radio"
                    name="msgChannel"
                    checked={messageChannel === 'sms'}
                    onChange={() => setMessageChannel('sms')}
                    className="accent-amber-500"
                  />
                  <span>মোবাইল SMS ও নোটিস</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="msgChannel"
                    checked={messageChannel === 'system'}
                    onChange={() => setMessageChannel('system')}
                    className="accent-amber-500"
                  />
                  <span>শুধুমাত্র সিস্টেম নোটিস</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setMessagingApp(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                {t('বাতিল', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={sendDirectMessage}
                disabled={isSendingMessage || !directMessageText.trim()}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingMessage ? t('পাঠানো হচ্ছে...', 'Sending...') : t('মেসেজ পাঠান', 'Send Message')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Review & Approval Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full my-8 shadow-2xl p-6 sm:p-8 space-y-6 text-white animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  {t('আবেদনপত্র পর্যালোচনা ও সিদ্ধান্ত প্রদান', 'Application Verification & Decision')}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Applicant Summary */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-black border border-amber-500/40 shrink-0">
                {selectedApp.photoUrl ? (
                  <img
                    src={selectedApp.photoUrl}
                    alt={selectedApp.fullName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-slate-500 m-auto mt-6" />
                )}
              </div>
              <div className="flex-1 text-xs space-y-1 text-slate-300">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-white">{selectedApp.fullName}</h4>
                  <span className="font-mono text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                    {selectedApp.id}
                  </span>
                </div>
                <p>
                  পিতা: <strong className="text-white">{selectedApp.fatherName}</strong> • মাতা: <strong className="text-white">{selectedApp.motherName}</strong>
                </p>
                <p>
                  মোবাইল: <strong className="font-mono text-amber-300">{selectedApp.mobile}</strong> • পেশা: {selectedApp.occupation}
                </p>
                <p>
                  ডিলারশিপ এলাকা: <strong className="text-amber-200">{selectedApp.dealerArea}</strong>
                </p>
                <p className="text-slate-400">
                  ঠিকানা: {selectedApp.address}
                </p>
              </div>
            </div>

            {/* Status Selector */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  {t('সিদ্ধান্ত / বর্তমান স্ট্যাটাস (Status) *', 'Decision / Status *')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Pending', 'Under Review', 'Approved', 'Rejected'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusSelect(st)}
                      className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                        statusInput === st
                          ? st === 'Approved'
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-lg shadow-emerald-500/30'
                            : st === 'Rejected'
                            ? 'bg-rose-500 text-white border-rose-400 font-black shadow-lg shadow-rose-500/30'
                            : 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-lg shadow-amber-500/30'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {st === 'Approved' ? '✓ Approved (অনুমোদন)' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Alert Highlight */}
              {statusInput === 'Approved' && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>স্বয়ংক্রিয় নোটিশ:</strong> ডিলার আবেদন এক্সেপ্ট করার সাথে সাথে আবেদনকারীর মোবাইলে কনফার্মেশন ও অফিসিয়াল ডিলার কোড মেসেজ যাবে।
                  </span>
                </div>
              )}

              {/* Public tracking message */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {t('আবেদনকারীর জন্য বার্তা (ডিলারের মোবাইলে এবং অনলাইন ট্র্যাকিংয়ে দৃশ্যমান)', 'Public Message for Applicant')}
                </label>
                <textarea
                  rows={3}
                  value={publicMsg}
                  onChange={(e) => setPublicMsg(e.target.value)}
                  placeholder="যেমন: অভিনন্দন! আপনার ডিলার আবেদন অনুমোদিত হয়েছে..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Private internal note */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {t('অফিসিয়াল গোপনীয় মন্তব্য (Internal Admin Note - শুধুমাত্র স্টাফদের জন্য)', 'Internal Admin Note')}
                </label>
                <input
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="যেমন: সাভার জোনের প্রধান ডিলার হিসেবে অনুমোদিত। সিকিউরিটি মানি প্রাপ্ত হয়েছে।"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Auto SMS checkbox */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSmsNotify}
                    onChange={(e) => setAutoSmsNotify(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>{t('ডিলারকে স্বয়ংক্রিয় এসএমএস কনফার্মেশন পাঠান', 'Send Automatic SMS Confirmation')}</span>
                </label>
                <span className="text-[10px] text-amber-400 font-mono">GATEWAY_ACTIVE</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="button"
                  onClick={saveReview}
                  className="px-6 py-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20"
                >
                  {t('সংরক্ষণ ও আপডেট করুন', 'Save & Update')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
