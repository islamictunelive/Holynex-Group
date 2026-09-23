import React, { useState } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { SmsCampaign } from '../../types';
import {
  Send,
  MessageSquare,
  Users,
  Clock,
  CheckCircle2,
  Phone,
  Sparkles,
  Smartphone,
  Radio,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const AdminMessagingTab: React.FC = () => {
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState<SmsCampaign[]>(() => Storage.getSmsCampaigns());

  const [title, setTitle] = useState('');
  const [targetGroup, setTargetGroup] = useState<SmsCampaign['targetGroup']>('all_customers');
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<SmsCampaign['channel']>('sms');
  const [isSending, setIsSending] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  const reloadData = () => {
    setCampaigns(Storage.getSmsCampaigns());
  };

  const templates = [
    {
      title: 'খাদ্য সামগ্রী শিডিউল নোটিশ',
      text: 'হোলিনেক্স গ্রুপ: প্রিয় কার্ডধারী, আপনার আগামী মাসের নায্যমূল্য খাদ্যপণ্য সংগ্রহের শিডিউল প্রস্তুত হয়েছে। কার্ড সাথে নিয়ে স্থানীয় পয়েন্টে যোগাযোগ করুন। হেল্পলাইন: 01307835260',
    },
    {
      title: 'ডিলার স্টক জরুরি নোটিশ',
      text: 'হোলিনেক্স গ্রুপ: সকল অনুমোদিত ডিলারদের দৃষ্টি আকর্ষণ করা যাচ্ছে যে আগামী ২৫ তারিখের মধ্যে পণ্যের মাসিক স্টক এবং চাহিদা রিপোর্ট জমা প্রদান নিশ্চিত করুন।',
    },
    {
      title: 'কিস্তি পরিশোধ রিমাইন্ডার',
      text: 'হোলিনেক্স গ্রুপ: আপনার চলতি মাসের পণ্যের কিস্তি পরিশোধের তারিখ সমাগত। প্রতিনিধির কাছে অথবা অফিসিয়াল বিকাশ মার্চেন্টে পরিশোধ করুন। ধন্যবাদ।',
    },
    {
      title: 'কার্ড এক্টিভেশন শুভেচ্ছা',
      text: 'হোলিনেক্স নায্যমূল্য কার্ডে আপনাকে স্বাগতম! আপনার কার্ডটি সফলভাবে সক্রিয় হয়েছে। সিন্ডিকেটমুক্ত পণ্য পেতে আপনার কার্ড নম্বর সংরক্ষণ করুন।',
    },
  ];

  const handleApplyTemplate = (tpl: typeof templates[0]) => {
    setTitle(tpl.title);
    setMessage(tpl.text);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      alert(t('ক্যাম্পেইন শিরোনাম ও মেসেজ বডি আবশ্যক।', 'Campaign title and message are required.'));
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      let recipientCount = 1450;
      if (targetGroup === 'all_dealers') recipientCount = 48;
      else if (targetGroup === 'all_reps') recipientCount = 120;
      else if (targetGroup === 'selected') recipientCount = 15;

      const newCampaign: SmsCampaign = {
        id: `camp-${Date.now()}`,
        title,
        targetGroup,
        message,
        recipientsCount: recipientCount,
        channel,
        status: 'sent',
        sentAt: new Date().toISOString(),
      };

      Storage.saveSmsCampaign(newCampaign);
      reloadData();
      setIsSending(false);
      setTitle('');
      setMessage('');
      setSuccessNotice(`মেসেজ সফলভাবে ${recipientCount} জন গ্রাহক/ডিলারের নিকট পাঠানো হয়েছে!`);
      setTimeout(() => setSuccessNotice(''), 5000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <MessageSquare className="w-4 h-4" />
          <span>এসএমএস ও নোটিফিকেশন গেটওয়ে</span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1">
          {t('গ্রাহক, প্রতিনিধি ও ডিলারদের সাথে কেন্দ্রীয় যোগাযোগ', 'Central Messaging & Bulk SMS Gateway')}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {t('অটোমেটেড ও কাস্টম এসএমএস নোটিফিকেশনের মাধ্যমে সরাসরি ফিল্ডপর্যায়ে যোগাযোগ নিশ্চিত করুন।', 'Send scheduled rations reminders, dealer notices, and installment alerts.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compose Form */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Send className="w-4 h-4 text-amber-400" />
            <span>নতুন মেসেজ / ব্রডকাস্ট ক্যাম্পেইন তৈরি করুন</span>
          </h3>

          {successNotice && (
            <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-bold">ক্যাম্পেইন শিরোনাম (Internal Reference)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: অক্টোবর মাসের খাদ্য শিডিউল নোটিশ"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">টার্গেট গ্রুপ (Target Audience)</label>
                <select
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value as SmsCampaign['targetGroup'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="all_customers">সকল কার্ডধারী গ্রাহক (All Customers)</option>
                  <option value="all_dealers">অনুমোদিত ডিলার নেটওয়ার্ক (All Dealers)</option>
                  <option value="all_reps">মাঠপর্যায়ের প্রতিনিধিরা (Representatives)</option>
                  <option value="selected">নির্দিষ্ট গ্রাহক তালিকা (Filtered)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">চ্যানেল (Channel)</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as SmsCampaign['channel'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                >
                  <option value="sms">SMS Gateway (Masking: HOLYNEX)</option>
                  <option value="push">App Push Notification</option>
                  <option value="in_app">In-App Notice Board</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-400 font-bold">মেসেজ বডি (বাংলা/English)</label>
                <span className="text-[11px] font-mono text-slate-500">{message.length} অক্ষর ({Math.ceil(message.length / 70) || 1} SMS)</span>
              </div>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="মেসেজ টাইপ করুন..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white leading-relaxed font-sans"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs hover:brightness-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>{isSending ? 'মেসেজ পাঠানো হচ্ছে...' : 'এখনই ব্রডকাস্ট পাঠান (Send Now)'}</span>
            </button>
          </form>
        </div>

        {/* Quick Templates */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>প্রস্তুতকৃত মেসেজ টেমপ্লেট</span>
            </h3>
            <div className="space-y-2">
              {templates.map((tpl, i) => (
                <div
                  key={i}
                  onClick={() => handleApplyTemplate(tpl)}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all space-y-1"
                >
                  <span className="text-xs font-bold text-white block">{tpl.title}</span>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{tpl.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Logs */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl backdrop-blur">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">পূর্ববর্তী ক্যাম্পেইন হিস্ট্রি</h3>
          <span className="text-xs text-slate-400 font-mono">মোট {campaigns.length} টি প্রেরিত</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">ক্যাম্পেইন নাম</th>
                <th className="px-4 py-3">টার্গেট গ্রুপ</th>
                <th className="px-4 py-3">মেসেজ সারসংক্ষেপ</th>
                <th className="px-4 py-3">প্রাপক সংখ্যা</th>
                <th className="px-4 py-3">সময়</th>
                <th className="px-4 py-3">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3 font-bold text-white">{camp.title}</td>
                  <td className="px-4 py-3 uppercase text-[11px] text-amber-400 font-mono">{camp.targetGroup}</td>
                  <td className="px-4 py-3 text-slate-300 max-w-xs truncate">{camp.message}</td>
                  <td className="px-4 py-3 font-mono text-emerald-400 font-bold">{camp.recipientsCount} জন</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-400">
                    {new Date(camp.sentAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {camp.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
