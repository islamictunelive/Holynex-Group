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
    <div id="about" className="py-14 bg-slate-50 min-h-screen scroll-mt-24">
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
        <div id="mission" className="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-mt-24">
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

        {/* Executive Leadership: Chairman & CEO */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              {t('শীর্ষ পরিচালনা পর্ষদ', 'Executive Leadership')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              {t('চেয়ারম্যান ও ব্যবস্থাপনা পরিচালকের বার্তা', 'Messages from Chairman & CEO')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('একটি সমৃদ্ধ ও স্বনির্ভর বাংলাদেশ গড়ার দূরদর্শী নেতৃত্ব', 'Visionary leadership dedicated to national economic development')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chairman Profile */}
            <div id="chairman" className="bg-white rounded-3xl p-8 shadow-md border border-slate-200/90 space-y-6 scroll-mt-24 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-400 shrink-0 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                      alt="Chairman Holynex Group"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      {t('চেয়ারম্যান মহোদয়ের বাণী', "Chairman's Address")}
                    </span>
                    <h3 className="text-lg font-bold text-slate-950 mt-1">
                      {t('মরহুম আব্দুল খালেক মোল্লা (প্রতিষ্ঠাতা চেয়ারম্যান)', 'Founding Chairman, Holynex Group')}
                    </h3>
                    <p className="text-xs text-slate-500">{t('হোলিনেক্স গ্রুপ বাংলাদেশ', 'Holynex Group Bangladesh')}</p>
                  </div>
                </div>

                <blockquote className="text-xs sm:text-sm text-slate-600 leading-relaxed italic border-l-2 border-amber-500 pl-4">
                  "{t(
                    'ব্যবসার মূল ভিত্তি হচ্ছে বিশ্বস্ততা ও মানুষের সেবা। মধ্যবিত্ত ও শ্রমজীবী মানুষ যাতে কোনো প্রকার শোষণ ছাড়াই সম্মানজনকভাবে প্রয়োজনীয় আসবাব ও খাদ্য সামগ্রী সংগ্রহ করতে পারে—সে উদ্দেশ্যেই হোলিনেক্স গ্রুপের যাত্রা। আমরা প্রতিটি নাগরিকের মুখে হাসি ফোটাতে অঙ্গীকারবদ্ধ।',
                    'The cornerstone of true enterprise is uncompromised trust and genuine service to the people. Holynex Group was established so that every family can access quality provisions and household essentials without extortion.'
                  )}"
                </blockquote>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{t('দায়িত্বশীল করপোরেট সংস্কৃতি', 'Ethical Corporate Leadership')}</span>
                <ShieldCheck className="w-4 h-4 text-amber-500" />
              </div>
            </div>

            {/* CEO Profile */}
            <div id="ceo" className="bg-white rounded-3xl p-8 shadow-md border border-slate-200/90 space-y-6 scroll-mt-24 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-400 shrink-0 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
                      alt="CEO & Managing Director"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      {t('প্রধান নির্বাহী ও ব্যবস্থাপনা পরিচালক', 'CEO & Managing Director')}
                    </span>
                    <h3 className="text-lg font-bold text-slate-950 mt-1">
                      {t('ইঞ্জি. মো: কামরুল হাসান', 'Engr. Md. Kamrul Hasan')}
                    </h3>
                    <p className="text-xs text-slate-500">{t('ব্যবস্থাপনা পরিচালক, হোলিনেক্স গ্রুপ', 'Managing Director & CEO')}</p>
                  </div>
                </div>

                <blockquote className="text-xs sm:text-sm text-slate-600 leading-relaxed italic border-l-2 border-blue-500 pl-4">
                  "{t(
                    'প্রযুক্তি ও ডিজিটাল সাপ্লাই চেইনকে কাজে লাগিয়ে আমরা দেশের প্রতিটি ইউনিয়নে ডিলার নেটওয়ার্ক পৌঁছে দিচ্ছি। ফেয়ার প্রাইস কার্ড ও স্বচ্ছ কিস্তির সংমিশ্রণে আমরা আধুনিক গ্রাহকসেবাকে নতুন উচ্চতায় নিয়ে যাচ্ছি। আমাদের সাথে যুক্ত হওয়ার জন্য সকল ডিলার ও গ্রাহকদের আন্তরিক আমন্ত্রণ।',
                    'Leveraging modern cloud logistics and digital distribution, we are expanding our transparent authorized dealer points across the nation. We welcome consumers and visionary entrepreneurs to join our growing network.'
                  )}"
                </blockquote>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{t('ডিজিটাল সাপ্লাই চেইন সম্প্রসারণ', 'Digital Supply Chain Vision')}</span>
                <Award className="w-4 h-4 text-blue-500" />
              </div>
            </div>
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

        {/* Corporate Address & Official Contacts */}
        <div id="contact" className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 scroll-mt-24 border border-slate-800">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              {t('প্রধান কার্যালয় ও অফিসিয়াল যোগাযোগ', 'Corporate Head Office & Official Contacts')}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              {t('৭১২, কমিশনার রোড, জুরাইন, ঢাকা', '712, Commissioner Road, Jurain, Dhaka')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {t('যাত্রাবাড়ী, শ্যামপুর এলাকা সংলগ্ন • অফিস সময়: শনি - বৃহস্পতি (সকাল ৯:০০ - সন্ধ্যা ৭:০০)', 'Adjacent to Jatrabari/Shyampur • Office Hours: Sat - Thu (9:00 AM - 7:00 PM)')}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/holynexgroup"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 underline underline-offset-4"
              >
                Facebook: facebook.com/holynexgroup
              </a>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <a
                href="https://www.youtube.com/@holynexgroup1"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 underline underline-offset-4"
              >
                YouTube: @holynexgroup1
              </a>
            </div>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-3">
            <a
              href="tel:01307835260"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition-all flex items-center gap-2 shadow-md shadow-amber-500/20"
            >
              <Phone className="w-4 h-4" />
              <span>01307835260</span>
            </a>
            <a
              href="https://wa.me/8801307835260"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span>WhatsApp</span>
            </a>
            <a
              href="https://holynex-group-bay.vercel.app/#/dealer-application"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-sm transition-all flex items-center gap-2"
            >
              <span>{t('ডিলার আবেদন', 'Dealer Apply')}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
