import React from 'react';
import { useLanguage } from '../../lib/languageContext';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

interface LegalViewProps {
  type: 'terms' | 'privacy';
  navigate: (path: string) => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ type, navigate }) => {
  const { t } = useLanguage();

  const isTerms = type === 'terms';

  return (
    <div className="py-14 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            {isTerms ? t('ব্যবহারের শর্তাবলী', 'Terms of Service') : t('গোপনীয়তা নীতিমালা', 'Privacy Policy')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            {isTerms
              ? t('হোলিনেক্স গ্রুপ সেবার শর্তাবলী ও কিস্তি নীতিমালা', 'Holynex Group Terms of Service & Installment Rules')
              : t('গ্রাহক তথ্যের নিরাপত্তা ও গোপনীয়তা নীতি', 'Holynex Group Customer Privacy & Data Protection')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('সর্বশেষ হালনাগাদ: জানুয়ারি ২০২৬', 'Last updated: January 2026')}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200/90 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {isTerms ? (
            <>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{t('১. ফেয়ার প্রাইস কার্ডের ব্যবহার ও মেয়াদ', '1. Fair Price Card Validity')}</h3>
                <p>
                  {t(
                    'হোলিনেক্স ফেয়ার প্রাইস কার্ড শুধুমাত্র নিবন্ধিত কার্ডধারী এবং তার পরিবারের ব্যক্তিবর্গ ব্যবহার করতে পারবেন। এটি কোনো তৃতীয় পক্ষের কাছে হস্তান্তর বা বিক্রিযোগ্য নয়।',
                    'The Holynex Fair Price Card is non-transferable and strictly intended for verified cardholders and their immediate household.'
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{t('২. কিস্তির সময়সূচি ও পরিশোধ মাধ্যম', '2. Installment Schedule & Payment')}</h3>
                <p>
                  {t(
                    'প্রতি মাসের নির্দিষ্ট তারিখের মধ্যে কিস্তির অর্থ অনুমোদিত ডিলার পয়েন্ট বা সরাসরি কোম্পানির ডিজিটাল ব্যাংক চ্যানেলে পরিশোধ করতে হবে। কোনো কারণে কিস্তি বিলম্বিত হলে পূর্বে ডিলার বা প্রধান কার্যালয়কে অবহিত করতে হবে।',
                    'Monthly installments must be settled on or before the due date through authorized dealer points or direct corporate channels.'
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{t('৩. ওয়ারেন্টি ও সার্ভিসিং নীতিমালা', '3. Warranty Servicing')}</h3>
                <p>
                  {t(
                    'পণ্যের অপব্যবহার, অতিরিক্ত ভোল্টেজ বা অননুমোদিত মেকানিক দ্বারা মেরামতের কারণে সৃষ্ট কোনো ত্রুটির জন্য অফিসিয়াল ওয়ারেন্টি প্রযোজ্য হবে না। মূল ওয়ারেন্টি কার্ড সংরক্ষণ করা আবশ্যক।',
                    'Physical damage or tampering by unauthorized technicians nullifies manufacturer warranty. Keep your original warranty receipt safe.'
                  )}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{t('১. ব্যক্তিগত তথ্যের সংগ্রহ ও ব্যবহার', '1. Information Collection')}</h3>
                <p>
                  {t(
                    'আমরা ডিলার আবেদন ও ফেয়ার প্রাইস কার্ড নিবন্ধনের সময় কেবল প্রয়োজনীয় তথ্য (নাম, এনআইডি, মোবাইল নম্বর, ছবি ও ঠিকানা) সংগ্রহ করি। এই তথ্য কেবল আপনার আবেদন যাচাই ও সেবা নিশ্চিত করার জন্য ব্যবহার করা হয়।',
                    'We strictly collect necessary demographic details solely to verify identity, process dealership approvals, and administer installment records.'
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{t('২. তথ্যের নিরাপত্তা ও গোপনীয়তা', '2. Data Protection')}</h3>
                <p>
                  {t(
                    'আপনার কোনো ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বাণিজ্যিক উদ্দেশ্যে বিক্রি বা উন্মুক্ত করা হয় না। আমাদের সার্ভারে এনক্রিপ্ট করা ডিজিটাল ডাটাবেজের মাধ্যমে তথ্য সুরক্ষিত রাখা হয়।',
                    'Your personal data is never sold or shared with third parties for commercial advertising. Information is stored in encrypted enterprise databases.'
                  )}
                </p>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {t('প্রশ্ন বা সহায়তার জন্য যোগাযোগ করুন: 01307835260', 'For queries contact: 01307835260')}
            </span>
            <button
              onClick={() => navigate('/')}
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              {t('হোম পেইজে ফিরুন', 'Back to Home')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
