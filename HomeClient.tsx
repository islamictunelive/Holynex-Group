import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../lib/languageContext';
import {
  CreditCard,
  CalendarCheck,
  ShieldCheck,
  Store,
  Award,
  BellRing,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Percent,
  CheckCircle2,
  Clock,
  PhoneCall,
  FileCheck,
  TrendingUp,
  Search,
} from 'lucide-react';
import { GoldParticleCanvas } from './GoldParticleCanvas';
import { AdvertisementBanner } from '../common/AdvertisementBanner';

interface SlideProp {
  id: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  image: string;
  ctaTextEn?: string;
  ctaTextBn?: string;
  ctaLink?: string;
}

interface NewsProp {
  id: string;
  textEn: string;
  textBn: string;
}

interface ProductProp {
  id: string;
  nameEn: string;
  nameBn: string;
  descEn: string;
  descBn: string;
  image: string;
  category: string;
  price: number;
  downPayment: number;
  months: number;
  monthly: number;
  badge?: string;
}

interface HomeClientProps {
  slides: SlideProp[];
  news: NewsProp[];
  products: ProductProp[];
  navigate?: (path: string) => void;
  onSelectProduct?: (product: any) => void;
}

export default function HomeClient({
  slides = [],
  news = [],
  products = [],
  navigate = () => {},
  onSelectProduct,
}: HomeClientProps) {
  const { lang, t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[currentSlide] || slides[0];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* ----------------------------------------------------
          A. NEWS TICKER / ANNOUNCEMENT MARQUEE
      ----------------------------------------------------- */}
      {news && news.length > 0 && (
        <div className="bg-slate-900 text-slate-100 border-b border-slate-800 text-xs py-2 px-4 flex items-center">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
            <div className="shrink-0 flex items-center gap-1.5 bg-red-600 text-white font-bold px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span>{t('নোটিশ', 'Notice')}</span>
            </div>
            <div className="overflow-hidden relative w-full whitespace-nowrap">
              <div className="inline-block animate-marquee pl-4 hover:[animation-play-state:paused] cursor-pointer">
                {news.map((item, idx) => (
                  <span key={item.id} className="inline-flex items-center gap-2 mr-8 text-slate-200">
                    <span className="text-amber-400 font-semibold">•</span>
                    <span>{lang === 'bn' ? item.textBn : item.textEn}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Corporate Ad Slot 01: Top Banner / Notice */}
      <AdvertisementBanner slotId="AD_SLOT_01" />

      {/* ----------------------------------------------------
          B. PREMIUM LUXURY HERO SECTION (Matching Screenshot)
      ----------------------------------------------------- */}
      <section className="relative bg-[#06080d] text-white min-h-[600px] lg:min-h-[660px] flex items-center justify-center overflow-hidden">
        {/* Animated Gold Wave & Particle Canvas */}
        <GoldParticleCanvas />

        {/* Ambient Radial Golden Nebulae */}
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none animate-gold-glow" />
        <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Optional Background Slide Image subtle overlay */}
        {activeSlide && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={activeSlide.image}
              alt="Holynex Group Banner"
              className="w-full h-full object-cover object-center opacity-20 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06080d] via-[#06080d]/80 to-[#06080d]" />
          </div>
        )}

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Headline & CTAs (Matching Screenshot) */}
            <div className="lg:col-span-8 space-y-5">
              {/* Badge: ✦ EST. 2014 • DHAKA, BANGLADESH */}
              <div className="inline-flex items-center gap-2 bg-black/60 border border-amber-500/40 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-amber-300 backdrop-blur-md shadow-sm">
                <span className="text-amber-400 font-black text-sm">✦</span>
                <span className="tracking-widest uppercase">EST. 2014 • DHAKA, BANGLADESH</span>
              </div>

              {/* Subtitle: W E L C O M E   T O */}
              <div className="text-slate-400 text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase pl-1">
                W E L C O M E &nbsp; T O
              </div>

              {/* Giant Luxury Serif Typography: HOLYNEX GROUP */}
              <div className="space-y-1">
                <h1 className="font-cinzel text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none gold-gradient-text drop-shadow-2xl">
                  HOLYNEX
                </h1>
                <div className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-wide leading-none drop-shadow-lg">
                  GROUP
                </div>
              </div>

              {/* Multi-color Highlight Subtitle: Installment & Card System Business */}
              <div className="text-lg sm:text-2xl font-bold pt-1 tracking-tight flex flex-wrap items-center gap-x-2">
                <span className="text-amber-500 font-extrabold">Installment</span>
                <span className="text-amber-100 font-bold">& Card System</span>
                <span className="text-emerald-400 font-extrabold">Business</span>
              </div>

              {/* Paragraph Description */}
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
                {lang === 'bn'
                  ? 'সারাদেশে বিশ্বস্ত কিস্তি সুবিধা, মেম্বারশিপ ফেয়ার প্রাইস কার্ড ও উদ্যোক্তা ডিলার নেটওয়ার্কের মাধ্যমে একটি শক্তিশালী ও সমৃদ্ধ আগামীর নিশ্চয়তা।'
                  : 'A premium nationwide network delivering trusted installment financing, smart card membership and dealer opportunities for a stronger tomorrow.'}
              </p>

              {/* Action Buttons (Matching Screenshot) */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3">
                <button
                  id="hero-btn-dealer-apply"
                  onClick={() => navigate('/dealer-application')}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 hover:shadow-amber-500/45 hover:brightness-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Store className="w-4 h-4 text-slate-950" />
                  <span>{t('ডিলার আবেদন করুন', 'Apply Dealer')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-btn-check-status"
                  onClick={() => navigate('/status')}
                  className="px-7 py-3.5 rounded-full bg-black/60 hover:bg-amber-500/15 border border-amber-500/40 text-amber-100 hover:text-white font-bold text-sm backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-amber-400" />
                  <span>{t('আবেদন স্ট্যাটাস চেক', 'Check Status')}</span>
                </button>

                <button
                  id="hero-btn-view-products"
                  onClick={() => navigate('/products')}
                  className="px-5 py-3.5 rounded-full text-xs font-semibold text-slate-300 hover:text-amber-300 hover:bg-slate-900/60 transition-all flex items-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>{t('পণ্য ও কিস্তি দেখুন', 'Browse Products')}</span>
                </button>
              </div>
            </div>

            {/* Right Card / Highlighting Pillars */}
            <div className="lg:col-span-4 space-y-3 pt-4 lg:pt-0">
              {/* Highlight Box 1: Fair Price Card */}
              <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4.5 backdrop-blur-md hover:border-amber-500/60 transition-all shadow-xl">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">
                      {t('ফেয়ার প্রাইস কার্ড সুবিধা', 'Fair Price Card Privilege')}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {t(
                        'নির্ধারিত পাইকারি মূল্যে প্রতিটি পণ্য ক্রয়ের বিশেষ মেম্বারশিপ গ্যারান্টি।',
                        'Wholesale regulated pricing guarantee exclusively for registered members.'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlight Box 2: Installment Facility */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4.5 backdrop-blur-md hover:border-amber-500/40 transition-all shadow-xl">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">
                      {t('সহজ মাসিক কিস্তি (৬-২৪ মাস)', 'Flexible Installments (6-24 Mo)')}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {t(
                        'মাত্র ২০% ডাউন পেমেন্টে পণ্য বুঝে নিন। কোনো লুকানো চার্জ বা সুদ নেই।',
                        'Take delivery with just 20% down payment. Zero hidden interest fees.'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlight Box 3: Authorized Dealer Network */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4.5 backdrop-blur-md hover:border-emerald-500/40 transition-all shadow-xl">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">
                      {t('দেশজুড়ে অনুমোদিত ডিলার পয়েন্ট', 'Nationwide Dealer Network')}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {t(
                        'আপনার এলাকায় নির্ভরযোগ্য সার্ভিস পয়েন্ট ও দ্রুততম ডেলিভারি নিশ্চয়তা।',
                        'Rapid delivery, warranty support, and service from local territory dealers.'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Controls & Dot Indicators */}
          {slides && slides.length > 1 && (
            <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === idx ? 'w-8 bg-amber-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ----------------------------------------------------
          C. COMPANY INTRODUCTION
      ----------------------------------------------------- */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                  alt="Holynex Corporate Headquarters"
                  className="w-full h-[380px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">
                    {t('হেড অফিস', 'Headquarters')}
                  </div>
                  <h4 className="font-bold text-lg">
                    {t('৭১২, কমিশনার রোড, জুরাইন, ঢাকা', '712, Commissioner Road, Jurain, Dhaka')}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    {t('সারাদেশে ফেয়ার প্রাইস নেটওয়ার্ক সমন্বয় কেন্দ্র', 'Central coordination hub for nationwide fair-price commerce')}
                  </p>
                </div>
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute -bottom-5 -right-3 sm:right-6 bg-white rounded-xl shadow-xl p-4 border border-slate-100 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-black text-xl">
                  ১০০%
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {t('স্বচ্ছতা ও বিশ্বস্ততা', 'Ethical & Transparent')}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {t('কোনো লুকানো চার্জ নেই', 'Zero Hidden Fees Guaranteed')}
                  </div>
                </div>
              </div>
            </div>

            {/* Description Text */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-blue-900 uppercase">
                <span className="w-2.5 h-0.5 bg-amber-500"></span>
                {t('পরিচিতি ও লক্ষ্য', 'Who We Are')}
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
                {t(
                  'হোলিনেক্স গ্রুপ — দেশের সাধারণ মানুষের ন্যায্য অধিকার ও সাশ্রয়ী কেনাকাটার নির্ভরযোগ্য ঠিকানা',
                  'Holynex Group — Elevating Consumer Purchasing Power through Fair Price Systems'
                )}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t(
                  'হোলিনেক্স গ্রুপ বাংলাদেশের সাধারণ ভোক্তা ও পরিবারের অর্থনৈতিক সক্ষমতাকে সর্বোচ্চ প্রাধান্য দিয়ে তৈরি করেছে একটি যুগান্তকারী ফেয়ার প্রাইস কার্ড ও সহজ কিস্তি ব্যবস্থা। আমাদের মূল লক্ষ্য মধ্যস্বত্বভোগীদের কৃত্রিম মূল্যবৃদ্ধি দূর করে সরাসরি গ্রাহকের হাতে সাশ্রয়ী মূল্যে আসল ও ব্র্যান্ডেড পণ্য পৌঁছে দেওয়া।',
                  'Holynex Group was founded on the core tenet of economic consumer empowerment. Through our proprietary Fair Price Card System and transparent installment plans, we bridge consumers directly with premium appliances, electronics, and daily essentials, eliminating unjustified intermediary margins.'
                )}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {t('কর্পোরেট মিশন', 'Our Mission')}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {t('ন্যায্য মূল্যে পরিবারে স্বাচ্ছন্দ্য ও টেকসই উন্নয়ন নিশ্চিত করা।', 'Ensuring accessible comforts and long-term financial ease for families.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <TrendingUp className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {t('কর্পোরেট ভিশন', 'Our Vision')}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {t('দেশের প্রতিটি থানায় বিশ্বস্ত ও আধুনিক ডিলারশিপ নেটওয়ার্ক প্রতিষ্ঠা।', 'Establishing verified dealer networks across every district of Bangladesh.')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => navigate('/about')}
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-900 hover:text-amber-600 transition-colors"
                >
                  <span>{t('আমাদের সম্পর্কে আরও জানুন', 'Learn More About Holynex Group')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Ad Slot 03: Mid-page Section Divider Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 w-full">
        <AdvertisementBanner slotId="AD_SLOT_03" />
      </div>

      {/* ----------------------------------------------------
          D. FAIR PRICE CARD SYSTEM (Detailed Breakdown)
      ----------------------------------------------------- */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <CreditCard className="w-3.5 h-3.5 text-amber-700" />
              {t('বিশেষ মেম্বারশিপ', 'Core Innovation')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              {t('ফেয়ার প্রাইস কার্ড সিস্টেম (Fair Price Card)', 'Holynex Fair Price Card System')}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t(
                'হোলিনেক্স ফেয়ার প্রাইস কার্ডধারী সম্মানিত গ্রাহকদের জন্য বাজারে কৃত্রিম মূল্যবৃদ্ধির বিপরীতে পাইকারি মূল্যে পণ্য কেনার অনন্য নিশ্চয়তা।',
                'A dedicated membership card safeguarding families from inflated retail markups with verified fair rates.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 font-bold text-lg mb-4">
                ০১
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {t('কার্ডটি কীভাবে কাজ করে?', 'How the Card Operates')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'কার্ডটি পাওয়ার সাথে সাথে গ্রাহক হোলিনেক্স গ্রুপের সকল ক্যাটাগরির পণ্যে সরাসরি পাইকারি রেট এবং বিশেষ কিস্তি স্কিমের জন্য যোগ্য বলে বিবেচিত হন।',
                  'Once registered, cardholders instantly unlock corporate wholesale pricing tiers and expedited installment qualification.'
                )}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-700 font-bold text-lg mb-4">
                ০২
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {t('কার্ড প্রাপ্তির যোগ্যতা ও প্রক্রিয়া', 'Eligibility & Issuance')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'যেকোনো প্রাপ্তবয়স্ক নাগরিক তার জাতীয় পরিচয়পত্র (NID) ও মোবাইল নম্বর দিয়ে নিজ এলাকার অনুমোদিত ডিলারের মাধ্যমে খুব সহজে কার্ড সংগ্রহ করতে পারেন।',
                  'Any adult citizen can register with their NID and contact details through our local territory dealer points.'
                )}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700 font-bold text-lg mb-4">
                ০৩
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {t('কার্ডধারীদের বিশেষ সুবিধা', 'Exclusive Cardholder Privileges')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'বিশেষ মূল্যছাড়, অগ্রাধিকার ভিত্তিতে স্টক বরাদ্দ, শূন্য শতাংশ প্রসেসিং ফি এবং সহজ মাসিক কিস্তি পরিশোধের সুযোগ।',
                  'Exclusive cashback offers, priority inventory allotment, waived processing fees, and transparent installment timelines.'
                )}
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/customer-benefits')}
              className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm shadow-sm transition-all"
            >
              {t('ফেয়ার প্রাইস কার্ডের বিস্তারিত নিয়মাবলী জানুন', 'Read Complete Card Benefits & Guidelines')}
            </button>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          E. INSTALLMENT SYSTEM (Step-by-Step)
      ----------------------------------------------------- */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-blue-700" />
                {t('সহজ কিস্তি পদ্ধতি', 'Installment Mechanism')}
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
                {t(
                  'স্বচ্ছ ও সহজ শর্তে পণ্য ক্রয় করুন — জটিলতা ও গোপন চার্জমুক্ত কিস্তি',
                  'Transparent Product Procurement on Flexible Installment Terms'
                )}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t(
                  'হোলিনেক্স গ্রুপের কিস্তি পদ্ধতিতে কোনো লুকানো চক্রবৃদ্ধি বা জটিল প্রক্রিয়া নেই। মাত্র ২০% থেকে ৩০% ডাউন পেমেন্ট প্রদান করে আপনার আয়ের সুবিধামতো ৬, ১২, ১৮ বা ২৪ মাসের সমান কিস্তিতে পণ্য বুঝে নিতে পারেন।',
                  'Our installment framework features zero compounding traps or hidden administrative charges. Secure home appliances, vehicles, or gadgets with 20% to 30% down payment, spread over 6 to 24 predictable monthly installments.'
                )}
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ১
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {t('পণ্য নির্বাচন ও মেয়াদ নির্ধারণ', 'Step 1: Select Product & Installment Duration')}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t('আমাদের ক্যাটালগ থেকে পছন্দসই পণ্য ও আপনার সামর্থ্য অনুযায়ী ৬-২৪ মাসের মেয়াদ বাছুন।', 'Choose your desired product and suitable duration (6, 12, 18, or 24 months).')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ২
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {t('স্বল্প ডাউন পেমেন্ট জমা', 'Step 2: Deposit Initial Down Payment')}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t('নির্ধারিত ২০%-৩০% ডাউন পেমেন্ট জমা দিয়ে অফিসিয়াল চালান ও ইনভয়েস রসিদ গ্রহণ করুন।', 'Deposit the minimal down payment and receive your signed corporate invoice receipt.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ৩
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {t('২৪-৪৮ ঘণ্টার মধ্যে পণ্য ডেলিভারি ও ওয়ারেন্টি', 'Step 3: Rapid Delivery & Genuine Warranty')}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t('কাগজপত্র যাচাই সম্পন্ন হলে সরাসরি আপনার বাড়িতে পণ্য পৌঁছে দেওয়া হয়।', 'Upon rapid verification, your product is delivered with full official brand warranty.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Installment Calculator Demo Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                    {t('কিস্তি ক্যালকুলেটর প্রিভিউ', 'Sample Calculator')}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {t('উদাহরণ: ৪৩" ৪কে স্মার্ট টিভি', 'Example: 43" 4K Smart TV')}
                  </h3>
                </div>
                <div className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
                  {t('১২ মাসের স্কিম', '12-Month Plan')}
                </div>
              </div>

              <div className="py-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{t('পণ্য মূল্য:', 'Cash Product Value:')}</span>
                  <span className="font-extrabold text-white text-base">৳ ৩৮,৯০০</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{t('ডাউন পেমেন্ট (২০%):', 'Down Payment (20%):')}</span>
                  <span className="font-bold text-amber-400 text-base">৳ ৭,৮০০</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{t('কিস্তির মেয়াদ:', 'Tenure Duration:')}</span>
                  <span className="font-medium text-slate-200">{t('১২ মাস (সমান কিস্তি)', '12 Equal Months')}</span>
                </div>
                <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-300">{t('মাসিক কিস্তির পরিমাণ:', 'Monthly Installment:')}</span>
                  <span className="text-2xl font-black text-emerald-400">৳ ২,৫৯২ /মাস</span>
                </div>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  {t(
                    'কোনো প্রকার লুকানো চার্জ বা লেট ফি পেনাল্টি নেই। সম্পূর্ণ স্বচ্ছ ব্যাংক বা ডিলার চ্যানেলে জমা।',
                    'Zero hidden compounding fees. Transparent receipts with automatic SMS confirmation.'
                  )}
                </span>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => navigate('/products')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm hover:brightness-105 transition-all text-center"
                >
                  {t('সব পণ্যের কিস্তি তালিকা দেখুন', 'View All Product Installment Plans')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          F. FEATURED PRODUCTS
      ----------------------------------------------------- */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-2">
                <Award className="w-3.5 h-3.5" />
                {t('জনপ্রিয় পণ্যসম্ভার', 'Featured Collection')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                {t('সেরা কিস্তি ও ফেয়ার প্রাইসের পণ্যসমূহ', 'Top Installment & Fair Price Products')}
              </h2>
            </div>

            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-900 hover:text-amber-600 transition-colors"
            >
              <span>{t('সকল পণ্য ক্যাটালগ দেখুন', 'View All Catalog')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Product Image & Badge */}
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={lang === 'bn' ? product.nameBn : product.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-md">
                      {product.badge}
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white font-bold text-xs px-2.5 py-1 rounded-lg">
                    {t('নগদ:', 'Cash:')} ৳ {product.price.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-950 text-base line-clamp-1 group-hover:text-blue-900 transition-colors">
                      {lang === 'bn' ? product.nameBn : product.nameEn}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {lang === 'bn' ? product.descBn : product.descEn}
                    </p>
                  </div>

                  {/* Installment Highlight Box */}
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">{t('ডাউন পেমেন্ট:', 'Down Payment:')}</span>
                      <span className="font-bold text-slate-900">৳ {product.downPayment.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-right border-l border-amber-200 pl-3">
                      <span className="text-amber-800 block font-semibold text-[11px]">{product.months} {t('মাসের কিস্তি', 'Mos Term')}</span>
                      <span className="font-extrabold text-amber-700 text-sm">৳ {product.monthly.toLocaleString('en-IN')}/মাস</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        if (onSelectProduct) {
                          onSelectProduct(product);
                        } else {
                          navigate('/products');
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-950 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t('বিস্তারিত ও কিস্তি অর্ডার', 'Details & Installment Order')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          G. CUSTOMER BENEFITS (Crucial: Must be titled "Customer Benefits")
      ----------------------------------------------------- */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('গ্রাহকের সুবিধা', 'Value Proposition')}
            </div>
            {/* Title must specifically be "Customer Benefits" */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              {t('কাস্টমার বেনিফিটস (Customer Benefits)', 'Holynex Customer Benefits')}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t(
                'হোলিনেক্স গ্রুপের সাথে প্রতিটি গ্রাহকের সম্পর্ক বিশ্বাস, স্বচ্ছতা ও সর্বোত্তম সুবিধার ভিত্তিতে পরিচালিত হয়।',
                'Experience authentic customer protection, verified manufacturer warranty, and flexible financing with Holynex Group.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                {t('ফেয়ার প্রাইস কার্ডের নিশ্চয়তা', 'Fair Price Card Assurance')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'বাজারে কৃত্রিম সিন্ডিকেট ও অতিরিক্ত মুনাফা রোধ করে সরাসরি কোম্পানির পক্ষ থেকে পাইকারি রেটে পণ্য সরবরাহের নিশ্চয়তা।',
                  'Protection from retail hoarding with guaranteed direct company wholesale rates for registered cardholders.'
                )}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center mb-4">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                {t('সহজ ও স্বস্তিদায়ক কিস্তি পদ্ধতি', 'Easy & Flexible Installments')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'স্বল্প ডাউন পেমেন্ট এবং ৩ থেকে ২৪ মাস পর্যন্ত যেকোনো মেয়াদের সহজ মাসিক কিস্তি সুবিধা।',
                  'Convenient terms spanning 3 to 24 months with no punitive late compounding fees.'
                )}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                {t('দ্রুততম অনুমোদন ও যাচাইকরণ', 'Fast Approval & Verification')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'কাগজপত্রের ঝামেলাহীন দ্রুততম ২৪-৪৮ ঘণ্টার মধ্যে আবেদন যাচাই ও ডেলিভারি ব্যবস্থা।',
                  'Hassle-free 24 to 48-hour approval workflow through our dedicated verification team.'
                )}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center mb-4">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                {t('দেশব্যাপী অনুমোদিত ডিলার সেবা', 'Nationwide Dealer Network')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'আপনার নিজ থানা ও এলাকার অনুমোদিত ডিলার পয়েন্ট থেকে সরাসরি পণ্য হ্যান্ডওভার ও গ্রাহক সহায়তা।',
                  'Local territory dealer points enabling seamless pickup, installment logging, and immediate service.'
                )}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-rose-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-700 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                {t('শতভাগ জেনুইন ব্র্যান্ড ওয়ারেন্টি', '100% Genuine Brand Warranty')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'সকল ইলেকট্রনিক্স ও হোম অ্যাপ্লায়েন্সে অফিসিয়াল প্রস্তুতকারক কর্তৃক দীর্ঘস্থায়ী ওয়ারেন্টি গ্যারান্টি।',
                  'Official direct manufacturer warranty with complete spare parts availability and authorized technician support.'
                )}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-4">
                <BellRing className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                {t('স্বচ্ছ রসিদ ও তাৎক্ষণিক এসএমএস', 'Transparent Billing & SMS Receipts')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'প্রতিটি কিস্তি জমা দেওয়ার সাথে সাথে গ্রাহকের মোবাইলে তাৎক্ষণিক এসএমএস কনফার্মেশন ও অফিশিয়াল স্লিপ।',
                  'Automated carrier SMS confirmation sent to the client upon every installment payment for total accounting security.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          H. DEALER APPLICATION CALL-TO-ACTION SECTION
      ----------------------------------------------------- */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Store className="w-3.5 h-3.5" />
                {t('ব্যবসায়িক সুবর্ণ সুযোগ', 'Dealership Opportunity')}
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {t(
                  'হোলিনেক্স গ্রুপের অনুমোদিত ডিলার হিসেবে গড়ে তুলুন আপনার প্রতিষ্ঠিত ব্যবসা',
                  'Become an Authorized Holynex Group Dealer & Lead Your Local Market'
                )}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {t(
                  'আপনার থানা বা ইউনিয়ন পর্যায়ে হোলিনেক্স গ্রুপের পণ্য বিপণন ও ফেয়ার প্রাইস কার্ড সার্ভিস পরিচালনার জন্য আমরা ডিলার নিয়োগ করছি। আকর্ষণীয় কমিশন, নিশ্চিত গ্রাহক চাহিদা ও কেন্দ্রীয় প্রযুক্তিগত সহায়তা নিয়ে শুরু করুন আপনার নতুন উদ্যোগ।',
                  'Partner with Holynex Group as an authorized regional dealer. Benefit from established brand equity, corporate marketing support, robust cloud invoicing, and highly rewarding commission structures.'
                )}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  id="dealer-cta-apply-btn"
                  onClick={() => navigate('/dealer-application')}
                  className="px-7 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 transition-all flex items-center gap-2"
                >
                  <Store className="w-4 h-4 text-slate-950" />
                  <span>{t('এখনই ডিলার আবেদন করুন', 'Apply for Dealership Now')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/dealer-agreement')}
                  className="px-5 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  <span>{t('ডিলার চুক্তি ও নিয়মাবলী', 'Dealer Agreement & Rules')}</span>
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-400 pl-2">
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>{t('ডিলার হেল্পলাইন: 01307835260', 'Dealer Hotline: 01307835260')}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
              <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3">
                {t('ডিলার আবেদনের প্রয়োজনীয় ডকুমেন্টস', 'Application Checklist')}
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t('আবেদনকারীর পাসপোর্ট সাইজ ছবি (বাধ্যতামূলক)', 'Applicant Personal Photo (Mandatory)')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t('আবেদনকারীর পূর্ণ নাম, পিতা ও মাতার নাম', 'Applicant & Parents Full Names')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t('সক্রিয় মোবাইল নম্বর ও যোগাযোগের ঠিকানা', 'Active Mobile Number & Full Address')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t('প্রস্তাবিত ডিলার এলাকা/থানা নির্ধারণ', 'Desired Territory / Upazila Selection')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-slate-400">{t('ট্রেড লাইসেন্স ও এনআইডি (ঐচ্ছিক/সহায়ক)', 'Trade License & NID (Optional Support)')}</span>
                </li>
              </ul>
              <div className="pt-2 text-[11px] text-amber-400/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                {t(
                  'আবেদন সফলভাবে জমা হলে আপনি সাথে সাথে একটি ইউনিক ট্র্যাকিং আইডি (যেমন: HNX-2026-XXXXXX) পাবেন।',
                  'Upon submission, an official Application ID (e.g. HNX-2026-000101) is generated instantly for tracking.'
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
