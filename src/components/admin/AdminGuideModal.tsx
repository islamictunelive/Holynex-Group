import React from 'react';
import {
  HelpCircle,
  X,
  ShieldCheck,
  CheckCircle2,
  Users,
  CreditCard,
  Image,
  Bell,
  KeyRound,
  FileText,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../lib/languageContext';

interface AdminGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickLogin?: (role: 'admin' | 'subadmin') => void;
}

export const AdminGuideModal: React.FC<AdminGuideModalProps> = ({
  isOpen,
  onClose,
  onQuickLogin,
}) => {
  const { lang, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-950 border border-amber-500/40 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 px-6 py-4 text-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-950/20 border border-slate-950/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">
                {t('হোলিনেক্স অ্যাডমিন পোর্টাল পূর্ণ ব্যবহার নির্দেশিকা', 'Holynex Admin Portal Complete User Guide')}
              </h3>
              <p className="text-xs text-slate-900/80 font-medium">
                {t('অ্যাডমিন ও সাব-এডমিন প্যানেলের যাবতীয় ফিচার পরিচালনার সহজ নিয়মাবলী', 'Step-by-step instructions for managing operations & applications')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-950/10 hover:bg-slate-950/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-950" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Quick Credential Box */}
          <div className="bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-3">
              <KeyRound className="w-4 h-4" />
              <span>{t('১. লগইন করার নিয়ম ও প্রস্তুতকৃত ইউজারনেম/পাসওয়ার্ড', '1. Login Credentials & Fast Access')}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/70 border border-amber-500/20 p-3 rounded-xl">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-amber-300">প্রধান অ্যাডমিন (Super Admin):</span>
                  {onQuickLogin && (
                    <button
                      onClick={() => {
                        onQuickLogin('admin');
                        onClose();
                      }}
                      className="px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[10px] transition-all"
                    >
                      লগইন করুন
                    </button>
                  )}
                </div>
                <div className="text-slate-300 space-y-0.5 font-mono">
                  <div>ইউজারনেম: <span className="text-white font-bold">admin</span></div>
                  <div>পাসওয়ার্ড: <span className="text-amber-400 font-bold">holynex@admin2026</span></div>
                  <div className="text-[11px] text-slate-400 font-sans mt-1">
                    ক্ষমতা: ডিলার আবেদন, পণ্য, কিস্তি, ব্যানার, নোটিশ এবং নতুন সাব-এডমিন তৈরির সব অধিকার।
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-blue-500/20 p-3 rounded-xl">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-blue-300">সহকারী অ্যাডমিন (Sub-Admin):</span>
                  {onQuickLogin && (
                    <button
                      onClick={() => {
                        onQuickLogin('subadmin');
                        onClose();
                      }}
                      className="px-2 py-0.5 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold rounded text-[10px] transition-all"
                    >
                      লগইন করুন
                    </button>
                  )}
                </div>
                <div className="text-slate-300 space-y-0.5 font-mono">
                  <div>ইউজারনেম: <span className="text-white font-bold">subadmin</span></div>
                  <div>পাসওয়ার্ড: <span className="text-blue-400 font-bold">subadmin@2026</span></div>
                  <div className="text-[11px] text-slate-400 font-sans mt-1">
                    ক্ষমতা: আবেদন যাচাই, স্ট্যাটাস অনুমোদন, পণ্য ও কিস্তি রেট সম্পাদন, ব্যানার ও নোটিশ আপডেট।
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Module 2: Applications */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <FileText className="w-4 h-4" />
              <span>{t('২. ডিলার আবেদনপত্র যাচাই ও অনুমোদন করার নিয়ম', '2. Verifying & Approving Applications')}</span>
            </div>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed pl-1">
              <li>
                <strong className="text-white">আবেদন তালিকা:</strong> বাম পাশের মেনু থেকে <span className="text-amber-400">"আবেদনপত্রসমূহ (Applications)"</span> ট্যাবে যান।
              </li>
              <li>
                <strong className="text-white">বিস্তারিত তথ্য দেখা:</strong> যেকোনো আবেদনকারীর নামের পাশে থাকা <span className="text-amber-300">"বিস্তারিত ও পর্যালোচনা"</span> বাটনে চাপলে তার পূর্ণ আবেদনপত্র (জাতীয় পরিচয়পত্র, ট্রেড লাইসেন্স, বিনিয়োগের পরিমাণ, ঠিকানা ও গ্যারান্টার তথ্য) দেখা যাবে।
              </li>
              <li>
                <strong className="text-white">স্ট্যাটাস পরিবর্তন:</strong> ড্রপডাউন থেকে <span className="text-emerald-400">Approved (অনুমোদিত)</span>, <span className="text-amber-400">Under Review (যাচাই চলছে)</span>, অথবা <span className="text-red-400">Rejected (বাতিল)</span> নির্বাচন করুন।
              </li>
              <li>
                <strong className="text-white">পাবলিক ট্র্যাকিং নোটিশ:</strong> <span className="text-white">"আবেদনকারীকে দেখানোর মেসেজ"</span> ঘরে মেসেজ লিখে সেভ করুন। আবেদনকারী তার মোবাইল নম্বর ও ট্র্যাকিং আইডি দিয়ে হোমপেজের "আবেদন স্ট্যাটাস" পেজে এই মেসেজটি দেখতে পাবেন।
              </li>
              <li>
                <strong className="text-white">এসএমএস অ্যালার্ট:</strong> "আবেদনকারীকে নিশ্চিতকরণ এসএমএস পাঠান" চেকবক্স চালু রেখে আপডেট দিলে স্বয়ংক্রিয়ভাবে এসএমএস বার্তা প্রেরণ রেকর্ড হবে।
              </li>
            </ul>
          </div>

          {/* Module 3: Products */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <CreditCard className="w-4 h-4" />
              <span>{t('৩. পণ্য ও কিস্তির হিসাব পরিবর্তন (Products & EMI)', '3. Product & Installment Management')}</span>
            </div>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed pl-1">
              <li>
                <span className="text-amber-400">"পণ্য ও কিস্তি"</span> ট্যাবে গেলে সব পণ্যের নাম, ক্যাটাগরি, বাজার মূল্য এবং কিস্তির বিবরণ দেখতে পাবেন।
              </li>
              <li>
                <strong className="text-white">এডিট অপশন:</strong> যেকোনো পণ্যের পাশে থাকা কলম (Edit) আইকনে চাপুন।
              </li>
              <li>
                <strong className="text-white">স্বয়ংক্রিয় কিস্তি ক্যালকুলেটর:</strong> আপনি পণ্যের <span className="text-white">মূল্য</span>, <span className="text-white">ডাউনপেমেন্ট</span> ও <span className="text-white">কিস্তির মাস</span> (যেমন: ৬, ১২, ১৮ বা ২৪ মাস) বসানো মাত্রই মাসিক কিস্তির অংক নিজে নিজেই হিসাব হয়ে যায়।
              </li>
              <li>
                <strong className="text-white">নতুন পণ্য যুক্ত:</strong> "নতুন পণ্য যোগ করুন" বাটনে ক্লিক করে যেকোনো নতুন মডেল বা হোম অ্যাপ্লায়েন্স ওয়েবসাইটে যুক্ত করতে পারেন।
              </li>
            </ul>
          </div>

          {/* Module 4: Banners & News */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Image className="w-4 h-4" />
              <span>{t('৪. হোমপেজ স্লাইডার ব্যানার ও স্ক্রলিং নোটিশ (Banners & Notices)', '4. Sliders & Scrolling Notice Management')}</span>
            </div>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed pl-1">
              <li>
                <span className="text-amber-400">"স্লাইডার ব্যানার"</span> ট্যাবে গিয়ে নতুন ব্যানার ইমেজ ইউআরএল, টাইটেল ও সাবটাইটেল পরিবর্তন করতে পারেন।
              </li>
              <li>
                <span className="text-amber-400">"সংবাদ ও নোটিশ"</span> ট্যাবে গিয়ে নতুন কোনো অফার বা জরুরি সতর্কবার্তা লিখলে তা সাথে সাথে ওয়েবসাইটের লাল নোটিশ বারে স্ক্রল করতে শুরু করবে।
              </li>
            </ul>
          </div>

          {/* Module 5: Settings & Admins */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Sliders className="w-4 h-4" />
              <span>{t('৫. অফিস সেটিংস ও সাব-এডমিন ব্যবস্থাপনা (Settings & Staff)', '5. Settings & Sub-Admin Accounts')}</span>
            </div>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed pl-1">
              <li>
                <span className="text-amber-400">"সেটিংস"</span> ট্যাবে প্রধান কার্যালয়ের ঠিকানা, ইমেইল ও হটলাইন ফোন নম্বর পরিবর্তন করা যায়।
              </li>
              <li>
                প্রধান অ্যাডমিন নতুন সহকারী অ্যাডমিনদের নাম, ইউজারনেম ও পাসওয়ার্ড তৈরি করে দিতে পারেন, যা দিয়ে তারা নিজস্ব দায়িত্ব পরিচালনা করতে পারবেন।
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900 px-6 py-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {t('হোলিনেক্স ডিজিটাল সেন্ট্রাল অ্যাডমিন সিস্টেম v3.5', 'Holynex Central Admin System v3.5')}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            {t('নির্দেশিকা বুঝেছি, বন্ধ করুন', 'I Understand, Close Guide')}
          </button>
        </div>
      </div>
    </div>
  );
};
