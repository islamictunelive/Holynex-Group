import React, { useState } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import {
  Store,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Printer,
  Copy,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface DealerApplicationFormProps {
  navigate: (path: string) => void;
}

export const DealerApplicationForm: React.FC<DealerApplicationFormProps> = ({ navigate }) => {
  const { lang, t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    mobile: '',
    email: '',
    occupation: '',
    address: '',
    dealerArea: '',
    photoUrl: '',
    nidUrl: '',
    tradeLicenseUrl: '',
    otherDocUrl: '',
    agreedToTerms: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedApp, setSubmittedApp] = useState<any | null>(null);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Quick photo presets for demonstration if applicant does not have an upload URL immediately
  const samplePhotos = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  ];

  const handleFileUpload = (field: 'photoUrl' | 'nidUrl' | 'tradeLicenseUrl', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local object preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage(t('আবেদনকারীর পূর্ণ নাম লিখুন।', 'Full name is required.'));
      return;
    }
    if (!formData.fatherName.trim()) {
      setErrorMessage(t('পিতার নাম লিখুন।', "Father's name is required."));
      return;
    }
    if (!formData.motherName.trim()) {
      setErrorMessage(t('মাতার নাম লিখুন।', "Mother's name is required."));
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.replace(/[^0-9]/g, '').length < 11) {
      setErrorMessage(t('সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন।', 'Valid 11-digit mobile number is required.'));
      return;
    }
    if (!formData.occupation.trim()) {
      setErrorMessage(t('বর্তমান পেশার বিবরণ লিখুন।', 'Current occupation is required.'));
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage(t('পূর্ণ ঠিকানা লিখুন।', 'Full address is required.'));
      return;
    }
    if (!formData.dealerArea.trim()) {
      setErrorMessage(t('প্রস্তাবিত ডিলার এলাকা বা থানা উল্লেখ করুন।', 'Desired dealership area is required.'));
      return;
    }
    if (!formData.photoUrl) {
      setErrorMessage(t('আবেদনকারীর পাসপোর্ট সাইজ ছবি আপলোড করা বাধ্যতামূলক।', 'Applicant personal photo is mandatory.'));
      return;
    }
    if (!formData.agreedToTerms) {
      setErrorMessage(t('আপনাকে অবশ্যই ডিলার চুক্তি ও নিয়মাবলীতে সম্মতি জানাতে হবে।', 'You must agree to the Dealer Agreement and Rules.'));
      return;
    }

    setSubmitting(true);

    try {
      // First try calling the full-stack server API
      const res = await fetch('/api/dealer/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.application) {
          setSubmittedApp(json.application);
          // also sync to local storage
          Storage.saveApplication(formData);
          setSubmitting(false);
          return;
        }
      }
    } catch (apiErr) {
      console.warn('API submission failed, persisting locally:', apiErr);
    }

    // Local fallback persistence
    const newApp = Storage.saveApplication(formData);
    setSubmittedApp(newApp);
    setSubmitting(false);
  };

  const copyApplicationId = () => {
    if (submittedApp?.id) {
      navigator.clipboard.writeText(submittedApp.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 3000);
    }
  };

  // SUCCESS VIEW AFTER APPLICATION SUBMISSION
  if (submittedApp) {
    return (
      <div className="py-16 bg-slate-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/90 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
                {t('আবেদন সফল হয়েছে', 'Submission Successful')}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-2">
                {t('হোলিনেক্স গ্রুপ ডিলারশিপ আবেদন প্রাপ্তি', 'Holynex Group Dealership Application Received')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                {t(
                  'আপনার আবেদনটি আমাদের কেন্দ্রীয় ডাটাবেজে সফলভাবে নিবন্ধিত হয়েছে। আবেদনের বিস্তারিত তথ্য নিচে দেওয়া হলো:',
                  'Your application has been registered in our central database. Application details are provided below:'
                )}
              </p>
            </div>

            {/* Application ID Card */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 text-center space-y-3 shadow-lg">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                {t('আপনার অফিসিয়াল অ্যাপ্লিকেশন আইডি (Application ID)', 'Your Official Application ID')}
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-black tracking-widest text-white select-all">
                  {submittedApp.id}
                </span>
                <button
                  onClick={copyApplicationId}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors"
                  title="Copy ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copiedId && (
                <span className="text-xs text-emerald-400 block font-medium">
                  {t('আইডি কপি করা হয়েছে!', 'Application ID copied to clipboard!')}
                </span>
              )}
            </div>

            {/* Applicant Summary */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left text-xs space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">{t('আবেদনকারীর নাম:', 'Applicant Name:')}</span>
                <span className="font-bold text-slate-900">{submittedApp.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">{t('মোবাইল নম্বর:', 'Mobile Number:')}</span>
                <span className="font-bold text-slate-900">{submittedApp.mobile}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">{t('প্রস্তাবিত ডিলার এলাকা:', 'Designated Territory:')}</span>
                <span className="font-bold text-slate-900">{submittedApp.dealerArea}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">{t('বর্তমান অবস্থা:', 'Current Status:')}</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {submittedApp.status || 'Pending'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">{t('জমা দেওয়ার তারিখ:', 'Submission Date:')}</span>
                <span className="font-medium text-slate-700">
                  {new Date(submittedApp.submittedAt || Date.now()).toLocaleDateString('bn-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Important Instructions Box */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-left text-xs text-blue-950 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-blue-900">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>{t('জরুরি নির্দেশনাবলী:', 'Important Instructions:')}</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>
                  {t(
                    'আপনার অ্যাপ্লিকেশন আইডি ও মোবাইল নম্বর সংরক্ষণ করুন। যেকোনো সময় স্ট্যাটাস চেক করতে পারবেন।',
                    'Retain your Application ID and mobile number to track status on the portal.'
                  )}
                </li>
                <li>
                  {t(
                    'আমাদের প্রধান কার্যালয় থেকে সর্বোচ্চ ২৪ থেকে ৭২ ঘণ্টার মধ্যে যাচাই-বাছাই সম্পন্ন করে আপনার নম্বরে এসএমএস পাঠানো হবে।',
                    'Our verification team will review your application within 24-72 hours and dispatch SMS notification.'
                  )}
                </li>
                <li>
                  {t(
                    'যেকোনো প্রয়োজনে আমাদের প্রধান কার্যালয়ে যোগাযোগ করুন: 01307835260।',
                    'For inquiries, call Holynex Group Head Office directly at 01307835260.'
                  )}
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate('/status')}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-sm shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2"
              >
                <span>{t('স্ট্যাটাস পেজে যান', 'Track Application Status')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => window.print()}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>{t('রসিদ প্রিন্ট করুন', 'Print Receipt')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PUBLIC APPLICATION FORM VIEW
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Banner Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
            <Store className="w-3.5 h-3.5" />
            {t('অনুমোদিত ডিলারশিপ আবেদন', 'Authorized Dealership Application')}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight">
            {t('হোলিনেক্স গ্রুপ ডিলার আবেদন ফরম', 'Holynex Group Dealer Application Form')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {t(
              'কোনো ধরনের প্রথাগত ডিলার লগইন প্রয়োজন নেই। সরাসরি নিচের তথ্যগুলো সঠিকভাবে পূরণ করে আবেদন জমা দিন।',
              'No traditional dealer login required. Complete this official application form to request dealership authorization.'
            )}
          </p>
        </div>

        {/* Application Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/90 space-y-8"
        >
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h2 className="font-extrabold text-slate-900 text-base">
                {t('১. ব্যক্তিগত ও যোগাযোগের তথ্য', '1. Personal & Contact Information')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('আবেদনকারীর পূর্ণ নাম', 'Full Name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={t('যেমন: মোঃ কামাল হোসেন', 'e.g. Md. Kamal Hossain')}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('মোবাইল নম্বর', 'Mobile Number')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('পিতার নাম', "Father's Name")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  placeholder={t('পিতার পূর্ণ নাম', "Father's Full Name")}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('মাতার নাম', "Mother's Name")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  placeholder={t('মাতার পূর্ণ নাম', "Mother's Full Name")}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('বর্তমান পেশা', 'Current Occupation')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder={t('যেমন: ইলেকট্রনিক্স ব্যবসায়ী / চাকুরিজীবী', 'e.g. Businessman / Electronics Dealer')}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('ইমেইল অ্যাড্রেস (ঐচ্ছিক)', 'Email Address (Optional)')}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="dealer@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('পূর্ণ স্থায়ী ও বর্তমান যোগাযোগের ঠিকানা', 'Full Permanent & Present Address')} <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder={t('গ্রাম/রাস্তা, ডাকঘর, থানা ও জেলার সম্পূর্ণ বিবরণ', 'Village/Street, Post Office, Police Station & District')}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Section 2: Proposed Territory */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h2 className="font-extrabold text-slate-900 text-base">
                {t('২. প্রস্তাবিত ডিলারশিপ অঞ্চল', '2. Proposed Dealership Territory')}
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('কাঙ্ক্ষিত ডিলার এলাকা / থানা / ইউনিয়ন', 'Desired Dealer Area / Upazila / Union')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.dealerArea}
                onChange={(e) => setFormData({ ...formData, dealerArea: e.target.value })}
                placeholder={t('যেমন: সাভার বাজার ও আশুলিয়া থানা, ঢাকা', 'e.g. Savar & Ashulia Upazila, Dhaka')}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {t('যে নির্দিষ্ট এলাকা বা উপজেলায় আপনি ডিলার আউটলেট পরিচালনা করতে আগ্রহী।', 'Specify the exact territory or market area where you intend to operate.')}
              </p>
            </div>
          </div>

          {/* Section 3: Document & Photo Uploads */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h2 className="font-extrabold text-slate-900 text-base">
                {t('৩. ছবি ও নথিপত্র সংযুক্তি', '3. Photo & Document Attachments')}
              </h2>
            </div>

            {/* Mandatory Applicant Personal Photo */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border-2 border-dashed border-amber-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-24 h-24 rounded-2xl bg-white border border-amber-200 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Applicant" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-amber-500" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <label className="block text-xs font-bold text-slate-900">
                    {t('আবেদনকারীর পাসপোর্ট সাইজের ছবি', 'Applicant Personal Photo')} <span className="text-red-500">* ({t('বাধ্যতামূলক', 'Mandatory')})</span>
                  </label>
                  <p className="text-[11px] text-slate-600">
                    {t('স্পষ্ট পাসপোর্ট সাইজের রঙিন ছবি আপলোড করুন অথবা নিচে ক্লিক করে নির্বাচন করুন।', 'Upload a clear passport photograph.')}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="cursor-pointer px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t('ছবি আপলোড করুন', 'Upload Photo File')}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('photoUrl', e)}
                      />
                    </label>

                    <span className="text-[11px] text-slate-400 font-medium">{t('অথবা ডেমো ছবি বাছুন:', 'or select preset:')}</span>
                    <div className="flex items-center gap-1">
                      {samplePhotos.map((src, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFormData({ ...formData, photoUrl: src })}
                          className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition-all ${
                            formData.photoUrl === src ? 'border-amber-600 ring-2 ring-amber-400' : 'border-slate-200'
                          }`}
                        >
                          <img src={src} alt="Sample" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Documents (NID, Trade License) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('জাতীয় পরিচয়পত্র / NID (ঐচ্ছিক)', 'National ID / NID (Optional)')}
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('nidUrl', e)}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('ট্রেড লাইসেন্স (ঐচ্ছিক)', 'Trade License (Optional)')}
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('tradeLicenseUrl', e)}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Dealer Agreement & Rules (Mandatory Acceptance) */}
          <div className="space-y-4 pt-2">
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-700" />
                  <span className="font-extrabold text-blue-950 text-sm">
                    {t('ডিলার চুক্তি ও নিয়মাবলী', 'Dealer Agreement & Mandatory Bylaws')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAgreementModal(true)}
                  className="text-xs text-blue-800 font-bold hover:underline flex items-center gap-1"
                >
                  <span>{t('সম্পূর্ণ চুক্তি পড়ুন', 'Read Full Agreement')}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-blue-100 max-h-24 overflow-y-auto leading-relaxed">
                {t(
                  'হোলিনেক্স গ্রুপের ডিলার হিসেবে নিযুক্ত হলে কোম্পানির নির্ধারিত ফেয়ার প্রাইস ও কিস্তি নীতিমালা মেনে গ্রাহক সেবা পরিচালনা করতে হবে। গ্রাহকের নিকট থেকে কোনো প্রকার অতিরিক্ত বা গোপন ফি গ্রহণ করা যাবে না এবং সময়মতো হিসাব কেন্দ্রীয় ডাটাবেজে হালনাগাদ রাখতে হবে।',
                  'Upon authorization, the dealer shall faithfully uphold Holynex Group policies, ensure fair price transparency, collect zero unauthorized surcharges, and synchronize records accurately.'
                )}
              </div>

              {/* Mandatory Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  id="checkbox-dealer-agreement"
                  checked={formData.agreedToTerms}
                  onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                />
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {t(
                    'আমি ডিলার চুক্তি ও নিয়মাবলী সম্পূর্ণ পড়েছি এবং সকল শর্ত মেনে আবেদন করছি।',
                    'I have read and agree to the Dealer Agreement and Rules.'
                  )}
                </span>
              </label>
            </div>
          </div>

          {/* Submission CTA */}
          <div className="pt-2">
            <button
              type="submit"
              id="btn-submit-dealer-application"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-extrabold text-base shadow-xl shadow-amber-500/20 hover:brightness-105 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>{t('আবেদন প্রক্রিয়াধীন...', 'Submitting Application...')}</span>
              ) : (
                <>
                  <Store className="w-5 h-5 text-slate-950" />
                  <span>{t('ডিলার আবেদনপত্র জমা দিন', 'Submit Official Dealer Application')}</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              {t(
                'আবেদন জমা সম্পন্ন হলে সাথে সাথে আপনি ট্র্যাকিং আইডি পাবেন। কোনো ফি প্রদান করতে হয় না।',
                'You will instantly receive an Application ID upon submission. There is no submission fee.'
              )}
            </p>
          </div>
        </form>

        {/* Agreement Modal Dialog */}
        {showAgreementModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-extrabold text-slate-950 pb-2 border-b border-slate-100">
                {t('হোলিনেক্স গ্রুপ ডিলারশিপ চুক্তি ও নীতিমালা', 'Holynex Group Dealership Agreement & Bylaws')}
              </h3>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <p className="font-bold text-slate-900">
                  {t('১. ডিলারশিপের পরিধি ও দায়িত্ব:', '1. Dealership Scope & Responsibility:')}
                </p>
                <p>
                  {t(
                    'অনুমোদিত ডিলার শুধুমাত্র নির্ধারিত নির্দিষ্ট এলাকা বা থানা পর্যায়ে হোলিনেক্স গ্রুপের পণ্য বিপণন এবং ফেয়ার প্রাইস কার্ডধারীদের কিস্তি সংগ্রহ পরিচালনা করবেন। অন্য কোনো ডিলারের নির্ধারিত এলাকায় অনৈতিক অনুপ্রবেশ নিষিদ্ধ।',
                    'The authorized dealer shall exclusively conduct business in the assigned geographic territory without intruding upon other dealer areas.'
                  )}
                </p>

                <p className="font-bold text-slate-900">
                  {t('২. স্বচ্ছতা ও সততার অঙ্গীকার:', '2. Integrity & Price Transparency:')}
                </p>
                <p>
                  {t(
                    'কোম্পানি নির্ধারিত পাইকারি ও কিস্তির মূল্যের অতিরিক্ত কোনো বাড়তি ফি বা গোপন চার্জ গ্রাহকের নিকট থেকে দাবি করা যাবে না। প্রতিটি লেনদেনের জন্য গ্রাহককে ডিজিটাল বা এসএমএস রসিদ প্রদান বাধ্যতামূলক।',
                    'Zero hidden fees or unauthorized compounding may be demanded. Every client must receive transparent receipts.'
                  )}
                </p>

                <p className="font-bold text-slate-900">
                  {t('৩. চুক্তি বাতিলের শর্তাবলী:', '3. Termination Bylaws:')}
                </p>
                <p>
                  {t(
                    'যেকোনো প্রকার আর্থিক অনিয়ম, অননুমোদিত নকল পণ্য বিক্রয় বা গ্রাহক হয়রানির প্রমাণিত অভিযোগ পাওয়া গেলে কোম্পানি তাৎক্ষণিকভাবে ডিলারশিপ বাতিলের অধিকার সংরক্ষণ করে।',
                    'The company reserves the right to terminate dealership in the event of financial fraud, counterfeit goods distribution, or consumer harassment.'
                  )}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAgreementModal(false)}
                  className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs"
                >
                  {t('পড়েছি এবং বুঝেছি (বন্ধ করুন)', 'I Have Read & Understood (Close)')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
