import React from 'react';
import { useLanguage } from '../../lib/languageContext';
import { FileCheck, ShieldCheck, Printer, ArrowRight, Store, CheckCircle2 } from 'lucide-react';

interface DealerAgreementViewProps {
  navigate: (path: string) => void;
}

export const DealerAgreementView: React.FC<DealerAgreementViewProps> = ({ navigate }) => {
  const { t } = useLanguage();

  return (
    <div className="py-14 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <FileCheck className="w-3.5 h-3.5" />
              {t('অফিসিয়াল নীতিমালা ও শর্তাবলী', 'Official Bylaws & Terms')}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              {t('হোলিনেক্স গ্রুপ ডিলারশিপ চুক্তি ও আচরণবিধি', 'Holynex Group Dealer Agreement & Code of Conduct')}
            </h1>
          </div>

          <button
            onClick={() => window.print()}
            className="self-start sm:self-auto px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-all flex items-center gap-2 shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{t('চুক্তি প্রিন্ট করুন', 'Print Agreement')}</span>
          </button>
        </div>

        {/* Agreement Content Paper */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200/90 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Clause 1 */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {t('১. ভূমিকা ও উদ্দেশ্য', '1. Preamble & Scope')}
            </h3>
            <p>
              {t(
                'এই চুক্তিটি হোলিনেক্স গ্রুপ (প্রথম পক্ষ) এবং অনুমোদিত আবেদনকারী ডিলার (দ্বিতীয় পক্ষ) এর মধ্যে পারস্পরিক বিশ্বাস, স্বচ্ছতা ও ব্যবসায়িক লক্ষ্য পূরণের উদ্দেশ্যে সম্পাদিত হলো। এই চুক্তির মূল লক্ষ্য হলো সাধারণ ভোক্তার কাছে ন্যায্য মূল্যে এবং সহজ কিস্তিতে আসল পণ্য পৌঁছে দেওয়া।',
                'This Agreement is entered into between Holynex Group ("First Party") and the Authorized Dealer ("Second Party") to advance transparent commerce and ethical installment distribution.'
              )}
            </p>
          </div>

          {/* Clause 2 */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              {t('২. ভৌগোলিক এলাকা ও একচ্ছত্র অধিকার', '2. Territorial Allotment')}
            </h3>
            <p>
              {t(
                'কোম্পানি কর্তৃক ডিলারকে নির্ধারিত থানা বা ভৌগোলিক সীমানায় হোলিনেক্স গ্রুপের পণ্য বিপণন এবং ফেয়ার প্রাইস কার্ড সেবার দায়িত্ব অর্পণ করা হলো। ডিলার কোনো অবস্থাতেই অন্য অনুমোদিত ডিলারের আওতাভুক্ত এলাকায় অনৈতিকভাবে ব্যবসায়িক হস্তক্ষেপ করতে পারবেন না।',
                'The Second Party is granted authorization strictly within the designated upazila or municipal boundaries. Direct unauthorized encroachment into adjacent territories is strictly prohibited.'
              )}
            </p>
          </div>

          {/* Clause 3 */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              {t('৩. ফেয়ার প্রাইস কার্ড ও কিস্তি ব্যবস্থাপনা', '3. Fair Price Card & Installment Protocol')}
            </h3>
            <p>
              {t(
                'ডিলার গ্রাহকের নিকট থেকে কেবল কোম্পানি কর্তৃক অনুমোদিত নির্ধারিত ডাউন পেমেন্ট ও মাসিক কিস্তির অর্থ গ্রহণ করতে পারবেন। গ্রাহকের কাছে কোনো বাড়তি গোপন চার্জ, অতিরিক্ত প্রসেসিং ফি বা কমিশন দাবি করা দণ্ডনীয় অপরাধ বলে গণ্য হবে। প্রতিটি জমার সাথে সাথে সফটওয়্যারে এন্ট্রি দিতে হবে এবং গ্রাহককে এসএমএস রসিদ প্রদান নিশ্চিত করতে হবে।',
                'The Second Party shall collect only company-mandated down payments and installment dues. Demanding unauthorized surcharges or commissions constitutes immediate grounds for contract revocation.'
              )}
            </p>
          </div>

          {/* Clause 4 */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              {t('৪. পণ্য সরবরাহ ও ওয়ারেন্টি দায়িত্ব', '4. Inventory Logistics & Warranty Fulfillment')}
            </h3>
            <p>
              {t(
                'হোলিনেক্স গ্রুপ প্রতিটি পণ্যের ১০০% জেনুইন ব্র্যান্ড ও প্রস্তুতকারক ওয়ারেন্টি নিশ্চিত করে। ডিলার ত্রুটিপূর্ণ বা ক্ষতিগ্রস্ত পণ্য কোনো গ্রাহকের কাছে হস্তান্তর করতে পারবেন না এবং পণ্য সরবরাহের সময় পূর্ণ ওয়্যারেন্টি কার্ড পূরণ করে গ্রাহককে বুঝিয়ে দিতে হবে।',
                'Holynex Group guarantees 100% genuine brand warranty on all dispatched units. The Second Party must thoroughly inspect products prior to customer handover.'
              )}
            </p>
          </div>

          {/* Clause 5 */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              {t('৫. চুক্তি বাতিল ও নিরাপত্তা জামানত', '5. Termination & Security Deposits')}
            </h3>
            <p>
              {t(
                'যেকোনো পক্ষ ৩০ (ত্রিশ) দিনের লিখিত নোটিশ দিয়ে এই চুক্তি সমাপ্ত করতে পারবে। তবে ডিলার আর্থিক অনিয়ম, জালিয়াতি, নকল পণ্য বিক্রয় বা গুরুতর শৃঙ্খলাভঙ্গে লিপ্ত হলে কোম্পানি তাৎক্ষণিকভাবে চুক্তি বাতিল এবং আইনানুগ ব্যবস্থা গ্রহণের পূর্ণ অধিকার সংরক্ষণ করে।',
                'Either party may terminate this agreement with 30 days written notice. In cases of financial malfeasance or brand misrepresentation, Holynex Group reserves right of immediate termination.'
              )}
            </p>
          </div>

          {/* Signature Box Preview */}
          <div className="pt-8 border-t-2 border-dashed border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="space-y-8">
              <div className="h-10 border-b border-slate-400"></div>
              <span className="font-bold text-slate-800 block">{t('প্রথম পক্ষের স্বাক্ষর ও সিল (হোলিনেক্স গ্রুপ)', 'First Party Signature (Holynex Group)')}</span>
            </div>
            <div className="space-y-8">
              <div className="h-10 border-b border-slate-400"></div>
              <span className="font-bold text-slate-800 block">{t('দ্বিতীয় পক্ষের স্বাক্ষর (আবেদনকারী ডিলার)', 'Second Party Signature (Applicant Dealer)')}</span>
            </div>
          </div>
        </div>

        {/* CTA to Apply */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base text-white">{t('চুক্তি মেনে ডিলার হিসেবে আবেদন করতে প্রস্তুত?', 'Ready to apply under these terms?')}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{t('অনলাইনে মাত্র ৫ মিনিটে প্রয়োজনীয় তথ্য দিয়ে আবেদনপত্র জমা দিন।', 'Submit your digital dealer application form in under 5 minutes.')}</p>
          </div>

          <button
            onClick={() => navigate('/dealer-application')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow hover:brightness-105 transition-all flex items-center gap-2 shrink-0"
          >
            <Store className="w-4 h-4 text-slate-950" />
            <span>{t('ডিলার আবেদন ফরম খুলুন', 'Open Application Form')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
