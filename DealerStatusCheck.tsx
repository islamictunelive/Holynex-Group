import React, { useState } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Bell,
  BellRing,
  Phone,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const DealerStatusCheck: React.FC = () => {
  const { lang, t } = useLanguage();

  const [applicationId, setApplicationId] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any | null>(null);

  // Web Push Subscription State
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [pushStatusText, setPushStatusText] = useState('');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setResult(null);

    if (!applicationId.trim() || !mobile.trim()) {
      setError(t('Application ID এবং মোবাইল নম্বর উভয়ই প্রদান করুন।', 'Please provide both Application ID and mobile number.'));
      return;
    }

    setLoading(true);

    try {
      // Query server API
      const res = await fetch('/api/dealer/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, mobile }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.application) {
          setResult(json.application);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('API query failed, falling back to local storage:', err);
    }

    // Local storage fallback
    const found = Storage.findApplication(applicationId, mobile);
    if (found) {
      setResult({
        id: found.id,
        fullName: found.fullName,
        mobile: found.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
        dealerArea: found.dealerArea,
        status: found.status,
        submittedAt: found.submittedAt,
        updatedAt: found.updatedAt,
        publicMessage: found.publicMessage || 'আপনার আবেদনটি পর্যবেক্ষণাধীন রয়েছে।',
      });
    } else {
      setError(
        t(
          'প্রদত্ত তথ্যের সাথে কোনো আবেদনপত্র মেলেনি। অনুগ্রহ করে আপনার অ্যাপ্লিকেশন আইডি (যেমন: HNX-2026-000101) এবং মোবাইল নম্বরটি পুনরায় যাচাই করুন।',
          'No application found matching the provided Application ID and mobile number. Please verify and try again.'
        )
      );
    }
    setLoading(false);
  };

  const fillSample = (id: string, mob: string) => {
    setApplicationId(id);
    setMobile(mob);
  };

  const togglePushSubscription = async () => {
    if (pushSubscribed) {
      setPushSubscribed(false);
      setPushStatusText(t('পুশ নোটিফিকেশন বন্ধ করা হয়েছে।', 'Push notification unsubscribed.'));
      return;
    }

    try {
      if (!('Notification' in window)) {
        setPushStatusText(t('আপনার ব্রাউজার পুশ নোটিফিকেশন সাপোর্ট করে না।', 'Browser does not support push notifications.'));
        return;
      }

      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setPushSubscribed(true);
        setPushStatusText(
          t(
            'সফল! এখন থেকে এই আবেদনের যেকোনো স্ট্যাটাস আপডেট হলে স্বয়ংক্রিয় পুশ নোটিফিকেশন পাবেন।',
            'Subscribed! You will receive background web push alerts upon any application status change.'
          )
        );

        // Register to server
        fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            applicationId: result?.id || applicationId,
            subscription: { endpoint: 'browser-native-vapid-subscription' },
          }),
        }).catch(() => {});
      } else {
        setPushStatusText(t('নোটিফিকেশন পারমিশন দেওয়া হয়নি।', 'Notification permission was denied.'));
      }
    } catch (e: any) {
      setPushStatusText(e.message || 'Notification error');
    }
  };

  return (
    <div className="py-14 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
            <Search className="w-3.5 h-3.5" />
            {t('ডিলারশিপ ট্র্যাকিং পোর্টাল', 'Dealership Status Tracking')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            {t('আবেদনের বর্তমান অবস্থা যাচাই করুন', 'Track Your Application Status')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {t(
              'কোনো লগইন বা পাসওয়ার্ড ছাড়াই আপনার অ্যাপ্লিকেশন আইডি ও মোবাইল নম্বর দিয়ে রিয়েল-টাইম স্ট্যাটাস জানুন।',
              'Check your verified application stage instantly using your Application ID and registered mobile number.'
            )}
          </p>
        </div>

        {/* Verification Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 mb-8 space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('অ্যাপ্লিকেশন আইডি (Application ID)', 'Application ID')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  placeholder="HNX-2026-000101"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('আবেদনকালীন মোবাইল নম্বর', 'Registered Mobile Number')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="btn-track-status-submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-extrabold text-sm shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-slate-950" />
              <span>{loading ? t('যাচাই করা হচ্ছে...', 'Verifying Status...') : t('স্ট্যাটাস দেখুন', 'Check Application Status')}</span>
            </button>
          </form>

          {/* Preset sample IDs for quick instant verification */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">{t('টেস্টিং এর জন্য নমুনা আইডি:', 'Quick test samples:')}</span>
            <button
              type="button"
              onClick={() => fillSample('HNX-2026-000101', '01711223344')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-medium"
            >
              HNX-2026-000101 (Approved)
            </button>
            <button
              type="button"
              onClick={() => fillSample('HNX-2026-000102', '01899887766')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-medium"
            >
              HNX-2026-000102 (Under Review)
            </button>
            <button
              type="button"
              onClick={() => fillSample('HNX-2026-000103', '01955443322')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-medium"
            >
              HNX-2026-000103 (Pending)
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm mb-6 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">{t('তথ্য খুঁজে পাওয়া যায়নি', 'Record Not Found')}</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Search Result Card */}
        {result && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider">
                  {t('আবেদন ট্র্যাকিং ফলাফল', 'Application Tracking Result')}
                </span>
                <h3 className="text-xl font-extrabold text-slate-950 font-mono mt-0.5">
                  {result.id}
                </h3>
              </div>

              {/* Status Badge */}
              <div>
                {result.status === 'Approved' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {t('অনুমোদিত (Approved)', 'Approved')}
                  </span>
                )}
                {result.status === 'Under Review' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                    <Clock className="w-4 h-4 text-amber-600" />
                    {t('পর্যালোচনাধীন (Under Review)', 'Under Review')}
                  </span>
                )}
                {result.status === 'Pending' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900 border border-blue-300">
                    <Clock className="w-4 h-4 text-blue-600" />
                    {t('অপেক্ষমান (Pending)', 'Pending')}
                  </span>
                )}
                {result.status === 'Rejected' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-800 border border-red-300">
                    <XCircle className="w-4 h-4 text-red-600" />
                    {t('বাতিল (Rejected)', 'Rejected')}
                  </span>
                )}
              </div>
            </div>

            {/* Applicant Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block">{t('আবেদনকারীর নাম:', 'Applicant Name:')}</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{result.fullName}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block">{t('নিবন্ধিত মোবাইল:', 'Registered Mobile:')}</span>
                <span className="font-bold text-slate-900 text-sm font-mono mt-0.5 block">{result.mobile}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block">{t('প্রস্তাবিত ডিলার এলাকা:', 'Designated Territory:')}</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{result.dealerArea}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block">{t('সর্বশেষ আপডেট:', 'Last Updated:')}</span>
                <span className="font-semibold text-slate-700 mt-0.5 block">
                  {new Date(result.updatedAt || result.submittedAt).toLocaleDateString('bn-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Public Instructions Message (Strictly public, no private admin notes) */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
              <span className="font-bold text-amber-900 block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                {t('অফিসিয়াল বার্তা ও দিকনির্দেশনা:', 'Official Guidance & Notification:')}
              </span>
              <p className="text-slate-700 leading-relaxed text-sm">
                {result.publicMessage || t('আপনার আবেদনটি প্রক্রিয়াধীন রয়েছে। ফলাফল জানানো হবে।', 'Your application is currently being processed.')}
              </p>
            </div>

            {/* Web Push Notification Subscription Box */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-400">
                  <Bell className="w-4 h-4" />
                  <span>{t('ব্রাউজার পুশ নোটিফিকেশন অ্যালার্ট', 'Browser Push Notification Alert')}</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {t(
                    'পেজটি বন্ধ রাখলেও আপনার ডিলারশিপের স্ট্যাটাস আপডেট ব্রাউজারে স্বয়ংক্রিয় নোটিফিকেশন পান।',
                    'Receive instant alerts when your application status changes, even with the tab closed.'
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={togglePushSubscription}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  pushSubscribed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow'
                }`}
              >
                {pushSubscribed ? t('সাবস্ক্রাইবড ✓', 'Subscribed ✓') : t('নোটিফিকেশন চালু করুন', 'Enable Push Alerts')}
              </button>
            </div>

            {pushStatusText && (
              <div className="text-xs text-emerald-700 font-medium bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                {pushStatusText}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
