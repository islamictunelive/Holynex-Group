import React, { useState } from 'react';
import { NewsItem } from '../../types';
import { useLanguage } from '../../lib/languageContext';
import { Bell, Calendar, ChevronRight, FileText, ArrowLeft, Share2 } from 'lucide-react';

interface NewsViewProps {
  news: NewsItem[];
  navigate: (path: string) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({ news, navigate }) => {
  const { lang, t } = useLanguage();
  const [selectedNotice, setSelectedNotice] = useState<NewsItem | null>(null);

  return (
    <div className="py-14 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5" />
            {t('অফিসিয়াল বার্তা ও নোটিশ', 'Official Circulars & Notices')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            {t('সংবাদ ও কর্পোরেট নোটিশ বোর্ড', 'News & Corporate Notice Board')}
          </h1>
          <p className="text-sm text-slate-600">
            {t(
              'হোলিনেক্স গ্রুপের ডিলার নিয়োগ, ফেয়ার প্রাইস কার্ডের আপডেট এবং গুরুত্বপূর্ণ প্রাতিষ্ঠানিক নির্দেশনাবলী।',
              'Official announcements, regional dealer notifications, and policy directives from Holynex Group.'
            )}
          </p>
        </div>

        {/* Notice List */}
        <div className="space-y-4">
          {news.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedNotice(item)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:border-amber-500/40 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    {item.category || item.categoryBn || item.categoryEn || t('অফিসিয়াল নোটিশ', 'Notice')}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.date || Date.now()).toLocaleDateString('bn-BD', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                  {lang === 'bn' ? item.textBn : item.textEn}
                </h3>
              </div>

              <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
                <span>{t('বিস্তারিত পড়ুন', 'Read Full Notice')}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Single Notice Modal */}
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase">
                  {selectedNotice.category || selectedNotice.categoryBn || selectedNotice.categoryEn || t('অফিসিয়াল নোটিশ', 'Official Notice')}
                </span>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="text-xs text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕ {t('বন্ধ করুন', 'Close')}
                </button>
              </div>

              <div className="space-y-3">
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(selectedNotice.date || Date.now()).toLocaleDateString('bn-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <h3 className="text-xl font-extrabold text-slate-950 leading-snug">
                  {lang === 'bn' ? selectedNotice.textBn : selectedNotice.textEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                  {t(
                    'হোলিনেক্স গ্রুপের সম্মানিত সকল গ্রাহক, শুভানুধ্যায়ী ও অনুমোদিত ডিলারগণের অবগতির জন্য জানানো যাচ্ছে যে উপরোক্ত বিষয়ে কোম্পানি সর্বোচ্চ সতর্ক ও প্রতিশ্রুতিবদ্ধ। যেকোনো তথ্যের জন্য আমাদের প্রধান কার্যালয় (৭১২, কমিশনার রোড, জুরাইন, ঢাকা) অথবা হেল্পলাইন 01307835260 নম্বরে যোগাযোগ করুন।',
                    'All valued patrons, partners, and authorized territory dealers are kindly requested to take note of the aforementioned announcement. For further queries, please reach out to Holynex Group Head Office at 712, Commissioner Road, Jurain, Dhaka or call 01307835260.'
                  )}
                </p>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-slate-100 text-xs text-slate-500">
                <span>{t('হোলিনেক্স গ্রুপ ম্যানেজমেন্ট', 'Holynex Group Management')}</span>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                  {t('ঠিক আছে', 'Understood')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
