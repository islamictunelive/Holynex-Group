import React, { useState, useRef } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { SiteSettings, AdminUser } from '../../types';
import {
  Settings,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Building,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  Shield,
  Upload,
  RotateCcw,
  Check,
} from 'lucide-react';

interface AdminSettingsTabProps {
  currentUser: AdminUser | null;
  onRefresh: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ currentUser, onRefresh }) => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings>(() => Storage.getSettings());
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.permissions?.canManageSettings;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ইমেজ ফাইল (JPG, PNG, SVG, WebP) নির্বাচন করুন');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setSettings((prev) => ({ ...prev, logoUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    setSettings((prev) => ({ ...prev, logoUrl: '/holynex-logo.jpg' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');

    // Save to Storage (which dispatches 'holynex_settings_updated' event to live update Header & Footer!)
    Storage.saveSettings(settings);

    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
    } catch {}

    setIsSaving(false);
    setSuccessMsg(t('সকল কর্পোরেট সেটিংস ও লোগো সফলভাবে সংরক্ষিত এবং লাইভ আপডেট হয়েছে!', 'All settings & logo saved and live updated!'));
    onRefresh();
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 p-6 rounded-2xl border border-amber-500/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
              {t('কর্পোরেট ও ওয়েবসাইট ব্র্যান্ডিং সেটিংস', 'Corporate & Site Branding Settings')}
            </h2>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/40">
              {t('ফুল সাইট কাস্টমাইজেশন', 'Full Site Customization')}
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            {t(
              'সরাসরি কম্পিউটার থেকে লোগো আপলোড দিন, নাম, হেল্পলাইন, হটলাইন ও চুক্তি নীতিমালা পরিবর্তন করুন।',
              'Upload custom logo, customize corporate identity, helplines, addresses, and agreement policies.'
            )}
          </p>
        </div>

        {isSuperAdmin && (
          <button
            id="btn-save-site-settings"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>{isSaving ? t('সংরক্ষণ হচ্ছে...', 'Saving...') : t('সেটিংস সংরক্ষণ করুন', 'Save Settings')}</span>
          </button>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="p-4 bg-amber-950/80 border border-amber-500/40 rounded-xl flex items-center gap-3 text-amber-200 text-sm">
          <Shield className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            {t(
              'আপনি সাব-এডমিন হিসেবে লগইন আছেন। সাধারণ তথ্যাদি দেখার অনুমতি রয়েছে, পরিবর্তন সুপার অ্যাডমিনের সংরক্ষিত।',
              'You are viewing this as a Sub-Admin. Modifications require Super-Admin privileges.'
            )}
          </span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand & Logo Section */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-amber-500/20 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Building className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">
              {t('ব্র্যান্ড ও লোগো পরিবর্তন (সরাসরি আপলোড)', 'Brand Identity & Logo Customization')}
            </h3>
          </div>

          {/* Logo Direct Upload Widget */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>{t('ওয়েবসাইট লোগো পরিবর্তন করুন', 'Change Website Logo')}</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t('লোগো পরিবর্তন করার পর সাথে সাথে পুরো ওয়েবসাইটের হেডার ও ফুটারে আপডেট হবে।', 'Changes update live in Header & Footer instantly across the entire platform.')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={logoInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={!isSuperAdmin}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={!isSuperAdmin}
                  onClick={() => logoInputRef.current?.click()}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{t('লোগো ফাইল আপলোড', 'Upload Logo File')}</span>
                </button>
                <button
                  type="button"
                  disabled={!isSuperAdmin}
                  onClick={handleResetLogo}
                  title="ডিফল্ট লোগোতে ফিরুন"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('রিসেট', 'Reset')}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-3 border-t border-slate-800">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-amber-400/80 bg-black flex items-center justify-center shrink-0 shadow-md">
                <img
                  src={settings.logoUrl || '/holynex-logo.jpg'}
                  alt="Logo preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 w-full space-y-1">
                <span className="text-xs font-bold text-slate-200 block">
                  {t('লোগো পাথ বা ইমেজ লিংক (ম্যানুয়াল এডিট):', 'Logo Image Path or URL:')}
                </span>
                <input
                  type="text"
                  disabled={!isSuperAdmin}
                  value={settings.logoUrl || '/holynex-logo.jpg'}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  placeholder="/holynex-logo.jpg অথবা https://..."
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-amber-300"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t('কোম্পানির নাম (বাংলা)', 'Company Name (Bangla)')}
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={settings.companyNameBn}
                onChange={(e) => setSettings({ ...settings, companyNameBn: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t('কোম্পানির নাম (English)', 'Company Name (English)')}
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={settings.companyNameEn}
                onChange={(e) => setSettings({ ...settings, companyNameEn: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t('ট্যাগলাইন / স্লোগান (বাংলা)', 'Tagline (Bangla)')}
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={settings.taglineBn}
                onChange={(e) => setSettings({ ...settings, taglineBn: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t('ট্যাগলাইন / স্লোগান (English)', 'Tagline (English)')}
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={settings.taglineEn}
                onChange={(e) => setSettings({ ...settings, taglineEn: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Contact & Hotline Section */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-amber-500/20 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Phone className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">
              {t('যোগাযোগ ও হটলাইন তথ্য', 'Contact & Helpline Details')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t('অফিসিয়াল হেল্পলাইন নম্বর *', 'Helpline Phone *')}
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t('হোয়াটসঅ্যাপ সাপোর্ট নম্বর *', 'WhatsApp Number *')}
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t('কর্পোরেট ইমেইল এড্রেস *', 'Official Corporate Email *')}
              </label>
              <input
                type="email"
                disabled={!isSuperAdmin}
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t('প্রধান কার্যালয়ের ঠিকানা (বাংলা)', 'Head Office Address (Bangla)')}
              </label>
              <textarea
                rows={2}
                disabled={!isSuperAdmin}
                value={settings.addressBn}
                onChange={(e) => setSettings({ ...settings, addressBn: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t('প্রধান কার্যালয়ের ঠিকানা (English)', 'Head Office Address (English)')}
              </label>
              <textarea
                rows={2}
                disabled={!isSuperAdmin}
                value={settings.addressEn}
                onChange={(e) => setSettings({ ...settings, addressEn: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Policies & Agreement Terms */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-amber-500/20 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <FileCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">
              {t('ফেয়ার প্রাইস কার্ড ও ডিলার নীতিমালা', 'Fair Price Card & Dealer Policy')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t('ফেয়ার প্রাইস কার্ড বিবরণী (বাংলা)', 'Fair Price Card Info (Bangla)')}
              </label>
              <textarea
                rows={2}
                disabled={!isSuperAdmin}
                value={settings.fairPriceCardInfoBn}
                onChange={(e) => setSettings({ ...settings, fairPriceCardInfoBn: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t('কিস্তি পরিশোধের নিয়মাবলী (বাংলা)', 'Installment Policy Terms (Bangla)')}
              </label>
              <textarea
                rows={2}
                disabled={!isSuperAdmin}
                value={settings.installmentInfoBn}
                onChange={(e) => setSettings({ ...settings, installmentInfoBn: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-900"
              />
            </div>
          </div>

          {isSuperAdmin && (
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-slate-950" />
                <span>{isSaving ? t('সংরক্ষণ হচ্ছে...', 'Saving...') : t('সকল পরিবর্তন সংরক্ষণ করুন', 'Save All Changes')}</span>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
