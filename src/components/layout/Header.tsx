import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../lib/languageContext';
import {
  Menu,
  X,
  Phone,
  Store,
  Search,
  ChevronRight,
  CreditCard,
  Building,
  Newspaper,
  Award,
  Sparkles,
} from 'lucide-react';
import { Storage } from '../../lib/storage';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const { lang, setLang, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>(() => Storage.getSettings().logoUrl || '/holynex-logo.jpg');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navLinks = [
    { path: '/', labelBn: 'হোম', labelEn: 'Home', icon: Building },
    { path: '/about', labelBn: 'আমাদের সম্পর্কে', labelEn: 'About Us', icon: Award },
    { path: '/products', labelBn: 'পণ্য ও কিস্তি', labelEn: 'Products & EMI', icon: CreditCard },
    { path: '/customer-benefits', labelBn: 'কার্ড সুবিধা', labelEn: 'Card Benefits', icon: Award },
    { path: '/dealer-application', labelBn: 'ডিলার আবেদন', labelEn: 'Apply Dealer', icon: Store },
    { path: '/status', labelBn: 'আবেদন ট্র্যাকিং', labelEn: 'Check Status', icon: Search },
    { path: '/news', labelBn: 'সংবাদ ও নোটিশ', labelEn: 'News & Notices', icon: Newspaper },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top micro bar - purely consumer & corporate facing */}
      <div className="bg-slate-950 text-slate-400 text-[11px] py-1 px-4 sm:px-8 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{t('হটলাইন:', 'Hotline:')} 01307835260</span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-300">
              {t('৭১২, কমিশনার রোড, জুরাইন, ঢাকা', '712, Commissioner Road, Jurain, Dhaka')}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-amber-300/90 hidden md:inline-flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {t('ফেয়ার প্রাইস কার্ড মেম্বারশিপ ও সহজ কিস্তি সেবা', 'Fair Price Card Membership & Easy EMI')}
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="text-slate-400 text-[10px]">
              {t('সরকারি রেজিস্ট্রেশন প্রাপ্ত প্রতিষ্ঠান', 'Government Regd. Enterprise')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Corporate Luxury Header (Matching Screenshot) */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/95 backdrop-blur-md shadow-2xl border-b border-amber-500/30 py-2.5'
            : 'bg-slate-950/90 backdrop-blur-sm border-b border-amber-500/20 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Logo Brand: Circular emblem + HOLYNEX GROUP */}
          <div
            onClick={() => handleNav('/')}
            className="cursor-pointer flex items-center gap-3 select-none group"
            id="header-brand-logo"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-lg shadow-amber-500/20 bg-black flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shrink-0">
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

            <div className="flex flex-col">
              <span className="font-cinzel font-black text-xl sm:text-2xl text-amber-400 tracking-wider leading-none">
                HOLYNEX
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-amber-200/80 tracking-[0.35em] uppercase leading-tight mt-1">
                G R O U P
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links for larger screens */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-amber-300 bg-amber-500/15 border border-amber-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {t(link.labelBn, link.labelEn)}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls (Exactly matching screenshot) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Pill: [ EN | বাং ] */}
            <div className="bg-black/60 border border-amber-500/40 rounded-full p-1 flex items-center gap-1 backdrop-blur-md">
              <button
                id="btn-lang-en"
                onClick={() => setLang('en')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                  lang === 'en'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                id="btn-lang-bn"
                onClick={() => setLang('bn')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                  lang === 'bn'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                বাং
              </button>
            </div>

            {/* Check Status Pill Button */}
            <button
              id="btn-header-check-status"
              onClick={() => handleNav('/status')}
              className="border border-amber-500/40 bg-black/50 hover:bg-amber-500/10 text-amber-100 hover:text-white px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all backdrop-blur-md hidden sm:inline-flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('আবেদন ট্র্যাকিং', 'Check Status')}</span>
            </button>

            {/* Apply Dealer Solid Metallic Gold Button */}
            <button
              id="btn-header-apply-dealer"
              onClick={() => handleNav('/dealer-application')}
              className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5 text-slate-950" />
              <span>{t('ডিলার আবেদন', 'Apply Dealer')}</span>
            </button>

            {/* Circular Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full bg-black/60 border border-amber-500/40 text-amber-400 hover:text-white hover:border-amber-300 flex items-center justify-center transition-all backdrop-blur-md"
              aria-label="Toggle Navigation Menu"
              id="btn-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-300" /> : <Menu className="w-5 h-5 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* Responsive Full Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="bg-slate-950/98 border-b border-amber-500/30 shadow-2xl px-4 sm:px-8 py-6 animate-in slide-in-from-top-3 duration-200 text-white backdrop-blur-xl">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                const IconComponent = link.icon;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNav(link.path)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold border transition-all ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-amber-500/30 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold">{t(link.labelBn, link.labelEn)}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                );
              })}
            </div>

            <div className="max-w-7xl mx-auto pt-5 mt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-amber-300">
                <Phone className="w-3.5 h-3.5" />
                <span>{t('জরুরি সহায়তা:', 'Direct Hotline:')} <strong className="font-mono text-white">01307835260</strong></span>
              </div>
              <div className="text-slate-500 text-[11px]">
                {t('হোলিনেক্স গ্রুপ • ফেয়ার প্রাইস কার্ড ও কিস্তি সিস্টেম', 'Holynex Group • Fair Price & Installment System')}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
