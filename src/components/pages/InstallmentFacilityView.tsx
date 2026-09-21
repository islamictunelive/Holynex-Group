import React, { useState } from 'react';
import { useLanguage } from '../../lib/languageContext';
import {
  Calculator,
  Percent,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Tv,
  Refrigerator,
  Smartphone,
  Bike,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileText,
  BadgePercent,
  Check,
  PhoneCall,
  Clock,
  Layers,
} from 'lucide-react';

interface InstallmentFacilityViewProps {
  navigate: (path: string) => void;
}

export const InstallmentFacilityView: React.FC<InstallmentFacilityViewProps> = ({ navigate }) => {
  const { lang, t } = useLanguage();

  // Interactive Calculator State
  const [productCategory, setProductCategory] = useState('refrigerator');
  const [customPrice, setCustomPrice] = useState<number>(45000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [tenureMonths, setTenureMonths] = useState<number>(12);

  const presetProducts = [
    {
      id: 'refrigerator',
      nameBn: 'স্মার্ট ইনভার্টার রেফ্রিজারেটর',
      nameEn: 'Smart Inverter Refrigerator',
      price: 45000,
      icon: Refrigerator,
      image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'tv',
      nameBn: '৫৫ ইঞ্চি ৪কে আল্ট্রা এইচডি স্মার্ট টিভি',
      nameEn: '55" 4K UHD Smart Android TV',
      price: 42000,
      icon: Tv,
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'bike',
      nameBn: '১২৫ সিসি স্টাইলিশ কমিউটার মোটরসাইকেল',
      nameEn: '125cc Stylish Commuter Motorcycle',
      price: 135000,
      icon: Bike,
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'smartphone',
      nameBn: 'প্রিমিয়াম ফ্ল্যাগশিপ ৫জি স্মার্টফোন',
      nameEn: 'Premium 5G Flagship Smartphone',
      price: 35000,
      icon: Smartphone,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // Calculate down payment and monthly installment
  const downPaymentAmount = Math.round((customPrice * downPaymentPercent) / 100);
  const remainingPrincipal = customPrice - downPaymentAmount;
  // Fair flat service charge 0.5% per month
  const totalServiceFee = Math.round(remainingPrincipal * (0.005 * tenureMonths));
  const totalPayable = remainingPrincipal + totalServiceFee;
  const monthlyInstallment = Math.round(totalPayable / tenureMonths);

  const handleSelectPreset = (item: typeof presetProducts[0]) => {
    setProductCategory(item.id);
    setCustomPrice(item.price);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* ----------------------------------------------------
          1. HERO: SEPARATE INSTALLMENT SERVICE PRESENTATION
      ----------------------------------------------------- */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-16 sm:py-24 relative overflow-hidden border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Percent className="w-3.5 h-3.5 text-indigo-400" />
                {t('স্বতন্ত্র কিস্তি ক্রয় সুবিধা', 'Dedicated Installment Purchase Facility')}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {t(
                  'মাত্র ২০% ডাউন পেমেন্টে পছন্দের ইলেকট্রনিক্স, ফার্নিচার ও মোটর বাইক',
                  'Only 20% Down Payment for Premium Electronics, Furniture & Motorbikes'
                )}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {t(
                  'নায্যমূল্য কার্ডের খাদ্যসুবিধার পাশাপাশি গ্রাহকদের জীবনমান উন্নয়নে হোলিনেক্স গ্রুপ দিচ্ছে সহজ কিস্তি সেবা। কোনো জটিল কাগজপত্র বা ব্যাংক গ্যারান্টি ছাড়াই ৬ থেকে ২৪ মাসের সহজ কিস্তিতে বুঝে নিন আপনার কাঙ্ক্ষিত পণ্য।',
                  'In addition to our Fair Price Card staple rations, Holynex Group empowers households with hassle-free 6 to 24 month micro-financing for consumer durables with zero hidden bank loops.'
                )}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#calculator-section"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:brightness-105 transition-all flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4 text-slate-950" />
                  <span>{t('লাইভ কিস্তি ক্যালকুলেটর ব্যবহার করুন', 'Use Live Installment Calculator')}</span>
                </a>

                <button
                  onClick={() => navigate('/products')}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs transition-all flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>{t('সকল কিস্তি পণ্য ক্যাটালগ', 'Browse All Installment Products')}</span>
                </button>
              </div>
            </div>

            {/* Visual Highlight Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                  <BadgePercent className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{t('২০% ডাউন পেমেন্ট', '20% Down Payment')}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('পণ্য হাতে পাওয়ার সময় স্বল্প ডাউন পেমেন্টেই শুরু।', 'Minimum upfront investment to take your product home.')}
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{t('৬ - ২৪ মাস মেয়াদ', '6 - 24 Months')}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('আপনার মাসিক আয়ের সাথে মিল রেখে নমনীয় মেয়াদ।', 'Flexible installment tenures matched to your income.')}
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{t('অফিসিয়াল ওয়ারেন্টি', 'Official Warranty')}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('প্রতিটি পণ্যে অথেনটিক ব্র্যান্ড সার্ভিস ওয়ারেন্টি।', 'Direct manufacturer brand guarantee & support.')}
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{t('২৪ ঘন্টায় অনুমোদন', '24h Fast Approval')}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('প্রতিনিধির যাচাই সাপেক্ষে দ্রুততম হ্যান্ডওভার।', 'Fast field verification and quick product dispatch.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          2. INTERACTIVE INSTALLMENT CALCULATOR
      ----------------------------------------------------- */}
      <section id="calculator-section" className="py-16 bg-white border-b border-slate-200 scroll-mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              <Calculator className="w-3.5 h-3.5" />
              {t('স্মার্ট কিস্তি হিসাবক', 'Interactive EMI Calculator')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              {t('আপনার মাসিক কিস্তির পরিমাণ হিসাব করুন', 'Calculate Your Monthly Installment')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {t(
                'পণ্য নির্বাচন করুন বা আপনার নিজস্ব বাজেট লিখে ডাউন পেমেন্ট ও মেয়াদের ভিত্তিতে সঠিক হিসাব দেখুন।',
                'Select a preset durable or input your custom budget to see exact down payment and monthly breakdown.'
              )}
            </p>
          </div>

          {/* Presets Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {presetProducts.map((p) => {
              const IconComp = p.icon;
              const isSelected = productCategory === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-amber-500 text-slate-950' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      {lang === 'bn' ? p.nameBn : p.nameEn}
                    </span>
                    <span className="text-[11px] font-mono font-extrabold text-amber-700">৳ {p.price.toLocaleString()}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Price Slider / Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t('পণ্যের নগদ মূল্য (টাকা)', 'Product Cash Price (BDT)')}
                  </label>
                  <span className="text-lg font-black font-mono text-slate-950">৳ {customPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="300000"
                  step="2000"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>৳ ১০,০০০</span>
                  <span>৳ ১,৫০,০০০</span>
                  <span>৳ ৩,০০,০০০</span>
                </div>
              </div>

              {/* Down Payment Selection */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t('ডাউন পেমেন্ট শতাংশ', 'Down Payment Ratio')}
                  </label>
                  <span className="text-sm font-bold text-amber-700">{downPaymentPercent}%</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[20, 30, 40].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDownPaymentPercent(pct)}
                      className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                        downPaymentPercent === pct
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {pct}% ({t('প্রস্তাবিত', 'Standard')})
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenure Selection */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t('কিস্তির মেয়াদ (মাস)', 'Installment Tenure (Months)')}
                  </label>
                  <span className="text-sm font-bold text-amber-700">
                    {tenureMonths} {t('মাস', 'Months')}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {[6, 12, 18, 24].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTenureMonths(m)}
                      className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                        tenureMonths === m
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {m} {t('মাস', 'Mo')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Output Summary Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-6 sm:p-7 rounded-2xl border border-amber-500/30 flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block mb-1">
                  {t('মাসিক কিস্তির পরিমাণ', 'Monthly Installment (EMI)')}
                </span>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono mb-4">
                  ৳ {monthlyInstallment.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-slate-400">/{t('মাস', 'month')}</span>
                </div>

                <div className="space-y-2.5 text-xs border-t border-slate-800 pt-4">
                  <div className="flex justify-between text-slate-300">
                    <span>{t('পণ্যের নগদ মূল্য:', 'Cash Price:')}</span>
                    <span className="font-mono text-white">৳ {customPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>{t('ডাউন পেমেন্ট (প্রাথমিক জমা):', 'Down Payment (Initial):')}</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      ৳ {downPaymentAmount.toLocaleString()} ({downPaymentPercent}%)
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>{t('কিস্তির মোট মেয়াদ:', 'Tenure Length:')}</span>
                    <span className="font-mono text-white">
                      {tenureMonths} {t('মাস', 'Months')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>{t('মোট কিস্তি সংখ্যা:', 'Total Installments:')}</span>
                    <span className="font-mono text-white">{tenureMonths} {t('টি', 'installments')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => navigate('/products')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:brightness-105 transition-all flex items-center justify-center gap-2"
                >
                  <span>{t('এই কিস্তিতে পণ্য অর্ডার করুন', 'Apply for this Installment')}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
                <span className="text-[10px] text-slate-400 text-center block mt-2">
                  {t('প্রতিনিধি আপনার ঠিকানায় যোগাযোগ করে প্রক্রিয়া সম্পন্ন করবেন', 'Field representative will assist you with doorstep verification.')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          3. ELIGIBILITY & DOCUMENTATION
      ----------------------------------------------------- */}
      <section className="py-16 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-3 py-1 rounded-full">
              <FileText className="w-3.5 h-3.5" />
              {t('প্রয়োজনীয় তথ্যাবলী', 'Simple Requirements')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              {t('কিস্তিতে পণ্য ক্রয়ের সহজ শর্তাবলী', 'Easy Terms for Installment Eligibility')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                ১
              </div>
              <h3 className="font-bold text-base text-slate-950">{t('জাতীয় পরিচয়পত্র (NID)', 'NID Verification')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'আবেদনকারী ও এক জন স্থানীয় নিশ্চয়তাকারীর (গ্যারান্টর) জাতীয় পরিচয়পত্রের স্পষ্ট কপি প্রদান করতে হবে।',
                  'Clear copy of applicant and one local guarantor National ID (Smart Card or laminated NID).'
                )}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-bold">
                ২
              </div>
              <h3 className="font-bold text-base text-slate-950">{t('স্থায়ী বা বর্তমান ঠিকানা প্রমাণ', 'Address Proof')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'বিদ্যুৎ বিলের কপি বা চেয়ারম্যান/কাউন্সিলর সার্টিফিকেট অথবা বাড়িভাড়ার প্রমাণপত্র।',
                  'Utility bill copy or ward commissioner/union council residence verification certificate.'
                )}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
                ৩
              </div>
              <h3 className="font-bold text-base text-slate-950">{t('পাসপোর্ট সাইজ ছবি', 'Photographs')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'আবেদনকারীর ২ কপি এবং গ্যারান্টরের ১ কপি সদ্য তোলা রঙিন পাসপোর্ট সাইজ ছবি।',
                  'Two copies of passport size photograph for applicant and one copy for the guarantor.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          4. FREQUENTLY ASKED QUESTIONS
      ----------------------------------------------------- */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-extrabold text-slate-950">
              {t('কিস্তি সেবা সম্পর্কে সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)', 'Frequently Asked Questions')}
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-950 mb-1">
                {t('নায্যমূল্য কার্ডধারী হলে কি অতিরিক্ত সুবিধা পাওয়া যায়?', 'Do Fair Price Cardholders get extra priority?')}
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {t(
                  'হ্যাঁ, হোলিনেক্স নায্যমূল্য কার্ডধারী পরিবারগুলোকে কিস্তি অনুমোদনে বিশেষ অগ্রাধিকার এবং ০% প্রসেসিং ফিতে পণ্য সরবরাহ করা হয়।',
                  'Yes, active Fair Price Cardholders receive expedited approval and zero processing fee on durables.'
                )}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-950 mb-1">
                {t('কিস্তির টাকা কিভাবে পরিশোধ করতে হয়?', 'How are the monthly installments paid?')}
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {t(
                  'প্রতি মাসের নির্দিষ্ট তারিখে আপনার দায়িত্বপ্রাপ্ত প্রতিনিধি সরাসরি এসে সংগ্রহ করবেন, অথবা বিকাশ, নগদ ও ব্যাংকের মাধ্যমে সহজে পরিশোধ করতে পারবেন।',
                  'Paid directly to your assigned field representative with digital receipt or via official bKash, Nagad, and Bank A/C.'
                )}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-950 mb-1">
                {t('পণ্য হস্তান্তরে কত দিন সময় লাগে?', 'How long does product delivery take?')}
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {t(
                  'কাগজপত্র যাচাই সম্পন্ন হওয়ার ২৪ থেকে ৪৮ ঘণ্টার মধ্যে স্থানীয় ডিলার শোরুম বা প্রতিনিধি থেকে পণ্য হস্তান্তর করা হয়।',
                  'Within 24 to 48 hours of verification from your closest authorized dealership showroom.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
