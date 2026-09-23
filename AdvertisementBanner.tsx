import React, { useState, useEffect } from 'react';
import { Storage } from '../../lib/storage';
import { AdvertisementItem, AdSlotId } from '../../types';
import { ExternalLink, Megaphone } from 'lucide-react';

interface AdvertisementBannerProps {
  slotId: AdSlotId;
  className?: string;
  fallbackText?: string;
}

export const AdvertisementBanner: React.FC<AdvertisementBannerProps> = ({
  slotId,
  className = '',
  fallbackText,
}) => {
  const [ad, setAd] = useState<AdvertisementItem | null>(null);

  useEffect(() => {
    // 1. Fetch active ad for this slot
    const activeAds = Storage.getAdvertisementsBySlot(slotId);
    if (activeAds.length > 0) {
      // Pick the highest priority active ad
      const topAd = activeAds[0];
      setAd(topAd);
      // Increment impression
      Storage.incrementAdImpression(topAd.id);
    } else {
      setAd(null);
    }
  }, [slotId]);

  if (!ad) {
    if (!fallbackText) return null;
    return (
      <div className={`p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-center text-xs text-slate-500 ${className}`}>
        {fallbackText}
      </div>
    );
  }

  const handleClick = () => {
    Storage.incrementAdClick(ad.id);
    if (ad.destinationUrl) {
      window.open(ad.destinationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-md cursor-pointer transition-all hover:border-amber-500/50 hover:shadow-amber-500/10 ${className}`}
    >
      <div className="absolute top-2 right-2 z-10">
        <span className="px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur border border-slate-700 text-[10px] font-bold text-slate-400 flex items-center gap-1 group-hover:text-amber-400">
          <Megaphone className="w-2.5 h-2.5" />
          <span>Sponsored</span>
        </span>
      </div>

      {ad.imageUrl ? (
        <div className="relative w-full h-full min-h-[90px] flex items-center">
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-full object-cover max-h-[160px] transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-end p-4">
            <div className="flex items-center justify-between w-full">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {ad.companyName}
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {ad.title}
                </h4>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-300 group-hover:text-white shrink-0 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-700">
                <span>বিস্তারিত</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      ) : ad.htmlCode ? (
        <div
          dangerouslySetInnerHTML={{ __html: ad.htmlCode }}
          className="p-4 text-center text-xs text-white"
        />
      ) : (
        <div className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              {ad.companyName}
            </span>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              {ad.title}
            </h4>
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-400 group-hover:text-amber-300 shrink-0">
            <span>দেখুন</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      )}
    </div>
  );
};
