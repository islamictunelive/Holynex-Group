import React from 'react';
import { useLanguage } from '../../lib/languageContext';
import {
  CreditCard,
  Percent,
  ShieldCheck,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

interface CustomerBenefitsViewProps {
  navigate: (path: string) => void;
}

export const CustomerBenefitsView: React.FC<CustomerBenefitsViewProps> = ({ navigate }) => {
  const { t } = useLanguage();

  const comparison = [
    {
      featureBn: 'পণ্যমূল্য নির্ধারণ',
      featureEn: 'Product Pricing',
      traditionalBn: 'খুচরা বিক্রেতাদের উচ্চ মুনাফা ও সিন্ডিকেটের কৃত্রিম দাম',
      traditionalEn: 'Inflated markups with unpredictable retail hoarding',
      holynexBn: 'সরাসরি প্রস্তুতকারক ও আমদানি পর্যায়ের পাইকারি ফেয়ার প্রাইস',
      holynexEn: 'Direct company wholesale regulated fair pricing',
    },
    {
      featureBn: 'কিস্তির সুদ ও শর্ত',
      featureEn: 'Installment Terms',
      traditionalBn: 'চক্রবৃদ্ধি অতিরিক্ত গোপন সুদ ও লুকানো সার্ভিস চার্জ',
      traditionalEn: 'Hidden processing surcharges and compounded interest',
      holynexBn: 'সম্পূর্ণ শূন্য শতাংশ অতিরিক্ত লুকানো ফি, সমান সহজ মাসিক কিস্তি',
      holynexEn: 'Zero hidden fees with predictable equal monthly installments',
    },
    {
      featureBn: 'ডাউন পেমেন্টের পরিমাণ',
      featureEn: 'Down Payment Requirement',
      traditionalBn: '৫০% থেকে ৬০% পর্যন্ত মোটা অঙ্কের ডাউন পেমেন্ট দাবি',
      traditionalEn: 'Demands 50% to 60% cash upfront before delivery',
      holynexBn: 'মাত্র ২০% থেকে ৩০% ডাউন পেমেন্ট দিয়ে তাৎক্ষণিক পণ্য ডেলিভারি',
      holynexEn: 'Deliveries fulfilled with just 20% to 30% initial deposit',
    },
    {
      featureBn: 'ওয়ারেন্টি নিশ্চয়তা',
      featureEn: 'Warranty & Parts Assurance',
      traditionalBn: 'বিক্রয় পরবর্তী সেবায় গড়িমসি ও সার্ভিস সেন্টারের জটিলতা',
      traditionalEn: 'Fragmented after-sales support with delayed servicing',
      holynexBn: 'শতভাগ অফিসিয়াল ব্র্যান্ড ওয়ারেন্টি ও স্থানীয় ডিলারের মাধ্যমে সার্ভিস',
      holynexEn: 'Direct manufacturer warranty coordinated via local dealers',
    },
    {
      featureBn: 'হিসাবের স্বচ্ছতা',
      featureEn: 'Accounting Transparency',
      traditionalBn: 'হাতে লেখা কাঁচা রসিদ, পরে ভুল বোঝাবুঝি বা অমিল',
      traditionalEn: 'Unverified manual paper slips prone to disputes',
      holynexBn: 'তাৎক্ষণিক এসএমএস নিশ্চিতকরণ ও কেন্দ্রীয় ডিজিটাল লেজার ডাটাবেজ',
      holynexEn: 'Instant automated carrier SMS confirmation and cloud ledgers',
    },
  ];

  return (
    <div className="py-14 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Page Header (Notice title is Customer Benefits) */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t('গ্রাহক সুবিধা ও নিশ্চয়তা', 'Consumer Safeguards')}
          </div>
          {/* Specifically titled Customer Benefits */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
            {t('কাস্টমার বেনিফিটস (Customer Benefits)', 'Holynex Customer Benefits')}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {t(
              'হোলিনেক্স গ্রুপের প্রতিটি সেবা পরিচালিত হয় ক্রেতার সর্বোচ্চ সুবিধা ও অর্থনৈতিক স্বাচ্ছন্দ্যকে কেন্দ্র করে। জেনে নিন কেন আমাদের ফেয়ার প্রাইস কার্ড ও কিস্তি সিস্টেম দেশের সাধারণ মানুষের সবচেয়ে পছন্দের মাধ্যম।',
              'Every service at Holynex Group is engineered around consumer empowerment and financial ease. Discover how our Fair Price Card delivers unmatched value.'
            )}
          </p>
        </div>

        {/* The 6 Fundamental Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {t('১. ফেয়ার প্রাইস কার্ড মেম্বারশিপ', '1. Fair Price Card Membership')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t(
                'বাজারের অসাধু মূল্যবৃদ্ধির বিপরীতে আমাদের কার্ডধারীরা পান সরাসরি পাইকারি মূল্যে পণ্য ক্রয়ের সুযোগ। একটি কার্ডেই পরিবারের সকল পণ্যের আজীবন সুবিধা।',
                'Shield your household budget with guaranteed wholesale corporate pricing tiers on all registered product categories.'
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {t('২. ৬ থেকে ২৪ মাসের সমান কিস্তি', '2. Flexible 6-24 Months Terms')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t(
                'আপনার মাসিক আয়ের সাথে সমন্বয় করে কিস্তির সময়সীমা নির্ধারণের স্বাধীনতা। কোনো প্রকার চক্রবৃদ্ধি সুদ বা অস্বাভাবিক পেনাল্টি আরোপ করা হয় না।',
                'Choose a repayment tenure tailored to your monthly cashflow with zero compounding interest penalties.'
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
              <Percent className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {t('৩. মাত্র ২০% ডাউন পেমেন্ট', '3. Minimal 20% Initial Deposit')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t(
                'এককালীন বড় খরচের চাপ নেই। স্বল্প ডাউন পেমেন্ট জমা দিয়েই নিজের ঘরে এনে নিন পছন্দের রেফ্রিজারেটর, টেলিভিশন বা মোটরসাইকেল।',
                'Procure the appliances and vehicles your home requires immediately without liquidating emergency family savings.'
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {t('৪. শতভাগ আসল ব্র্যান্ড ওয়ারেন্টি', '4. 100% Genuine Brand Warranty')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t(
                'আমাদের প্রতিটি পণ্য অফিসিয়াল ডিস্ট্রিবিউটর বা প্রস্তুতকারকের সিলযুক্ত এবং নির্দিষ্ট মেয়াদের ফ্রি সার্ভিস ও পার্টস ওয়ারেন্টি সহ সরবরাহ করা হয়।',
                'Every product is packaged with verified manufacturer seals, providing authentic parts replacement and warranty support.'
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {t('৫. তাৎক্ষণিক এসএমএস অ্যালার্ট', '5. Automated SMS Confirmation')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t(
                'প্রতিটি কিস্তি জমা দেওয়ার সাথে সাথে গ্রাহকের রেজিস্টার্ড মোবাইল নম্বরে নিশ্চিতকরণ এসএমএস এবং ডিজিটাল রসিদ পাঠানো হয়।',
                'Complete peace of mind through instantaneous carrier SMS notices after each payment transaction.'
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {t('৬. স্থানীয় ডিলারের সার্বক্ষণিক সেবা', '6. Localized Dealer Support')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t(
                'যেকোনো তথ্য, পণ্য পরিবর্তন বা ওয়ারেন্টির জন্য গ্রাহককে দূরে যেতে হয় না। নিজ এলাকার অনুমোদিত ডিলার পয়েন্টেই মেলে সমাধান।',
                'Fast turnaround on technical requests and installment inquiries supported by authorized territory dealers.'
              )}
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              {t('সাধারণ বাজার বনাম হোলিনেক্স গ্রুপ তুলনা', 'Traditional Market vs. Holynex Group')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('এক নজরে দেখুন আমাদের স্বচ্ছতার সুস্পষ্ট পার্থক্য', 'A side-by-side comparison of ethical terms and consumer protection')}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="p-4 font-bold text-slate-900">{t('বৈশিষ্ট্য / সেবার ধরণ', 'Key Consideration')}</th>
                  <th className="p-4 font-bold text-red-600">{t('প্রচলিত বাজার ব্যবস্থা', 'Traditional Market Retailers')}</th>
                  <th className="p-4 font-extrabold text-emerald-700 bg-emerald-50/70 border-x border-emerald-200">
                    {t('হোলিনেক্স গ্রুপ ফেয়ার প্রাইস সিস্টেম', 'Holynex Group Fair Price System')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparison.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      {t(row.featureBn, row.featureEn)}
                    </td>
                    <td className="p-4 text-slate-600 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{t(row.traditionalBn, row.traditionalEn)}</span>
                    </td>
                    <td className="p-4 text-slate-900 font-semibold bg-emerald-50/40 border-x border-emerald-200">
                      <div className="flex items-start gap-2 text-emerald-950">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{t(row.holynexBn, row.holynexEn)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Get Fair Price Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              {t('সহজ নিবন্ধন পদ্ধতি', 'Registration Guide')}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t('কীভাবে ফেয়ার প্রাইস কার্ড সংগ্রহ করবেন?', 'How to Obtain Your Fair Price Card')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {t(
                'মাত্র কয়েকটি সহজ ধাপে আপনি ও আপনার পরিবার হতে পারেন হোলিনেক্স ফেয়ার প্রাইস কার্ডের সম্মানিত সদস্য।',
                'Enroll in a few quick steps through your local authorized territory dealer.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                ১
              </span>
              <h4 className="font-bold text-white text-sm">{t('এনআইডি ও ছবি জমা', '1. Provide NID & Photo')}</h4>
              <p className="text-xs text-slate-400">
                {t('আপনার জাতীয় পরিচয়পত্রের কপি ও এক কপি পাসপোর্ট সাইজ ছবি প্রস্তুত রাখুন।', 'Present a copy of your National ID and one passport photograph.')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-full bg-blue-500 text-white font-black text-xs flex items-center justify-center">
                ২
              </span>
              <h4 className="font-bold text-white text-sm">{t('নিকটস্থ ডিলারে নিবন্ধন', '2. Register via Dealer')}</h4>
              <p className="text-xs text-slate-400">
                {t('আপনার নিজ থানার হোলিনেক্স অনুমোদিত ডিলার পয়েন্টে ফরম পূরণ করুন।', 'Complete the physical or digital intake form at your local dealer point.')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                ৩
              </span>
              <h4 className="font-bold text-white text-sm">{t('কার্ড গ্রহণ ও পণ্য ক্রয়', '3. Card Activation & Order')}</h4>
              <p className="text-xs text-slate-400">
                {t('তাৎক্ষণিক অ্যাক্টিভেশন এসএমএস পেয়ে যেকোনো পণ্য পাইকারি ও কিস্তিতে কিনুন।', 'Receive instant activation SMS to purchase appliances on installment.')}
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm hover:brightness-105 transition-all flex items-center gap-2"
            >
              <span>{t('পণ্য ক্যাটালগ দেখুন', 'View Products Catalog')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/dealer-application')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all"
            >
              {t('ডিলারশিপ হতে আগ্রহী?', 'Interested in Dealership?')}
            </button>
            <a
              href="https://wa.me/8801307835260"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span>WhatsApp: 01307835260</span>
            </a>
            <a
              href="tel:01307835260"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-sm border border-amber-500/30 transition-all flex items-center gap-2"
            >
              <span>হটলাইন: 01307835260</span>
            </a>
          </div>
        </div>

        {/* Official Social & Support Bar */}
        <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-slate-900">{t('অফিসিয়াল মাধ্যম:', 'Official Channels:')}</span>
            <span>{t('৭১২, কমিশনার রোড, জুরাইন, ঢাকা', '712 Commissioner Rd, Jurain, Dhaka')}</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/holynexgroup"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline font-semibold"
            >
              Facebook: /holynexgroup
            </a>
            <span>•</span>
            <a
              href="https://www.youtube.com/@holynexgroup1"
              target="_blank"
              rel="noreferrer"
              className="text-red-600 hover:underline font-semibold"
            >
              YouTube: @holynexgroup1
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
