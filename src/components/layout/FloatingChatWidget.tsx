import React, { useState } from 'react';
import { MessageSquare, X, Send, Phone, MessageCircle, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '../../lib/languageContext';

export const FloatingChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, t } = useLanguage();

  return (
    <div className="fixed bottom-6 right-5 sm:right-7 z-40">
      {/* Floating Popup Card */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[320px] sm:w-[350px] bg-slate-950 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 px-4 py-3 text-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-950/20 border border-slate-950/30 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">
                  {t('হোলিনেক্স গ্রাহক সহায়তা', 'Holynex Live Helpdesk')}
                </h4>
                <span className="text-[11px] font-semibold text-slate-900/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-pulse"></span>
                  {t('সরাসরি সক্রিয় • দ্রুত উত্তর', 'Online • Instant Support')}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-slate-950/10 hover:bg-slate-950/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-slate-950" />
            </button>
          </div>

          {/* Body Options */}
          <div className="p-4 space-y-3 text-white text-xs">
            <p className="text-slate-300 leading-relaxed">
              {t(
                'ফেয়ার প্রাইস কার্ড, কিস্তি সুবিধা বা ডিলারশিপ সংক্রান্ত যেকোনো জিজ্ঞাসায় আমাদের সাথে সরাসরি যোগাযোগ করুন।',
                'Connect directly with our team for queries on Fair Price Card, Installments, or Dealership.'
              )}
            </p>

            {/* WhatsApp Direct Action */}
            <a
              href="https://wa.me/8801307835260"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/60 transition-all text-emerald-300 font-semibold group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {t('হোয়াটসঅ্যাপে সরাসরি চ্যাট', 'WhatsApp Direct Chat')}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">01307835260</div>
                </div>
              </div>
              <Send className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Direct Call */}
            <a
              href="tel:01307835260"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-amber-500/30 hover:bg-slate-800 transition-all text-amber-300 font-semibold group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {t('অফিসিয়াল হটলাইনে কল করুন', 'Call Official Hotline')}
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono">01307835260</div>
                </div>
              </div>
              <Phone className="w-4 h-4 text-amber-400" />
            </a>

            {/* Corporate Info details */}
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{t('শনি - বৃহস্পতি: সকাল ৯:০০ - রাত ৯:০০', 'Sat - Thu: 9:00 AM - 9:00 PM')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{t('৭১২, কমিশনার রোড, জুরাইন, ঢাকা', '712, Commissioner Road, Jurain, Dhaka')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Trigger Button - Radiant Gold Button Matching Screenshot */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 text-slate-950 shadow-xl shadow-amber-500/35 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-2 border-amber-200"
        title="Chat / Support"
        aria-label="Open support chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-slate-950 stroke-[2.5]" />
        ) : (
          <div className="relative">
            <svg
              className="w-6 h-6 fill-slate-950"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.1 21.9l4.9-1.238C8.47 21.513 10.179 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-amber-300"></span>
          </div>
        )}
      </button>
    </div>
  );
};
