import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../lib/languageContext';
import {
  Menu,
  X,
  Phone,
  Store,
  Search,
  ChevronRight,
  Sparkles,
  LogIn,
  User,
  LogOut,
  Building2,
  CalendarCheck,
  CreditCard,
  FileText,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { Storage } from '../../lib/storage';
import { PortalUserSession } from '../../types';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const { lang, setLang, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>(
    () => Storage.getSettings().logoUrl || '/holynex-logo.jpg'
  );
  const [session, setSession] = useState<PortalUserSession | null>(() =>
    Storage.getPortalSession()
  );

  // Scroll detection for sticky header compression
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for admin logo / setting updates
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

  // Synchronize portal user session
  useEffect(() => {
    const checkSession = () => {
      setSession(Storage.getPortalSession());
    };
    window.addEventListener('storage', checkSession);
    const interval = setInterval(checkSession, 2000);
    return () => {
      window.removeEventListener('storage', checkSession);
      clearInterval(interval);
    };
  }, []);

  // Close hamburger menu on ESC key press & lock body scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Navigate handler that smoothly closes the menu and scrolls to top
  const handleNav = useCallback(
    (path: string) => {
      setMobileMenuOpen(false);
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [navigate]
  );

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore network errors
    }
    Storage.clearPortalSession();
    setSession(null);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'dealer':
        return t('ডিলার', 'Dealer');
      case 'sub_dealer':
        return t('সাব-ডিলার', 'Sub-Dealer');
      case 'worker':
        return t('কর্মী', 'Worker');
      case 'customer':
        return t('গ্রাহক', 'Customer');
      default:
        return t('পোর্টাল', 'Portal');
    }
  };

  // ONLY 5 primary navigation items for desktop main header
  const primaryNavItems = [
    { path: '/', labelBn: 'হোম', labelEn: 'Home' },
    { path: '/about', labelBn: 'আমাদের সম্পর্কে', labelEn: 'About Us' },
    { path: '/products', labelBn: 'পণ্য', labelEn: 'Products' },
    { path: '/dealer-application', labelBn: 'ডিলার', labelEn: 'Dealer' },
    { path: '/customer-benefits', labelBn: 'কাস্টমার', labelEn: 'Customer' },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* LEVEL 1 — COMPACT TOP UTILITY BAR                         */}
      {/* ========================================================= */}
      <div className="bg-slate-950 text-slate-400 text-[11px] py-1 border-b border-amber-500/20 select-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 overflow-hidden">
          {/* LEFT: Phone & Address */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 whitespace-nowrap">
            <a
              href="tel:01307835260"
              className="flex items-center gap-1 text-amber-400 font-semibold hover:text-amber-300 transition-colors focus:outline-none focus:underline"
              title={t('হটলাইনে কল করুন', 'Call Hotline')}
            >
              <Phone className="w-3 h-3 text-amber-400 shrink-0" />
              <span>01307835260</span>
            </a>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-slate-300 truncate max-w-[200px] md:max-w-none">
              {t('যাত্রাবাড়ি, পূর্ব জুরাইন, ঢাকা', 'Jatrabari, Purba Jurain, Dhaka')}
            </span>
          </div>

          {/* RIGHT: Single small configurable service text */}
          <div className="flex items-center gap-1.5 text-slate-400 shrink-0 whitespace-nowrap text-[10px] sm:text-[11px]">
            <Clock className="w-3 h-3 text-amber-400/80 shrink-0" />
            <span className="text-amber-200/90 font-medium">
              {t('গ্রাহক সেবা: প্রতিদিন সকাল ৯টা – রাত ৮টা', 'Customer Service: Daily 9 AM – 8 PM')}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LEVEL 2 — MAIN HEADER (STRICTLY SINGLE ROW)               */}
      {/* ========================================================= */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 bg-slate-950/95 backdrop-blur-md border-b border-amber-500/25 shadow-xl ${
          isScrolled ? 'py-2' : 'py-2.5 sm:py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* LEFT: Official HOLYNEX GROUP Logo */}
          <div
            onClick={() => handleNav('/')}
            className="cursor-pointer flex items-center gap-2 sm:gap-3 select-none group shrink-0"
            id="header-brand-logo"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleNav('/');
              }
            }}
            aria-label="Holynex Group Home"
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-md shadow-amber-500/20 bg-black flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shrink-0">
              <img
                src={logoUrl}
                alt="Holynex Group Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-amber-400 font-black text-lg absolute -z-10 select-none">H</span>
            </div>

            <div className="flex flex-col whitespace-nowrap">
              <span className="font-cinzel font-black text-base sm:text-xl lg:text-2xl text-amber-400 tracking-wider leading-none">
                HOLYNEX
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-200/80 tracking-[0.3em] uppercase leading-none mt-0.5 sm:mt-1">
                G R O U P
              </span>
            </div>
          </div>

          {/* CENTER: Primary Desktop Navigation (EXACTLY 5 ITEMS, SINGLE LINE) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0 whitespace-nowrap"
          >
            {primaryNavItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`px-3 xl:px-4 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0 break-keep select-none focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    isActive
                      ? 'text-amber-300 bg-amber-500/15 border border-amber-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  {t(item.labelBn, item.labelEn)}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Language Switcher + Dealer Application Button + Hamburger Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0 whitespace-nowrap">
            {/* Language Switcher Pill: [ বাংলা | EN ] */}
            <div
              className="bg-black/70 border border-amber-500/40 rounded-full p-0.5 sm:p-1 flex items-center shrink-0 shadow-inner"
              role="group"
              aria-label="Language selection"
            >
              <button
                id="btn-lang-bn"
                type="button"
                onClick={() => setLang('bn')}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold rounded-full transition-all whitespace-nowrap shrink-0 select-none ${
                  lang === 'bn'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-pressed={lang === 'bn'}
              >
                বাংলা
              </button>
              <button
                id="btn-lang-en"
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold rounded-full transition-all whitespace-nowrap shrink-0 select-none ${
                  lang === 'en'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-pressed={lang === 'en'}
              >
                EN
              </button>
            </div>

            {/* Dealer Application Button (Desktop / Tablet CTA) */}
            <button
              id="btn-header-apply-dealer"
              type="button"
              onClick={() => handleNav('/dealer-application')}
              className="hidden md:inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black px-3.5 sm:px-4 lg:px-5 py-1.5 sm:py-2 rounded-full text-xs shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 hover:brightness-105 active:scale-95 transition-all whitespace-nowrap shrink-0 break-keep focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <Store className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span className="whitespace-nowrap">{t('ডিলার আবেদন', 'Apply Dealer')}</span>
            </button>

            {/* Hamburger Menu Toggle Button */}
            <button
              id="btn-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-400 hover:text-white hover:border-amber-300 hover:bg-slate-800 transition-all flex items-center justify-center shrink-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-amber-300" />
              ) : (
                <Menu className="w-5 h-5 text-amber-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* HAMBURGER MENU DRAWER & BACKDROP OVERLAY                   */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Premium Corporate Navigation Drawer */}
          <aside className="fixed top-0 right-0 w-full sm:w-[440px] max-w-[92vw] h-full bg-slate-950 border-l border-amber-500/30 flex flex-col shadow-2xl z-50 text-white animate-in slide-in-from-right duration-250">
            {/* Drawer Top Header */}
            <div className="p-4 sm:p-5 border-b border-amber-500/20 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-3 select-none">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-400/80 bg-black flex items-center justify-center shrink-0">
                  <img
                    src={logoUrl}
                    alt="Holynex"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-amber-400 font-bold text-sm absolute -z-10">H</span>
                </div>
                <div>
                  <div className="font-cinzel font-black text-sm text-amber-400 tracking-wider leading-none">
                    HOLYNEX GROUP
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {t('ন্যাভিগেশন মেনু', 'Navigation Menu')}
                  </div>
                </div>
              </div>

              {/* Accessible Close Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-800 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Drawer Content */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">
              {/* Featured Dealer Application CTA (Prominent for Mobile & All Screens) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/15 border border-amber-500/40 shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      {t('অনলাইন সুযোগ', 'Online Opportunity')}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                      {t('অনুমোদিত ডিলারশিপ গ্রহণ করুন', 'Become an Authorized Dealer')}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNav('/dealer-application')}
                    className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow hover:brightness-105 transition-all whitespace-nowrap shrink-0 flex items-center gap-1"
                  >
                    <span>{t('ডিলার আবেদন', 'Apply Dealer')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Mobile Primary Pages Section (Visible on all screens in hamburger) */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-widest px-2 block">
                  {t('মূল পাতা সমূহ', 'Main Pages')}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {primaryNavItems.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => handleNav(item.path)}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                          isActive
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                            : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-amber-500/30 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{t(item.labelBn, item.labelEn)}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 1: COMPANY (আমাদের কোম্পানি) */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-widest px-2 block">
                  COMPANY / {t('কোম্পানি', 'Company')}
                </span>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleNav('/about')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium border transition-all ${
                      currentPath === '/about'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-amber-500/30 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-semibold">{t('আমাদের সম্পর্কে', 'About Us')}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNav('/installments')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium border transition-all ${
                      currentPath === '/installments'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-amber-500/30 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CalendarCheck className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-semibold">{t('আমাদের কার্যক্রম', 'Our Activities')}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNav('/customer-benefits')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium border transition-all ${
                      currentPath === '/customer-benefits'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-amber-500/30 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-semibold">{t('প্রোগ্রামসমূহ', 'Programs')}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </button>
                </div>
              </div>

              {/* Section 2: CUSTOMER (কাস্টমার সেবা) */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-widest px-2 block">
                  CUSTOMER / {t('কাস্টমার সেবা', 'Customer Services')}
                </span>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleNav('/fair-price-card')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium border transition-all ${
                      currentPath === '/fair-price-card'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-amber-500/30 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-semibold">{t('ন্যায্য মূল্য কার্ড', 'Fair Price Card')}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNav('/customer-benefits')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium border transition-all ${
                      currentPath === '/customer-benefits'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-amber-500/30 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-semibold">{t('কাস্টমার সুবিধা', 'Customer Benefits')}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNav('/status')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium border transition-all ${
                      currentPath === '/status'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-amber-500/30 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Search className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-semibold">{t('আবেদন ট্র্যাকিং', 'Application Tracking')}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </button>
                </div>
              </div>

              {/* Section 3: INFORMATION (তথ্য ও সেবা) */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-widest px-2 block">
                  INFORMATION / {t('তথ্য ও নোটিশ', 'Information & Notices')}
                </span>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleNav('/news')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium border transition-all ${
                      currentPath === '/news'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-amber-500/30 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-semibold">{t('নোটিশ ও আপডেট', 'Notices & News')}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNav('/products')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium border transition-all ${
                      currentPath === '/products'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-amber-500/30 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Package className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-semibold">{t('পণ্য গ্যালারি', 'Product Gallery')}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNav('/about')}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium border border-slate-800 bg-slate-900/60 text-slate-300 hover:border-amber-500/30 hover:text-white transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-semibold">{t('যোগাযোগ ও প্রধান কার্যালয়', 'Contact & Office')}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </button>
                </div>
              </div>

              {/* Portal Session / Role-Based Login Entry */}
              <div className="pt-2">
                {session ? (
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white truncate max-w-[150px]">
                            {session.name}
                          </div>
                          <div className="text-[10px] text-amber-400">
                            {getRoleLabel(session.role)} {t('পোর্টাল', 'Portal')}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title={t('লগআউট', 'Logout')}
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNav(`/portal/${session.role}`)}
                      className="w-full py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs rounded-xl text-center shadow"
                    >
                      {t('আমার ড্যাশবোর্ডে প্রবেশ করুন', 'Open Dashboard')}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNav('/login')}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-white transition-all text-xs font-bold"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>{t('ইউজার পোর্টাল লগইন (ডিলার/কর্মী/গ্রাহক)', 'User Portal Login')}</span>
                    </div>
                    <LogIn className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Drawer Footer Info */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-950 text-xs text-slate-400 space-y-2">
              <div className="flex items-center justify-between">
                <a
                  href="tel:01307835260"
                  className="flex items-center gap-2 text-amber-300 font-semibold hover:underline"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>01307835260</span>
                </a>
                <span className="text-[10px] text-slate-500">
                  {t('যাত্রাবাড়ি, ঢাকা', 'Jatrabari, Dhaka')}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 text-center">
                © {new Date().getFullYear()} HOLYNEX GROUP • {t('সর্বস্বত্ব সংরক্ষিত', 'All Rights Reserved')}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
