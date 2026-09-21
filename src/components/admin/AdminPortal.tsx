import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { AdminUser, DealerApplication, ProductItem, NewsItem } from '../../types';
import { AdminApplicationsTab } from './AdminApplicationsTab';
import { AdminProductsTab } from './AdminProductsTab';
import { AdminSlidesTab } from './AdminSlidesTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { AdminUsersTab } from './AdminUsersTab';
import { AdminAuditLogsTab } from './AdminAuditLogsTab';
import { AdminGuideModal } from './AdminGuideModal';
import { AdminPeopleTab } from './AdminPeopleTab';
import { AdminCardsTab } from './AdminCardsTab';
import { AdminOrdersSupplyTab } from './AdminOrdersSupplyTab';
import { AdminCommissionTab } from './AdminCommissionTab';
import { AdminMessagingTab } from './AdminMessagingTab';
import {
  Lock,
  LogOut,
  LayoutDashboard,
  Users,
  Package,
  Sliders,
  Bell,
  Settings,
  ShieldCheck,
  History,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  X,
  UserCheck,
  Layers,
  ArrowRight,
  HelpCircle,
  CreditCard,
  Truck,
  DollarSign,
  MessageSquare,
  Network,
} from 'lucide-react';

interface AdminPortalProps {
  navigate: (path: string) => void;
  onDataChange?: () => void;
}

type TabType =
  | 'dashboard'
  | 'people'
  | 'cards'
  | 'orders_supply'
  | 'commissions'
  | 'messaging'
  | 'applications'
  | 'products'
  | 'slides'
  | 'news'
  | 'settings'
  | 'admins'
  | 'logs';

export const AdminPortal: React.FC<AdminPortalProps> = ({ navigate, onDataChange }) => {
  const { lang, t } = useLanguage();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    return Storage.getCurrentAdminUser();
  });
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('holynex@admin2026');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Live Data State
  const [applications, setApplications] = useState<DealerApplication[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // News Modal State
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsForm, setNewsForm] = useState({
    textBn: '',
    textEn: '',
    category: 'অফিসিয়াল নোটিশ',
  });

  const refreshAllData = () => {
    setApplications(Storage.getApplications());
    setProducts(Storage.getProducts());
    setNews(Storage.getNews());
    if (onDataChange) onDataChange();
  };

  useEffect(() => {
    if (currentUser) {
      refreshAllData();
    }
  }, [currentUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    try {
      // 1. Try server API login
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.user) {
          Storage.setCurrentAdminUser(json.user);
          setCurrentUser(json.user);
          sessionStorage.setItem('hnx_admin_logged', 'true');
          setIsLoggingIn(false);
          return;
        }
      }
    } catch {
      // server offline / fallback
    }

    // 2. Client-side authentication fallback
    const authRes = Storage.authenticate(usernameInput, passwordInput);
    setIsLoggingIn(false);

    if (authRes.success && authRes.user) {
      Storage.setCurrentAdminUser(authRes.user);
      setCurrentUser(authRes.user);
      sessionStorage.setItem('hnx_admin_logged', 'true');
    } else {
      setAuthError(authRes.error || t('ভুল ইউজারনেম বা পাসওয়ার্ড!', 'Invalid username or password!'));
    }
  };

  const handleLogout = async () => {
    Storage.setCurrentAdminUser(null);
    setCurrentUser(null);
    sessionStorage.removeItem('hnx_admin_logged');
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {}
  };

  const quickFillCredentials = (role: 'admin' | 'subadmin') => {
    if (role === 'admin') {
      setUsernameInput('admin');
      setPasswordInput('holynex@admin2026');
    } else {
      setUsernameInput('subadmin');
      setPasswordInput('subadmin@2026');
    }
    setAuthError('');
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.textBn) return;

    const newItem: NewsItem = {
      id: `news-${Date.now()}`,
      textBn: newsForm.textBn,
      textEn: newsForm.textEn || newsForm.textBn,
      category: newsForm.category,
      date: new Date().toISOString().split('T')[0],
    };

    Storage.saveNewsItem(newItem);
    try {
      await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
    } catch {}

    setShowNewsModal(false);
    setNewsForm({ textBn: '', textEn: '', category: 'অফিসিয়াল নোটিশ' });
    refreshAllData();
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm(t('এই নোটিশটি মুছে ফেলতে চান?', 'Delete this notice?'))) return;

    Storage.deleteNewsItem(id);
    try {
      await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
    } catch {}
    refreshAllData();
  };

  // -----------------------------------------------------------------
  // 1. LOGIN SCREEN (If not authenticated)
  // -----------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-slate-100 relative overflow-hidden">
          {/* Top Decorative accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

          {/* Official Emblem Logo */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-2 border-amber-400/80 bg-black flex items-center justify-center p-0.5">
              <img
                src="/holynex-logo.jpg"
                alt="Holynex Group Emblem"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                  HOLYNEX
                </h1>
                <span className="font-bold text-xs bg-gradient-to-r from-amber-600 to-amber-500 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                  GROUP
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                {t(
                  'কর্পোরেট অ্যাডমিন ও সাব-এডমিন ম্যানেজমেন্ট পোর্টাল',
                  'Corporate Admin & Sub-Admin Portal'
                )}
              </p>
            </div>
          </div>

          {/* Quick preset role selector */}
          <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <p className="text-[11px] font-bold text-slate-600 text-center mb-2">
              {t('পরীক্ষার জন্য দ্রুত লগইন প্রিভিউ (Quick Login Preset):', 'Select role preset for testing:')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-quick-fill-admin"
                onClick={() => quickFillCredentials('admin')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex flex-col items-center gap-0.5 ${
                  usernameInput === 'admin'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{t('প্রধান অ্যাডমিন', 'Super Admin')}</span>
                <span className="text-[10px] opacity-80">user: admin</span>
              </button>

              <button
                type="button"
                id="btn-quick-fill-subadmin"
                onClick={() => quickFillCredentials('subadmin')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex flex-col items-center gap-0.5 ${
                  usernameInput === 'subadmin'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{t('সহকারী সাব-এডমিন', 'Sub-Admin')}</span>
                <span className="text-[10px] opacity-80">user: subadmin</span>
              </button>
            </div>
          </div>

          {/* Error notice */}
          {authError && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('ইউজারনেম (Username)', 'Username')}
              </label>
              <input
                type="text"
                required
                id="input-admin-username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin অথবা subadmin"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('পাসওয়ার্ড (Password)', 'Password')}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  id="input-admin-password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              id="btn-submit-admin-login"
              disabled={isLoggingIn}
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoggingIn ? t('যাচাই করা হচ্ছে...', 'Verifying...') : t('লগইন করুন', 'Login to Portal')}</span>
            </button>
          </form>

          {/* Admin Guide Button */}
          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="w-full mt-3.5 py-2.5 px-3 bg-amber-50 hover:bg-amber-100/90 border border-amber-300 text-amber-950 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>{t('এডমিন ব্যবহারের পূর্ণ নির্দেশিকা ও ডেমো দেখুন', 'How to Use Admin: Complete Guide')}</span>
          </button>

          {/* Bottom helper */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="hover:text-slate-800 font-semibold"
            >
              ← {t('মূল ওয়েবসাইটে ফিরুন', 'Back to Website')}
            </button>
            <span className="text-[11px] text-slate-400">Holynex Security v2.6</span>
          </div>

          <AdminGuideModal isOpen={showGuideModal} onClose={() => setShowGuideModal(false)} />
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 2. AUTHENTICATED PORTAL VIEW
  // -----------------------------------------------------------------
  const isSuperAdmin = currentUser.role === 'super_admin';

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-['Hind_Siliguri',sans-serif]">
      {/* Top Corporate Admin Navigation Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-400/80 bg-black flex items-center justify-center shrink-0">
              <img
                src="/holynex-logo.jpg"
                alt="Holynex Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                  HOLYNEX
                </span>
                <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded uppercase">
                  PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {t('অ্যাডমিন ও সাব-এডমিন নিয়ন্ত্রণ প্যানেল', 'Central Control System')}
              </p>
            </div>
          </div>

          {/* User Profile Card & Role Switcher */}
          <div className="flex items-center gap-3">
            {/* User status badge */}
            <div className="hidden md:flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  isSuperAdmin
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {currentUser.name.charAt(0) || 'A'}
              </div>
              <div className="text-left">
                <span className="font-bold text-xs text-white block leading-tight max-w-[150px] truncate">
                  {currentUser.name}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    isSuperAdmin ? 'text-amber-400' : 'text-blue-300'
                  }`}
                >
                  {isSuperAdmin
                    ? t('★ প্রধান পরিচালক (Super Admin)', '★ Super Admin')
                    : t('● সহকারী অ্যাডমিন (Sub-Admin)', '● Sub-Admin')}
                </span>
              </div>
            </div>

            {/* Quick Role Toggle (For instant testing preview) */}
            <button
              onClick={() => {
                if (isSuperAdmin) {
                  const sub = Storage.getAdminUsers().find((u) => u.role === 'sub_admin');
                  if (sub) {
                    Storage.setCurrentAdminUser(sub);
                    setCurrentUser(sub);
                  }
                } else {
                  const superAdmin = Storage.getAdminUsers().find((u) => u.role === 'super_admin');
                  if (superAdmin) {
                    Storage.setCurrentAdminUser(superAdmin);
                    setCurrentUser(superAdmin);
                  }
                }
              }}
              className="text-xs px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg border border-slate-700 font-semibold transition-colors flex items-center gap-1"
              title={t('রোল পরিবর্তন করে প্রিভিউ দেখুন', 'Switch between Admin and Sub-Admin')}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isSuperAdmin ? t('সাব-এডমিন ভিউ', 'Sub-Admin View') : t('প্রধান অ্যাডমিন ভিউ', 'Admin View')}
              </span>
            </button>

            {/* Admin Guide Modal Trigger */}
            <button
              onClick={() => setShowGuideModal(true)}
              className="text-xs px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg border border-amber-500/40 font-bold transition-colors flex items-center gap-1.5"
              title={t('এডমিন ব্যবহারের পূর্ণ নির্দেশিকা', 'Admin Usage Guide')}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{t('ব্যবহার নির্দেশিকা', 'Guide')}</span>
            </button>

            {/* Visit Website link */}
            <button
              onClick={() => navigate('/')}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title={t('মূল সাইট দেখুন', 'View Website')}
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Logout Button */}
            <button
              id="btn-admin-logout"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl border border-rose-500/30 text-xs font-bold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('লগআউট', 'Logout')}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{t('ড্যাশবোর্ড', 'Dashboard')}</span>
            </button>

            <button
              onClick={() => setActiveTab('people')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'people'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Network className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('নেটওয়ার্ক হায়ারার্কি', 'Network People')}</span>
            </button>

            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'cards'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('নায্যমূল্য কার্ড ও শিডিউল', 'Fair Price Cards')}</span>
            </button>

            <button
              onClick={() => setActiveTab('orders_supply')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'orders_supply'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{t('অর্ডার ও সাপ্লাই', 'Orders & Supply')}</span>
            </button>

            <button
              onClick={() => setActiveTab('commissions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'commissions'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('কমিশন ও উইথড্রয়াল', 'Commissions & Payouts')}</span>
            </button>

            <button
              onClick={() => setActiveTab('messaging')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'messaging'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('মেসেজিং ও এসএমএস', 'SMS & Messaging')}</span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'applications'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t('ডিলার আবেদন', 'Applications')}</span>
              {applications.filter((a) => a.status === 'Pending').length > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-mono">
                  {applications.filter((a) => a.status === 'Pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{t('পণ্য ও কিস্তি', 'Products & Installments')}</span>
            </button>

            <button
              onClick={() => setActiveTab('slides')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'slides'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{t('ব্যানার স্লাইডার', 'Hero Sliders')}</span>
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'news'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{t('সংবাদ ও নোটিশ', 'News & Notices')}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{t('কর্পোরেট সেটিংস', 'Site Settings')}</span>
            </button>

            <button
              onClick={() => setActiveTab('admins')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'admins'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('অ্যাডমিন ও সাব-এডমিন টিম', 'Admins & Staff')}</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'logs'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>{t('অডিট লগ', 'Audit Logs')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ====================================================
            TAB: DASHBOARD
        ==================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isSuperAdmin
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {isSuperAdmin ? t('প্রধান অ্যাডমিন এক্সেস', 'Super-Admin Privileges') : t('সাব-এডমিন এক্সেস', 'Sub-Admin Privileges')}
                  </span>
                  <span className="text-xs text-slate-400">@{currentUser.username}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif]">
                  {t('স্বাগতম,', 'Welcome,')} {currentUser.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {t(
                    'হোলিনেক্স গ্রুপ ম্যানেজমেন্ট পোর্টালে আপনি ডিলার আবেদনপত্র অনুমোদন, পণ্যের কিস্তি স্কিম, ব্যানার স্লাইডার ও সমস্ত কনটেন্ট সরাসরি নিয়ন্ত্রণ করতে পারেন।',
                    'Full editorial and oversight authority across dealer approvals, consumer installment portfolios, and corporate web settings.'
                  )}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setActiveTab('cards')}
                  className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{t('কার্ড ও খাদ্য শিডিউল', 'Cards & Rations')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('people')}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <Network className="w-4 h-4 text-amber-400" />
                  <span>{t('নেটওয়ার্ক টিম', 'Network Tree')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('commissions')}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>{t('উইথড্রয়াল ও কমিশন', 'Payouts')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('messaging')}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span>{t('এসএমএস পাঠান', 'Send SMS')}</span>
                </button>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('applications')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold">{t('মোট ডিলার আবেদন', 'Total Applications')}</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {applications.length}
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  {applications.filter((a) => a.status === 'Approved').length} {t('অনুমোদিত', 'Approved')}
                </span>
              </div>

              <div
                onClick={() => setActiveTab('applications')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold">{t('অপেক্ষমান আবেদন', 'Pending Approvals')}</span>
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-amber-600 font-mono">
                  {applications.filter((a) => a.status === 'Pending').length}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {t('যাচাইয়ের অপেক্ষায় রয়েছে', 'Requires staff review')}
                </span>
              </div>

              <div
                onClick={() => setActiveTab('products')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold">{t('সক্রিয় পণ্য ক্যাটালগ', 'Active Products')}</span>
                  <Package className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {products.length}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {t('ফেয়ার প্রাইস স্কিমে অন্তর্ভুক্ত', 'Under installment plans')}
                </span>
              </div>

              <div
                onClick={() => setActiveTab('admins')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold">{t('টিম সদস্য', 'Admin Team')}</span>
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {Storage.getAdminUsers().length}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {t('অ্যাডমিন ও সাব-এডমিন', 'Admins & Sub-Admins')}
                </span>
              </div>
            </div>

            {/* Recent Pending Applications and Quick Action links */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-base text-slate-900">
                    {t('সর্বশেষ জমাকৃত আবেদনপত্রসমূহ', 'Recent Dealer Submissions')}
                  </h3>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    <span>{t('সবগুলো দেখুন', 'View All')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {applications.slice(0, 5).map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setActiveTab('applications')}
                      className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                          {app.photoUrl ? (
                            <img
                              src={app.photoUrl}
                              alt={app.fullName}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Users className="w-5 h-5 text-slate-400 m-auto mt-2.5" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block text-sm">{app.fullName}</span>
                          <span className="text-xs text-slate-500">
                            {app.dealerArea} • {app.mobile}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-slate-200 block mb-1">
                          {app.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            app.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'Under Review'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corporate Identity & Quick Stats */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-base text-slate-900">
                    {t('অফিসিয়াল কর্পোরেট প্রোফাইল', 'Corporate Identity')}
                  </h3>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-amber-400/80 bg-black flex items-center justify-center shrink-0">
                    <img
                      src="/holynex-logo.jpg"
                      alt="Logo"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">HOLYNEX GROUP</h4>
                    <p className="text-[11px] text-slate-500">ফেয়ার প্রাইস কার্ড ও কিস্তি সিস্টেম</p>
                    <span className="text-[10px] text-emerald-600 font-bold">● সিস্টেম স্ট্যাটাস: অনলাইন</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <p>
                    <strong className="text-slate-900">{t('হেড অফিস:', 'Head Office:')}</strong> ৭১২, কমিশনার রোড, জুরাইন, শ্যামপুর, ঢাকা
                  </p>
                  <p>
                    <strong className="text-slate-900">{t('হটলাইন:', 'Hotline:')}</strong> 01307835260
                  </p>
                  <p>
                    <strong className="text-slate-900">{t('হোয়াটসঅ্যাপ:', 'WhatsApp:')}</strong> +8801307835260
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{t('কর্পোরেট সেটিংস পরিবর্তন করুন', 'Edit Corporate Settings')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB: DEALER APPLICATIONS
        ==================================================== */}
        {activeTab === 'applications' && (
          <AdminApplicationsTab
            currentUser={currentUser}
            onRefresh={refreshAllData}
          />
        )}

        {/* ====================================================
            TAB: PRODUCT CATALOG
        ==================================================== */}
        {activeTab === 'products' && (
          <AdminProductsTab
            currentUser={currentUser}
            onRefresh={refreshAllData}
          />
        )}

        {/* ====================================================
            TAB: HERO SLIDERS
        ==================================================== */}
        {activeTab === 'slides' && (
          <AdminSlidesTab onRefresh={refreshAllData} />
        )}

        {/* ====================================================
            TAB: NEWS & NOTICES
        ==================================================== */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    {t('সংবাদ ও নোটিশ বোর্ড পরিচালনা', 'News & Notice Board Management')}
                  </h2>
                  <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    {news.length} {t('টি নোটিশ', 'Notices')}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {t(
                    'হোমপেজের স্ক্রলিং হেডলাইন নোটিশ ও কর্পোরেট বুলেটিন আপডেট করুন। অ্যাডমিন ও সাব-এডমিন উভয়ই সম্পাদনা করতে পারবেন।',
                    'Publish or update top ticker news notices and official company announcements.'
                  )}
                </p>
              </div>

              <button
                onClick={() => setShowNewsModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{t('নতুন নোটিশ প্রকাশ', 'Publish Notice')}</span>
              </button>
            </div>

            <div className="space-y-3">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full uppercase">
                      {item.category || 'নোটিশ'}
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{item.textBn}</p>
                    {item.textEn && <p className="text-xs text-slate-500">{item.textEn}</p>}
                    <span className="text-[11px] text-slate-400 block">{item.date}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteNews(item.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                    title={t('মুছে ফেলুন', 'Delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* News Modal */}
            {showNewsModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">
                      {t('নতুন অফিসিয়াল নোটিশ তৈরি', 'Create Official Notice')}
                    </h3>
                    <button
                      onClick={() => setShowNewsModal(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveNews} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {t('নোটিশের বিবরণ (বাংলা) *', 'Notice Text (Bengali) *')}
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={newsForm.textBn}
                        onChange={(e) => setNewsForm({ ...newsForm, textBn: e.target.value })}
                        placeholder="জরুরি নোটিশ: হোলিনেক্স গ্রুপের সকল ডিলারদের উদ্দেশ্যে..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {t('নোটিশের বিবরণ (English)', 'Notice Text (English)')}
                      </label>
                      <textarea
                        rows={2}
                        value={newsForm.textEn}
                        onChange={(e) => setNewsForm({ ...newsForm, textEn: e.target.value })}
                        placeholder="Official Announcement: To all registered Holynex dealers..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {t('ক্যাটাগরি', 'Category')}
                      </label>
                      <input
                        type="text"
                        value={newsForm.category}
                        onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                        placeholder="অফিসিয়াল নোটিশ"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowNewsModal(false)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                      >
                        {t('বাতিল', 'Cancel')}
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl shadow-xs"
                      >
                        {t('প্রকাশ করুন', 'Publish')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            TAB: NETWORK PEOPLE & HIERARCHY
        ==================================================== */}
        {activeTab === 'people' && <AdminPeopleTab />}

        {/* ====================================================
            TAB: FAIR PRICE CARDS & PRODUCT SCHEDULES
        ==================================================== */}
        {activeTab === 'cards' && <AdminCardsTab />}

        {/* ====================================================
            TAB: ORDERS & SUPPLY CHAIN DISPATCH
        ==================================================== */}
        {activeTab === 'orders_supply' && <AdminOrdersSupplyTab />}

        {/* ====================================================
            TAB: COMMISSIONS LEDGER & WITHDRAWALS
        ==================================================== */}
        {activeTab === 'commissions' && <AdminCommissionTab />}

        {/* ====================================================
            TAB: SMS & MESSAGING GATEWAY
        ==================================================== */}
        {activeTab === 'messaging' && <AdminMessagingTab />}

        {/* ====================================================
            TAB: SITE SETTINGS
        ==================================================== */}
        {activeTab === 'settings' && (
          <AdminSettingsTab
            currentUser={currentUser}
            onRefresh={refreshAllData}
          />
        )}

        {/* ====================================================
            TAB: ADMINS & SUB-ADMINS MANAGEMENT
        ==================================================== */}
        {activeTab === 'admins' && (
          <AdminUsersTab
            currentUser={currentUser}
            onRefresh={refreshAllData}
          />
        )}

        {/* ====================================================
            TAB: AUDIT ACTION LOGS
        ==================================================== */}
        {activeTab === 'logs' && <AdminAuditLogsTab />}
      </main>

      {/* Admin Usage Guide & Roles Walkthrough Modal */}
      <AdminGuideModal isOpen={showGuideModal} onClose={() => setShowGuideModal(false)} />
    </div>
  );
};
