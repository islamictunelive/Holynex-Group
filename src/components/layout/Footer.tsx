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

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://facebook.com/holynexgroup"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/50 transition-all"
                title="Facebook"
              >
                FB
              </a>
              <a
                href="https://youtube.com/@holynexgroup"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/50 transition-all"
                title="YouTube"
              >
                YT
              </a>
              <a
                href="https://wa.me/8801307835260"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/50 transition-all"
                title="WhatsApp"
              >
                WA
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
              <span className="font-semibold tracking-wide">01307835260</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Mail className="w-5 h-5 text-amber-500 shrink-0" />
              <span>contact@holynexgroup.com</span>
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
