import React from 'react';
import { useLanguage } from '../../lib/languageContext';
import {
  ShieldCheck,
  Building2,
  Users,
  Target,
  Award,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';

interface AboutViewProps {
  navigate: (path: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ navigate }) => {
  const { t } = useLanguage();

  return (
    <div className="py-14 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              {t('আমাদের কোম্পানি পরিচিতি', 'Corporate Profile')}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
              {t(
                'হোলিনেক্স গ্রুপ — দেশের অর্থনীতিতে ইতিবাচক পরিবর্তনের বিশ্বস্ত সহযোগী',
                'Holynex Group — Driving Economic Empowerment Across Bangladesh'
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {t(
                'হোলিনেক্স গ্রুপ দেশের মধ্যবিত্ত ও সাধারণ আয়ের মানুষের দৈনন্দিন জীবনযাত্রার মানোন্নয়নে প্রতিশ্রুতিবদ্ধ একটি নেতৃস্থানীয় ব্যবসা প্রতিষ্ঠান। আমরা বিশ্বাস করি, পরিবারের প্রয়োজনীয় ইলেকট্রনিক্স, হোম অ্যাপ্লায়েন্স ও আসবাবপত্র ক্রয়ের ক্ষেত্রে কৃত্রিম সিন্ডিকেট ও মধ্যস্বত্বভোগীদের দৌরাত্ম্য বন্ধ করে ন্যায্য মূল্যে ও সহজ কিস্তিতে মানুষের দোরগোড়ায় সেবা পৌঁছে দেওয়া সম্ভব।',
                'Holynex Group stands at the forefront of ethical consumer commerce in Bangladesh. We believe that access to household essentials, consumer electronics, and appliances should not be constrained by inflated retail syndicates or aggressive compounding interest.'
              )}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/dealer-application')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-md hover:brightness-105 transition-all flex items-center gap-2"
              >
                <span>{t('ডিলারশিপের জন্য আবেদন করুন', 'Apply for Authorized Dealership')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/products')}
                className="px-6 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-sm hover:bg-slate-50 transition-all"
              >
                {t('পণ্য তালিকা দেখুন', 'Explore Products')}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
                alt="Holynex Corporate Tower"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-950">
              {t('আমাদের মিশন (Our Mission)', 'Our Mission')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t(
                'বাংলাদেশের প্রতিটি পরিবারকে ন্যায্য ও পাইকারি মূল্যে জেনুইন ব্র্যান্ডের পণ্য সরবরাহ করা। ফেয়ার প্রাইস কার্ডের মাধ্যমে স্বচ্ছ ও সুদবিহীন কিস্তি সেবা দিয়ে প্রতিটি পরিবারের ঘরে আধুনিক জীবনযাত্রার সুযোগ সৃষ্টি করা।',
                'To empower every family across Bangladesh with direct-to-consumer wholesale pricing and hassle-free, ethical installment plans that elevate quality of living.'
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-950">
              {t('আমাদের ভিশন (Our Vision)', 'Our Vision')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t(
                'দেশের প্রতিটি থানা ও উপজেলায় অন্তত একটি করে প্রযুক্তি-নিয়ন্ত্রিত হোলিনেক্স অনুমোদিত ডিলারশিপ আউটলেট গড়ে তোলা এবং দেশের সর্ববৃহৎ ন্যায্যমূল্যের কেনাকাটার ইকোসিস্টেম তৈরি করা।',
                'To establish an authorized, digitally integrated Holynex dealer point in every upazila, building the largest transparent consumer network in the nation.'
              )}
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              {t('আমাদের মূল স্তম্ভ ও অঙ্গীকার', 'Core Values & Principles')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('যেসব নীতির উপর ভিত্তি করে হোলিনেক্স গ্রুপ পরিচালিত হয়', 'The guiding values underlying every Holynex Group endeavor')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
              <h4 className="font-bold text-slate-900 text-sm">{t('শতভাগ স্বচ্ছতা', 'Total Transparency')}</h4>
              <p className="text-xs text-slate-600">
                {t('কোনো লুকানো সুদ, গোপন সার্ভিস চার্জ বা অতিরিক্ত ফি নেই। প্রতিটি লেনদেনে পাকা রসিদ।', 'No hidden penalties, compounded interest, or surprise handling fees.')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-slate-900 text-sm">{t('জেনুইন পণ্যের নিশ্চয়তা', '100% Genuine Warranty')}</h4>
              <p className="text-xs text-slate-600">
                {t('অফিসিয়াল ব্র্যান্ড পার্টনারদের সরাসরি আমদানিকৃত পণ্য ও অনুমোদিত সার্ভিস ওয়ারেন্টি।', 'Direct manufacturer sourcing with verified replacement and parts warranty.')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-slate-900 text-sm">{t('উন্নত ডিলার পার্টনারশিপ', 'Dealer Empowerment')}</h4>
              <p className="text-xs text-slate-600">
                {t('স্থানীয় উদ্যোক্তাদের টেকসই মুনাফা, প্রশিক্ষণ ও সফটওয়্যার সুবিধা প্রদান।', 'Equipping local entrepreneurs with rewarding commissions and state-of-the-art software.')}
              </p>
            </div>
          </div>
        </div>

        {/* Corporate Address Bar */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              {t('প্রধান কার্যালয়', 'Corporate Head Office')}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              {t('৭১২, কমিশনার রোড, জুরাইন, ঢাকা', '712, Commissioner Road, Jurain, Dhaka')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {t('যাত্রাবাড়ী, শ্যামপুর এলাকা সংলগ্ন • সরাসরি যোগাযোগের হটলাইন: 01307835260', 'Adjacent to Jatrabari/Shyampur • Corporate Helpline: 01307835260')}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <a
              href="tel:01307835260"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>01307835260</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
