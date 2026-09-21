import React, { useState } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { FairPriceCardRecord, ProductScheduleItem } from '../../types';
import {
  CreditCard,
  ShieldCheck,
  Calendar,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Search,
  Store,
  PhoneCall,
  ArrowRight,
  Package,
  AlertCircle,
  TrendingDown,
  UserCheck,
} from 'lucide-react';

interface FairPriceCardViewProps {
  navigate: (path: string) => void;
}

export const FairPriceCardView: React.FC<FairPriceCardViewProps> = ({ navigate }) => {
  const { lang, t } = useLanguage();

  // Search/Tracker state for Card Holders
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedCard, setSearchedCard] = useState<FairPriceCardRecord | null>(null);
  const [cardSchedules, setCardSchedules] = useState<ProductScheduleItem[]>([]);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const stapleItems = [
    {
      nameBn: 'প্রিমিয়াম মিনিকেট চাল',
      nameEn: 'Premium Miniket Rice',
      allocationBn: 'মাসিক ১০ - ২৫ কেজি',
      allocationEn: 'Monthly 10 - 25 KG',
      fairRate: '৳ ৭০/কেজি',
      marketRate: '৳ ৮৮/কেজি',
      savings: '২১% সাশ্রয়',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    },
    {
      nameBn: 'বিশুদ্ধ ফর্টিফাইড সয়াবিন তেল',
      nameEn: 'Pure Fortified Soybean Oil',
      allocationBn: 'মাসিক ২ - ৫ লিটার',
      allocationEn: 'Monthly 2 - 5 Liters',
      fairRate: '৳ ১৭০/লিটার',
      marketRate: '৳ ১৯৫/লিটার',
      savings: '১৩% সাশ্রয়',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    },
    {
      nameBn: 'বাছাইকৃত দেশি মসুর ডাল',
      nameEn: 'Selected Deshi Red Lentils',
      allocationBn: 'মাসিক ২ - ৫ কেজি',
      allocationEn: 'Monthly 2 - 5 KG',
      fairRate: '৳ ১৩০/কেজি',
      marketRate: '৳ ১৫০/কেজি',
      savings: '১৪% সাশ্রয়',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    },
    {
      nameBn: 'পুষ্টিকর প্যাকেট আটা',
      nameEn: 'Nutritious Whole Wheat Atta',
      allocationBn: 'মাসিক ৫ - ১০ কেজি',
      allocationEn: 'Monthly 5 - 10 KG',
      fairRate: '৳ ৬২/কেজি',
      marketRate: '৳ ৭৫/কেজি',
      savings: '১৭% সাশ্রয়',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    },
    {
      nameBn: 'রিফাইন খাঁটি চিনি',
      nameEn: 'Refined Pure Sugar',
      allocationBn: 'মাসিক ২ - ৫ কেজি',
      allocationEn: 'Monthly 2 - 5 KG',
      fairRate: '৳ ১২৫/কেজি',
      marketRate: '৳ ১৪৫/কেজি',
      savings: '১৪% সাশ্রয়',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    },
    {
      nameBn: 'সুগন্ধি চিনিগুঁড়া পোলাও চাউল',
      nameEn: 'Aromatic Chinigura Polao Rice',
      allocationBn: 'মাসিক ২ - ৫ কেজি (ঐচ্ছিক)',
      allocationEn: 'Monthly 2 - 5 KG (Optional)',
      fairRate: '৳ ১৫০/কেজি',
      marketRate: '৳ ১৮০/কেজি',
      savings: '১৭% সাশ্রয়',
      image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleSearchCard = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setHasSearched(true);
    const q = searchQuery.trim().toUpperCase();

    if (!q) {
      setSearchError(t('অনুগ্রহ করে কার্ড নম্বর বা মোবাইল নম্বর দিন।', 'Please enter card number or mobile.'));
      setSearchedCard(null);
      setCardSchedules([]);
      return;
    }

    const cards = Storage.getFairPriceCards();
    const found = cards.find(
      (c) =>
        c.cardNumber.toUpperCase() === q ||
        c.customerMobile.replace(/[^0-9]/g, '').endsWith(q.replace(/[^0-9]/g, ''))
    );

    if (found) {
      setSearchedCard(found);
      const schedules = Storage.getProductSchedules().filter(
        (s) => s.cardNumber === found.cardNumber || s.customerId === found.customerId
      );
      setCardSchedules(schedules);
    } else {
      setSearchedCard(null);
      setCardSchedules([]);
      setSearchError(
        t(
          'কোনো ফেয়ার প্রাইস কার্ড পাওয়া যায়নি। অনুগ্রহ করে আপনার কার্ড নম্বর (যেমন: FPC-2026-8899) বা মোবাইল নম্বর সঠিক কিনা যাচাই করুন।',
          'No card found with this credential. Please verify the card number (e.g. FPC-2026-8899) or mobile.'
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* ----------------------------------------------------
          1. HERO BANNER: LUXURY DARK GOLD FAIR PRICE CARD
      ----------------------------------------------------- */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-16 sm:py-24 relative overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {t('প্রধান গ্রাহক সেবা প্রকল্প', 'Primary Customer Service Program')}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {t(
                  'হোলিনেক্স নায্যমূল্য কার্ড — সিন্ডিকেটমুক্ত নিত্যপ্রয়োজনীয় খাদ্য সামগ্রী',
                  'Holynex Fair Price Card — Regulated Wholesale Food Staples for Every Family'
                )}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {t(
                  'বাজারের কৃত্রিম সিন্ডিকেট ও লাগামহীন মূল্যবৃদ্ধি প্রতিরোধ করে সরাসরি মিল ও কারখানা থেকে চাল, ডাল, তেল, আটা, চিনি সহ প্রধান খাদ্যসামগ্রী নিবন্ধিত কার্ডধারীদের কাছে সরকারি বা নির্ধারিত পাইকারি রেটে ঘরে ঘরে পৌঁছে দেওয়াই আমাদের উদ্দেশ্য।',
                  'Protecting households from retail hoarding with verified wholesale allocations of rice, lentils, edible oil, flour, and sugar delivered through our authorized representative network.'
                )}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-900/90 border border-amber-500/30 p-3 rounded-xl backdrop-blur">
                  <span className="text-[11px] text-amber-400 block font-bold">{t('নির্ধারিত রেট', 'Fixed Wholesale')}</span>
                  <span className="text-sm font-extrabold text-white">{t('বাজারে চেয়ে সাশ্রয়ী', 'Subsidized Pricing')}</span>
                </div>
                <div className="bg-slate-900/90 border border-amber-500/30 p-3 rounded-xl backdrop-blur">
                  <span className="text-[11px] text-amber-400 block font-bold">{t('মাসিক কোটা', 'Monthly Quota')}</span>
                  <span className="text-sm font-extrabold text-white">{t('নিয়মিত শিডিউল সাপ্লাই', 'Scheduled Supply')}</span>
                </div>
                <div className="bg-slate-900/90 border border-amber-500/30 p-3 rounded-xl backdrop-blur col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-amber-400 block font-bold">{t('নিবন্ধন মাধ্যম', 'Registration')}</span>
                  <span className="text-sm font-extrabold text-white">{t('স্থানীয় প্রতিনিধি দ্বারা', 'Via Representative')}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#card-status-checker"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:brightness-105 transition-all flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                  <span>{t('কার্ড স্ট্যাটাস ও শিডিউল চেক', 'Check Card Status & Schedule')}</span>
                </a>

                <button
                  onClick={() => navigate('/dealer-application')}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs transition-all flex items-center gap-2"
                >
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>{t('ডিলার বা প্রতিনিধি হতে আবেদন', 'Join Dealer/Rep Network')}</span>
                </button>
              </div>
            </div>

            {/* Visual Realistic Metallic Fair Price Card Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-600 shadow-2xl shadow-amber-500/20">
                <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-7 rounded-[22px] relative overflow-hidden border border-amber-500/40">
                  {/* Subtle watermarked emblem */}
                  <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-10 rounded-full border-[10px] border-amber-400 pointer-events-none" />

                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-400/80 bg-black flex items-center justify-center p-0.5">
                        <img
                          src="/holynex-logo.jpg"
                          alt="Holynex Emblem"
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <span className="font-cinzel font-black text-amber-400 text-sm tracking-wider block leading-none">
                          HOLYNEX GROUP
                        </span>
                        <span className="text-[9px] text-amber-200 tracking-[0.25em] uppercase font-semibold">
                          FAIR PRICE CARD
                        </span>
                      </div>
                    </div>

                    <div className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300">
                      নায্যমূল্য কার্ড
                    </div>
                  </div>

                  <div className="my-6">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-mono">
                      CARD NUMBER
                    </span>
                    <span className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-wider">
                      FPC • 2026 • 8899
                    </span>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-between items-end text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{t('কার্ডধারী সদস্য', 'Cardholder')}</span>
                      <span className="font-bold text-white text-sm">আব্দুর রহিম</span>
                      <span className="text-[10px] text-slate-400 block font-mono">ID: CUS-000501</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">{t('মেয়াদকাল', 'Valid Thru')}</span>
                      <span className="font-bold text-amber-400 text-sm font-mono">02/2027</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          2. STAPLE PRODUCTS & ALLOCATIONS
      ----------------------------------------------------- */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              <ShoppingBag className="w-3.5 h-3.5" />
              {t('নিত্যপ্রয়োজনীয় খাদ্য সামগ্রী', 'Essential Food Staples')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              {t('নায্যমূল্য কার্ডে অন্তর্ভুক্ত খাদ্য তালিকা ও বরাদ্দ', 'Fair Price Card Products & Quotas')}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t(
                'প্রতিটি নিবন্ধিত পরিবারের প্রয়োজন অনুযায়ী প্রতি মাসে নির্ধারিত কোটায় নিম্নলিখিত পণ্যসমূহ সরাসরি স্থানীয় প্রতিনিধি বা ডিলার পয়েন্ট থেকে সংগ্রহ করা যাবে।',
                'Guaranteed monthly allocations of staple provisions at wholesale rates directly delivered or picked up from local representative centers.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stapleItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={lang === 'bn' ? item.nameBn : item.nameEn}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow">
                      {item.savings}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-bold text-slate-950 text-base">
                        {lang === 'bn' ? item.nameBn : item.nameEn}
                      </h3>
                      <p className="text-xs font-semibold text-amber-700 mt-0.5">
                        {t('মাসিক বরাদ্দ:', 'Monthly Quota:')} {lang === 'bn' ? item.allocationBn : item.allocationEn}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-3 border border-slate-200 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">{t('নায্যমূল্য রেট:', 'Fair Price Rate:')}</span>
                        <span className="font-extrabold text-emerald-600 text-base">{item.fairRate}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[11px] line-through">{item.marketRate}</span>
                        <span className="text-[10px] text-slate-500">{t('বর্তমান বাজার মূল্য', 'Market Value')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-slate-200/80 pt-3">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t('শতভাগ খাঁটি ও ফ্রেশ কোয়ালিটি নিশ্চয়তা', '100% Guaranteed Fresh Milling')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          3. HOW THE CARD WORKS (4-STEP WORKFLOW)
      ----------------------------------------------------- */}
      <section className="py-16 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              {t('প্রক্রিয়া ও নিয়মাবলী', 'Operating Protocol')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              {t('নায্যমূল্য কার্ড কিভাবে কাজ করে?', 'How Does the Fair Price Card Work?')}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t(
                'অননুমোদিত কোনো ব্যক্তি সরাসরি অনলাইনে কার্ড কিনতে পারে না; গ্রাহক রেজিস্ট্রেশন সম্পূর্ণভাবে অনুমোদিত প্রতিনিধি কর্তৃক যাচাই সাপেক্ষে সম্পন্ন হয়।',
                'Notice: Public customer self-registration is strictly barred. Registration is conducted verified door-to-door by authorized field representatives.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm mb-4">
                ১
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                {t('প্রতিনিধি কর্তৃক নিবন্ধন', 'Step 1: Rep Registration')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'আপনার এলাকার হোলিনেক্স অনুমোদিত প্রতিনিধি আপনার ঠিকানায় গিয়ে এনআইডি যাচাই করে গ্রাহক হিসেবে সিস্টেমে অন্তর্ভুক্ত করবেন।',
                  'Your territory representative verifies customer identity and executes registration in the network ledger.'
                )}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm mb-4">
                ২
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                {t('ইউনিক কার্ড ইস্যু ও ট্র্যাকিং', 'Step 2: Card Issuance')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'নিবন্ধন সম্পন্ন হলে আপনি একটি অফিশিয়াল কিউআর ও সিরিয়াল নম্বরযুক্ত নায্যমূল্য কার্ড (FPC) পাবেন যা সম্পূর্ণ মেম্বারশিপ নিশ্চিত করে।',
                  'Receive your official physical and digital Fair Price Card with custom customer tracking ID.'
                )}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm mb-4">
                ৩
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                {t('মাসিক শিডিউল নির্ধারণ', 'Step 3: Monthly Schedule')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'প্রতি মাসের নির্দিষ্ট তারিখে (যেমন: ১০ অক্টোবর) আপনার পণ্য সরবরাহের তারিখ ও পয়েন্ট কেন্দ্রীয়ভাবে নির্ধারিত ও এসএমএস করা হয়।',
                  'Receive SMS notice with your scheduled allocation date (e.g. Miniket Rice 10 KG on 10th October).'
                )}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm mb-4">
                ৪
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                {t('নিশ্চিত পণ্য সংগ্রহ ও সুবিধা', 'Step 4: Pickup & Enjoy')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'নির্ধারিত ডিলার শোরুম বা প্রতিনিধির মাধ্যমে আপনার খাদ্যসামগ্রী গ্রহণ করুন এবং বাজারের অন্যায্য সিন্ডিকেট থেকে পরিবারকে সুরক্ষিত রাখুন।',
                  'Collect your pure groceries at verified wholesale rates with zero stress or hoarding.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          4. CARD STATUS & PRODUCT SCHEDULE CHECKER WIDGET
      ----------------------------------------------------- */}
      <section id="card-status-checker" className="py-16 bg-white border-b border-slate-200 scroll-mt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-amber-500/30">
            <div className="text-center space-y-2 mb-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                <Search className="w-3.5 h-3.5" />
                {t('অনলাইন ভেরিফিকেশন ও শিডিউল ট্র্যাকিং', 'Online Verification & Schedule Tracker')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t('আপনার নায্যমূল্য কার্ড স্ট্যাটাস ও খাদ্য শিডিউল চেক করুন', 'Check Your Fair Price Card & Food Schedule')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                {t(
                  'কার্ড নম্বর (যেমন: FPC-2026-8899) অথবা কার্ডে ব্যবহৃত মোবাইল নম্বর প্রদান করে আপনার বর্তমান কার্ড স্ট্যাটাস ও আগামী খাদ্য সরবরাহের শিডিউল দেখুন।',
                  'Enter your Card Number (e.g. FPC-2026-8899) or registered mobile number to view card status and upcoming delivery schedules.'
                )}
              </p>
            </div>

            <form onSubmit={handleSearchCard} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('কার্ড নম্বর বা মোবাইল নম্বর দিন (যেমন: FPC-2026-8899)', 'Enter Card Number or Mobile (e.g. FPC-2026-8899)')}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 font-mono"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs hover:brightness-105 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <Search className="w-4 h-4 text-slate-950" />
                <span>{t('যাচাই করুন', 'Verify Card')}</span>
              </button>
            </form>

            {/* Error Message */}
            {searchError && (
              <div className="max-w-xl mx-auto mt-4 p-3.5 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {/* Search Result Display */}
            {searchedCard && (
              <div className="mt-8 pt-8 border-t border-slate-800 space-y-6 animate-in fade-in duration-300">
                <div className="bg-slate-900/90 rounded-2xl p-6 border border-amber-500/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                        {t('কার্ড তথ্য ও মেম্বারশিপ', 'Cardholder Profile')}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-0.5">{searchedCard.customerName}</h3>
                      <p className="text-xs text-slate-400">
                        {t('মোবাইল:', 'Mobile:')} {searchedCard.customerMobile} • {t('কার্ড:', 'Card:')}{' '}
                        <strong className="text-amber-300 font-mono">{searchedCard.cardNumber}</strong>
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          searchedCard.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {searchedCard.status === 'active'
                            ? t('সক্রিয় কার্ড (Active)', 'Active Card')
                            : t('পেন্ডিং/স্থগিত', 'Pending/Suspended')}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">{t('দায়িত্বপ্রাপ্ত প্রতিনিধি', 'Representative')}</span>
                      <span className="font-bold text-white">{searchedCard.representativeName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t('ইস্যু তারিখ', 'Issue Date')}</span>
                      <span className="font-bold text-white font-mono">{searchedCard.issueDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t('মাসিক খাদ্য কোটা', 'Monthly Quota')}</span>
                      <span className="font-bold text-amber-400">{searchedCard.monthlyQuotaKg} কেজি</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t('কার্ড ফি স্ট্যাটাস', 'Card Fee')}</span>
                      <span className="font-bold text-emerald-400">
                        ৳ {searchedCard.paidFee} {t('পরিশোধিত', 'Paid')}
                      </span>
                    </div>
                  </div>

                  {/* Scheduled Food Allocation Table */}
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{t('বরাদ্দকৃত খাদ্য সরবরাহ শিডিউল', 'Scheduled Product Entitlement')}</span>
                    </h4>

                    {cardSchedules.length > 0 ? (
                      <div className="space-y-2.5">
                        {cardSchedules.map((sch) => (
                          <div
                            key={sch.id}
                            className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                          >
                            <div>
                              <span className="text-sm font-bold text-white block">
                                {lang === 'bn' ? sch.productNameBn : sch.productNameEn} ({sch.quantity})
                              </span>
                              <span className="text-xs text-slate-400">
                                {t('বিতরণ পয়েন্ট:', 'Pickup Point:')} {sch.deliveryPoint}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <span className="text-xs font-bold text-emerald-400 block">৳ {sch.allocatedPrice}</span>
                                <span className="text-[10px] text-amber-400 font-mono">
                                  {t('তারিখ:', 'Date:')} {sch.scheduledDate}
                                </span>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                                  sch.status === 'Ready for Pickup'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}
                              >
                                {sch.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 p-3 bg-slate-950 rounded-xl">
                        {t(
                          'আপনার আগামী মাসের বরাদ্দ নির্ধারণ প্রক্রিয়াধীন রয়েছে। শীঘ্রই আপনার মোবাইলে নোটিফিকেশন পাঠানো হবে।',
                          'Your upcoming allocation is being scheduled. You will receive an automated SMS notice.'
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          5. DEALER & REPRESENTATIVE CONTACT SUPPORT
      ----------------------------------------------------- */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950">
            {t('নায্যমূল্য কার্ড সংক্রান্ত যে কোনো তথ্যের জন্য', 'Need Support with Fair Price Card?')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            {t(
              'আপনার এলাকায় অনুমোদিত প্রতিনিধি না থাকলে সরাসরি প্রধান কার্যালয়ের হেল্পলাইনে যোগাযোগ করুন।',
              'If your area does not yet have an assigned local representative, contact our central corporate support desk.'
            )}
          </p>
          <div className="pt-2 flex justify-center items-center gap-4">
            <a
              href="tel:01307835260"
              className="px-6 py-3 rounded-full bg-slate-900 text-white hover:bg-black font-bold text-xs flex items-center gap-2 shadow"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>{t('সরাসরি কল: 01307835260', 'Direct Call: 01307835260')}</span>
            </a>
            <button
              onClick={() => navigate('/dealer-application')}
              className="px-6 py-3 rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-xs flex items-center gap-2 shadow"
            >
              <Store className="w-4 h-4" />
              <span>{t('ডিলারশিপ সুযোগ', 'Dealership Program')}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
