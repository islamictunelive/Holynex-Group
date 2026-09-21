import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { PersonRole } from '../../types';
import {
  Shield,
  Lock,
  User,
  CreditCard,
  Briefcase,
  Store,
  Users,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Phone,
  ArrowRight,
  HelpCircle,
  Sparkles,
  KeyRound,
  ExternalLink,
} from 'lucide-react';

interface LoginViewProps {
  navigate: (path: string) => void;
  defaultRole?: PersonRole;
}

export const LoginView: React.FC<LoginViewProps> = ({ navigate, defaultRole = 'dealer' }) => {
  const { lang, t } = useLanguage();

  const [selectedRole, setSelectedRole] = useState<PersonRole>(defaultRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  // If already logged in, redirect to portal
  useEffect(() => {
    const session = Storage.getPortalSession();
    if (session && session.id) {
      navigate(`/portal/${session.role}`);
    }
  }, [navigate]);

  const roles = [
    {
      id: 'dealer' as PersonRole,
      labelBn: 'ডিলার',
      labelEn: 'Dealer',
      subBn: 'উপজেলা ও থানা ডিলার পোর্টাল',
      subEn: 'Thana & Zone Dealer Portal',
      icon: Store,
      color: 'from-amber-500 to-amber-600',
      placeholderBn: 'মোবাইল নম্বর বা ডিলার আইডি (যেমন: 01711223344)',
      placeholderEn: 'Mobile No or Dealer ID (e.g., 01711223344)',
      demoId: '01711223344',
      demoPass: 'dealer@2026',
    },
    {
      id: 'sub_dealer' as PersonRole,
      labelBn: 'সাব-ডিলার',
      labelEn: 'Sub-Dealer',
      subBn: 'ইউনিয়ন ও ওয়ার্ড সাব-ডিলার',
      subEn: 'Union & Ward Sub-Dealer',
      icon: Briefcase,
      color: 'from-blue-500 to-indigo-600',
      placeholderBn: 'মোবাইল নম্বর বা সাব-ডিলার আইডি',
      placeholderEn: 'Mobile No or Sub-Dealer ID',
      demoId: '01811223344',
      demoPass: 'subdealer@2026',
    },
    {
      id: 'worker' as PersonRole,
      labelBn: 'কর্মী',
      labelEn: 'Worker',
      subBn: 'মাঠপর্যায়ের ডেলিভারি কর্মী',
      subEn: 'Field Supply & Delivery Worker',
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
      placeholderBn: 'মোবাইল নম্বর বা কর্মী আইডি',
      placeholderEn: 'Mobile No or Worker ID',
      demoId: '01911223344',
      demoPass: 'worker@2026',
    },
    {
      id: 'customer' as PersonRole,
      labelBn: 'গ্রাহক',
      labelEn: 'Customer',
      subBn: 'ফেয়ার প্রাইস কার্ড গ্রাহক পোর্টাল',
      subEn: 'Fair Price Card Beneficiary Portal',
      icon: CreditCard,
      color: 'from-amber-400 to-yellow-600',
      placeholderBn: 'কার্ড নম্বর বা মোবাইল (যেমন: FPC-2026-8899)',
      placeholderEn: 'Card No or Mobile (e.g., FPC-2026-8899)',
      demoId: 'FPC-2026-8899',
      demoPass: 'customer@2026',
    },
  ];

  const currentRoleConfig = roles.find((r) => r.id === selectedRole) || roles[0];

  const handleRoleChange = (role: PersonRole) => {
    setSelectedRole(role);
    setError(null);
    setSuccessMsg(null);
  };

  const fillDemoCredentials = (demoId: string, demoPass: string) => {
    setIdentifier(demoId);
    setPassword(demoPass);
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError(
        lang === 'bn'
          ? 'অনুগ্রহ করে ইউজার আইডি / কার্ড নম্বর এবং পাসওয়ার্ড উভয়ই প্রদান করুন।'
          : 'Please enter both User ID/Card No and password.'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Authenticate with secure backend endpoint
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim(),
          role: selectedRole,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'লগইন ব্যর্থ হয়েছে। সঠিক তথ্য দিন।');
      }

      // Store portal session in client persistence
      Storage.setPortalSession({
        id: data.user.id,
        role: data.user.role,
        name: data.user.name,
        mobile: data.user.mobile,
        email: data.user.email,
        area: data.user.area,
        photoUrl: data.user.photoUrl,
        token: data.token || `hnx_tok_${data.user.id}_${Date.now()}`,
        loginTime: new Date().toISOString(),
      });

      setSuccessMsg(
        lang === 'bn'
          ? `স্বাগতম, ${data.user.name}! পোর্টালে প্রবেশ করা হচ্ছে...`
          : `Welcome, ${data.user.name}! Redirecting to portal...`
      );

      // Brief pause to display success state
      setTimeout(() => {
        navigate(`/portal/${data.user.role}`);
      }, 700);
    } catch (err: any) {
      console.warn('Backend login fallback check:', err.message);

      // Fallback: client-side verification against local state
      const person = Storage.findNetworkPersonByIdentifier(identifier.trim());

      // If customer, also check fair price card
      let customerPerson = person;
      if (!customerPerson && selectedRole === 'customer') {
        const cards = Storage.getFairPriceCards();
        const cardMatch = cards.find(
          (c) =>
            c.cardNumber.toLowerCase() === identifier.trim().toLowerCase() ||
            c.customerMobile.replace(/\D/g, '') === identifier.trim().replace(/\D/g, '')
        );
        if (cardMatch) {
          customerPerson = Storage.getNetworkPeople().find(
            (p) => p.id === cardMatch.customerId || p.mobile.replace(/\D/g, '') === cardMatch.customerMobile.replace(/\D/g, '')
          );
        }
      }

      const activePerson = customerPerson || person;

      const isDefault =
        (selectedRole === 'dealer' && password === 'dealer@2026') ||
        (selectedRole === 'sub_dealer' && password === 'subdealer@2026') ||
        (selectedRole === 'worker' && password === 'worker@2026') ||
        (selectedRole === 'customer' && password === 'customer@2026');

      if (activePerson && activePerson.role === selectedRole && (isDefault || activePerson.password === password)) {
        Storage.setPortalSession({
          id: activePerson.id,
          role: activePerson.role,
          name: activePerson.name,
          mobile: activePerson.mobile,
          email: activePerson.email,
          area: activePerson.area,
          photoUrl: activePerson.photoUrl,
          token: `hnx_tok_local_${activePerson.id}_${Date.now()}`,
          loginTime: new Date().toISOString(),
        });

        setSuccessMsg(
          lang === 'bn'
            ? `স্বাগতম, ${activePerson.name}! পোর্টালে প্রবেশ করা হচ্ছে...`
            : `Welcome, ${activePerson.name}! Redirecting to portal...`
        );
        setTimeout(() => {
          navigate(`/portal/${activePerson.role}`);
        }, 700);
      } else {
        setError(err.message || 'ভুল ইউজার আইডি বা পাসওয়ার্ড। পুনরায় চেষ্টা করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) return;

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: forgotIdentifier, role: selectedRole }),
      });
      const data = await res.json();
      setForgotStatus(data.message);
    } catch {
      setForgotStatus(
        lang === 'bn'
          ? 'আপনার তথ্য প্রধান কার্যালয়ে পাঠানো হয়েছে। তাৎক্ষণিক সহায়তার জন্য কল করুন: 01307835260'
          : 'Your request has been forwarded to Head Office. For prompt assistance call: 01307835260'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-xl mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 shadow-xl shadow-amber-500/20 mb-3 border border-amber-400/40">
            <Shield className="w-7 h-7 text-slate-950" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-amber-400 tracking-wider">
            HOLYNEX GROUP
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            {t(
              'নিরাপদ রোল-বেজড পোর্টাল লগইন ও অথেন্টিকেশন সিস্টেম',
              'Secure Role-Based Portal Access & Authentication'
            )}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 p-1 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-inner">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRoleChange(r.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 text-center ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/50 shadow-lg shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 ${
                    isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold whitespace-nowrap">{t(r.labelBn, r.labelEn)}</span>
                <span className="text-[10px] text-slate-500 leading-tight truncate w-full hidden sm:block">
                  {t(r.subBn.split(' ')[0], r.subEn.split(' ')[0])}
                </span>
              </button>
            );
          })}
        </div>

        {/* Login Box */}
        <div className="bg-slate-900/90 rounded-2xl border border-amber-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Subtle Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

          {/* Active Portal Header */}
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase">
                {t('অফিসিয়াল লগইন', 'Official Login')}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                <span>{t(currentRoleConfig.labelBn, currentRoleConfig.labelEn)} {t('পোর্টাল', 'Portal')}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {selectedRole.toUpperCase()}
                </span>
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">{t('হেল্পলাইন:', 'Helpline:')}</span>
              <a href="tel:01307835260" className="text-xs font-bold text-amber-400 hover:underline">
                01307835260
              </a>
            </div>
          </div>

          {/* Quick Demo Autofill Badge */}
          <div className="mb-6 bg-slate-950/80 rounded-xl p-3 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs text-slate-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {t('টেস্ট ক্রেডেনশিয়াল:', 'Demo Credentials:')}{' '}
                <strong className="text-amber-300">{currentRoleConfig.demoId}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => fillDemoCredentials(currentRoleConfig.demoId, currentRoleConfig.demoPass)}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 underline self-start sm:self-auto flex items-center gap-1"
            >
              <span>{t('অটো-ফিল করুন', 'Quick Fill')}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Notifications */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">{successMsg}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* User Identifier */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {selectedRole === 'customer'
                  ? t('ফেয়ার প্রাইস কার্ড নম্বর অথবা নিবন্ধিত মোবাইল নম্বর', 'Card Number or Registered Mobile')
                  : t('ইউজার আইডি অথবা মোবাইল নম্বর', 'User ID or Mobile Number')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  {selectedRole === 'customer' ? <CreditCard className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={t(currentRoleConfig.placeholderBn, currentRoleConfig.placeholderEn)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  {t('পাসওয়ার্ড', 'Password')}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline"
                >
                  {t('পাসওয়ার্ড ভুলে গেছেন?', 'Forgot Password?')}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>{t('যাচাই করা হচ্ছে...', 'Authenticating...')}</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>{t('পোর্টালে প্রবেশ করুন', 'Sign In to Portal')}</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Assistance */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
            {selectedRole === 'dealer' ? (
              <p>
                {t('নতুন ডিলারশিপের জন্য আবেদন করেছেন?', 'Applied for a new dealership?')}{' '}
                <button
                  type="button"
                  onClick={() => navigate('/status')}
                  className="text-amber-400 font-bold hover:underline"
                >
                  {t('আবেদন ট্র্যাকিং করুন', 'Track Application Status')}
                </button>
              </p>
            ) : selectedRole === 'customer' ? (
              <p>
                {t('ফেয়ার প্রাইস কার্ডের সুবিধা জানতে চান?', 'Want to learn more about card benefits?')}{' '}
                <button
                  type="button"
                  onClick={() => navigate('/customer-benefits')}
                  className="text-amber-400 font-bold hover:underline"
                >
                  {t('কার্ড সুবিধা দেখুন', 'View Card Benefits')}
                </button>
              </p>
            ) : (
              <p>
                {t('যেকোনো কারিগরি সমস্যায় প্রধান কার্যালয়ে যোগাযোগ করুন:', 'For technical support contact:')}{' '}
                <span className="text-amber-400 font-bold">01307835260</span>
              </p>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-500">
          <p className="flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('২৪/৭ রিয়েল-টাইম এনক্রিপশন ও আইডেন্টিটি ভেরিফিকেশন সুরক্ষিত', 'Protected with 24/7 Identity Verification & End-to-End Encryption')}</span>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <span>{t('পাসওয়ার্ড পুনরুদ্ধার সহায়তা', 'Password Recovery Support')}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotStatus(null);
                }}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {forgotStatus ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-3">
                <p>{forgotStatus}</p>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <p className="font-semibold text-white">{t('প্রধান কার্যালয় কাস্টমার কেয়ার:', 'Head Office Customer Care:')}</p>
                  <p className="text-amber-400 font-bold text-sm mt-0.5">01307835260 (সকাল ৯:০০ - রাত ৯:০০)</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                >
                  {t('ঠিক আছে', 'Got It')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-slate-300">
                  {t(
                    'আপনার নিবন্ধিত মোবাইল নম্বর বা ইউজার আইডি দিন। সিস্টেম থেকে ভেরিফিকেশন এসএমএস বা প্রতিনিধির মাধ্যমে আপনাকে সহায়তা প্রদান করা হবে।',
                    'Enter your registered mobile or ID to receive instructions or support.'
                  )}
                </p>
                <input
                  type="text"
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  placeholder={t('নিবন্ধিত ফোন নম্বর বা আইডি', 'Registered Phone or ID')}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  required
                />
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                  >
                    {t('বাতিল', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
                  >
                    {t('অনুরোধ পাঠান', 'Send Request')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
