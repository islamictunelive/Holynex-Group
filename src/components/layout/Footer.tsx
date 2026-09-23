import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Phone, MapPin, Mail, ChevronRight } from 'lucide-react';
import { Storage } from '../../lib/storage';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { t } = useLanguage();
  const [logoUrl, setLogoUrl] = useState<string>(() => Storage.getSettings().logoUrl || '/holynex-logo.jpg');

  useEffect(() => {
    const handleSettingsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.logoUrl) {
        setLogoUrl(customEvent.detail.logoUrl);
      } else {
        setLogoUrl(Storage.getSettings().logoUrl || '/holynex-logo.jpg');
      }
    };
    window.addEventListener('holynex_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('holynex_settings_updated', handleSettingsUpdate);
  }, []);

  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand & Corporate Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md shadow-amber-500/10 border border-amber-400/40 bg-black flex items-center justify-center">
                <img
                  src={logoUrl}
                  alt="Holynex Group Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-amber-400 font-black text-xl absolute -z-10">H</span>
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  HOLYNEX
                </span>
                <span className="ml-1.5 font-bold text-xs bg-amber-600 text-white px-1.5 py-0.5 rounded">
                  GROUP
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              {t(
                'হোলিনেক্স গ্রুপ দেশের প্রতিটি পরিবারে সাশ্রয়ী ও মানসম্মত জীবনযাত্রার নিশ্চয়তা দিতে ফেয়ার প্রাইস কার্ড ও সহজ কিস্তি সুবিধা প্রদান করছে। বিশ্বস্ত ডিলার নেটওয়ার্ক ও স্বচ্ছ সেবাই আমাদের অঙ্গীকার।',
                'Holynex Group is dedicated to elevating everyday lives across Bangladesh with our Fair Price Card and flexible installment system. Built upon trust, transparency, and nationwide dealer excellence.'
              )}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <a
                href="https://www.facebook.com/holynexgroup"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-xs text-slate-300 hover:text-blue-400 hover:border-blue-500/50 transition-all"
                title="Official Facebook Page"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </a>
              <a
                href="https://www.youtube.com/@holynexgroup1"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-xs text-slate-300 hover:text-red-400 hover:border-red-500/50 transition-all"
                title="Official YouTube Channel"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>YouTube</span>
              </a>
              <a
                href="https://wa.me/8801307835260"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
                title="Official WhatsApp"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>WhatsApp: 01307835260</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {t('প্রয়োজনীয় লিংক', 'Quick Links')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('/')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('হোম পেইজ', 'Home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/about')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('কোম্পানি পরিচিতি', 'About Us')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/products')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('পণ্য তালিকা ও কিস্তি', 'Products & Installments')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/customer-benefits')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('কাস্টমার বেনিফিটস', 'Customer Benefits')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/news')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('সংবাদ ও অফিসিয়াল নোটিশ', 'News & Announcements')}
                </button>
              </li>
            </ul>
          </div>

          {/* Dealer & Services */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {t('ডিলার ও সেবা সার্ভিস', 'Dealership & Services')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('/login')}
                  className="text-amber-400 font-bold hover:underline flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  {t('ইউজার পোর্টাল লগইন (ডিলার/কর্মী/গ্রাহক)', 'User Portal Login (All Roles)')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/dealer-application')}
                  className="text-slate-300 font-semibold hover:text-amber-400 flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('ডিলারশিপ অনলাইন আবেদন', 'Apply for Dealership')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/status')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('আবেদন অবস্থা যাচাই (Status)', 'Check Application Status')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/dealer-agreement')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('ডিলার চুক্তি ও নীতিমালা', 'Dealer Agreement & Bylaws')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/terms')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('কিস্তি ও সেবার শর্তাবলী', 'Installment Terms & Conditions')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/privacy-policy')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('প্রাইভেসি পলিসি', 'Privacy Policy')}
                </button>
              </li>
            </ul>
          </div>

          {/* Corporate Head Office Contact */}
          <div className="space-y-3.5">
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {t('প্রধান কার্যালয়', 'Corporate Head Office')}
            </h4>

            <div className="flex items-start gap-3 text-sm text-slate-300">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                {t(
                  '৭১২, কমিশনার রোড, জুরাইন, যাত্রাবাড়ী, শ্যামপুর, ঢাকা',
                  '712, Commissioner Road, Jurain, Jatrabari, Shyampur, Dhaka'
                )}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Phone className="w-5 h-5 text-amber-500 shrink-0" />
              <a href="tel:01307835260" className="font-semibold tracking-wide hover:text-amber-400 transition-colors">
                01307835260
              </a>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-300">
              <span className="w-5 h-5 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                WA
              </span>
              <a
                href="https://wa.me/8801307835260"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline font-semibold"
              >
                01307835260 (WhatsApp)
              </a>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Mail className="w-5 h-5 text-amber-500 shrink-0" />
              <a href="mailto:contact@holynexgroup.com" className="hover:text-amber-400 transition-colors">
                contact@holynexgroup.com
              </a>
            </div>

            <div className="pt-2 bg-slate-900/90 rounded-lg p-3 border border-slate-800 text-xs text-slate-400">
              <span className="font-bold text-amber-400 block mb-1">
                {t('অফিস সময়সূচি:', 'Office Hours:')}
              </span>
              {t('শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - সন্ধ্যা ৭:০০', 'Saturday - Thursday: 9:00 AM - 7:00 PM')}
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright & Admin Portal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} <span className="text-slate-300 font-semibold">HOLYNEX GROUP</span>. {t('সর্বস্বত্ব সংরক্ষিত।', 'All Rights Reserved.')}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNav('/privacy-policy')}
              className="hover:text-slate-300 transition-colors"
            >
              {t('গোপনীয়তা নীতি', 'Privacy Policy')}
            </button>
            <span>•</span>
            <button
              onClick={() => handleNav('/terms')}
              className="hover:text-slate-300 transition-colors"
            >
              {t('ব্যবহারের শর্তাবলী', 'Terms of Use')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
