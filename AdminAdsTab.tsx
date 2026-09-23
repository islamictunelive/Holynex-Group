import React, { useState } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { AdvertisementItem, AdSlotDefinition, AdSlotId } from '../../types';
import {
  Megaphone,
  Plus,
  Eye,
  MousePointerClick,
  Percent,
  Calendar,
  Layers,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Smartphone,
  Monitor,
  ShieldCheck,
  AlertCircle,
  Tag,
  Sparkles,
} from 'lucide-react';

export const AdminAdsTab: React.FC = () => {
  const { t } = useLanguage();
  const [adSlots, setAdSlots] = useState<AdSlotDefinition[]>(() => Storage.getAdSlots());
  const [advertisements, setAdvertisements] = useState<AdvertisementItem[]>(() => Storage.getAdvertisements());
  const [selectedSlotFilter, setSelectedSlotFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdvertisementItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<AdvertisementItem>>({
    companyName: '',
    title: '',
    slotId: 'AD_SLOT_01',
    type: 'image_banner',
    imageUrl: '',
    destinationUrl: '',
    htmlCode: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    priority: 8,
    showOnDesktop: true,
    showOnMobile: true,
    active: true,
  });

  const reloadData = () => {
    setAdSlots(Storage.getAdSlots());
    setAdvertisements(Storage.getAdvertisements());
  };

  const handleOpenCreate = (slotId?: AdSlotId) => {
    setEditingAd(null);
    setFormData({
      id: `AD-${Date.now().toString().slice(-6)}`,
      companyName: '',
      title: '',
      slotId: slotId || 'AD_SLOT_01',
      type: 'image_banner',
      imageUrl: '',
      destinationUrl: 'https://',
      htmlCode: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      priority: 8,
      showOnDesktop: true,
      showOnMobile: true,
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ad: AdvertisementItem) => {
    setEditingAd(ad);
    setFormData({ ...ad });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.title || !formData.slotId) {
      alert(t('কোম্পানির নাম, বিজ্ঞাপনের শিরোনাম এবং স্লট নির্বাচন আবশ্যক।', 'Company name, title and slot are required.'));
      return;
    }

    const adToSave: AdvertisementItem = {
      id: editingAd ? editingAd.id : formData.id || `AD-${Date.now().toString().slice(-6)}`,
      companyName: formData.companyName.trim(),
      title: formData.title.trim(),
      slotId: formData.slotId as AdSlotId,
      type: formData.type || 'image_banner',
      imageUrl: formData.imageUrl?.trim() || '',
      destinationUrl: formData.destinationUrl?.trim() || '',
      htmlCode: formData.htmlCode || '',
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate || '2026-12-31',
      priority: Number(formData.priority) || 5,
      showOnDesktop: formData.showOnDesktop !== false,
      showOnMobile: formData.showOnMobile !== false,
      active: formData.active !== false,
      impressions: editingAd ? editingAd.impressions : 0,
      clicks: editingAd ? editingAd.clicks : 0,
      createdAt: editingAd ? editingAd.createdAt : new Date().toISOString(),
    };

    Storage.saveAdvertisement(adToSave);
    reloadData();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(t(`আপনি কি নিশ্চিত যে "${title}" বিজ্ঞাপনটি ডিলিট করতে চান?`, `Are you sure to delete ad "${title}"?`))) {
      Storage.deleteAdvertisement(id);
      reloadData();
    }
  };

  const handleToggle = (id: string) => {
    Storage.toggleAdvertisementStatus(id);
    reloadData();
  };

  // Filtered ads
  const filteredAds = advertisements.filter((ad) => {
    if (selectedSlotFilter !== 'all' && ad.slotId !== selectedSlotFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        ad.companyName.toLowerCase().includes(q) ||
        ad.title.toLowerCase().includes(q) ||
        ad.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalImpressions = advertisements.reduce((acc, a) => acc + (a.impressions || 0), 0);
  const totalClicks = advertisements.reduce((acc, a) => acc + (a.clicks || 0), 0);
  const averageCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Megaphone className="w-4 h-4" />
            <span>৭টি কনফিগারেবল বিজ্ঞাপন স্লট ও পার্টনার প্রমোশন</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {t('বিজ্ঞাপন ও ব্যানার ব্যবস্থাপনা কনসোল', 'Corporate Advertisement & Banner Manager')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t(
              'ওয়েবসাইটের ৭টি নির্ধারিত স্লটে স্পনসর ব্যানার প্রদর্শন, সময়কাল, অগ্রাধিকার ও সিটিআর এনালাইটিক্স।',
              'Manage 7 dedicated promotional ad slots, rotation, schedule, click-through rates, and partners.'
            )}
          </p>
        </div>

        <button
          onClick={() => handleOpenCreate()}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন বিজ্ঞাপন যুক্ত করুন</span>
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>মোট সক্রিয় স্লট</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-white font-mono">{adSlots.length} টি</span>
          <span className="text-[11px] text-slate-500 block mt-1">হোমপেইজ, পণ্য ও ডিলার পেজ জুড়ে</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>বিজ্ঞাপন ক্যাম্পেইন</span>
            <Tag className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl font-black text-white font-mono">
            {advertisements.filter((a) => a.active).length} / {advertisements.length}
          </span>
          <span className="text-[11px] text-emerald-400 block mt-1">সক্রিয় ক্যাম্পেইন চলছে</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>সর্বমোট ইম্প্রেশন (Views)</span>
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-2xl font-black text-purple-400 font-mono">
            {totalImpressions.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">ভিজিটরদের সামনে প্রদর্শিত</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>ক্লিক ও গড় CTR</span>
            <MousePointerClick className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {totalClicks.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-amber-400 font-mono">({averageCTR}%)</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">ক্লিক-থ্রু রেট পারফরম্যান্স</span>
        </div>
      </div>

      {/* 7 Dedicated Slots Map & Quick Add */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>৭টি নির্ধারিত বিজ্ঞাপন স্লট আর্কিটেকচার</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {adSlots.map((slot) => {
            const slotAds = advertisements.filter((a) => a.slotId === slot.id && a.active);
            return (
              <div
                key={slot.id}
                className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold">
                      {slot.id}
                    </span>
                    <span className="text-[10px] text-slate-400">{slot.defaultDimensions}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{slot.nameBn}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{slot.locationDescriptionBn}</p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-semibold">{slotAds.length} টি সক্রিয় অ্যাড</span>
                  <button
                    onClick={() => handleOpenCreate(slot.id)}
                    className="text-amber-400 hover:text-amber-300 font-bold hover:underline"
                  >
                    + অ্যাড যোগ
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedSlotFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedSlotFilter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            সকল স্লট ({advertisements.length})
          </button>
          {adSlots.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSlotFilter(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSlotFilter === s.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {s.id}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="কোম্পানি বা শিরোনাম খুঁজুন..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Advertisements Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">ব্যানার ও বিবরণ</th>
                <th className="py-3 px-4">স্লট ও অবস্থান</th>
                <th className="py-3 px-4">পারফরম্যান্স (ইম্প্রেশন / ক্লিক)</th>
                <th className="py-3 px-4">সময়সীমা ও প্রায়োরিটি</th>
                <th className="py-3 px-4">ডিভাইস</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredAds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    কোনো বিজ্ঞাপন পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredAds.map((ad) => {
                  const impressions = ad.impressions || 0;
                  const clicks = ad.clicks || 0;
                  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
                  const slot = adSlots.find((s) => s.id === ad.slotId);

                  return (
                    <tr key={ad.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {ad.imageUrl ? (
                            <img
                              src={ad.imageUrl}
                              alt={ad.title}
                              className="w-16 h-10 object-cover rounded-lg border border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-10 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center text-[10px] text-slate-500 shrink-0">
                              HTML
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-white block line-clamp-1">{ad.title}</span>
                            <span className="text-[11px] text-amber-400 block">{ad.companyName}</span>
                            {ad.destinationUrl && (
                              <a
                                href={ad.destinationUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-slate-400 hover:text-white inline-flex items-center gap-1 mt-0.5"
                              >
                                <span>{ad.destinationUrl.replace(/^https?:\/\//, '')}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300 font-mono text-[10px] font-bold block w-fit">
                          {ad.slotId}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">{slot?.nameBn}</span>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <div className="space-y-0.5">
                          <div className="text-slate-300">
                            ইম্প্রেশন: <span className="font-bold text-purple-400">{impressions.toLocaleString()}</span>
                          </div>
                          <div className="text-slate-300">
                            ক্লিক: <span className="font-bold text-emerald-400">{clicks.toLocaleString()}</span>{' '}
                            <span className="text-[10px] text-amber-400">({ctr}%)</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-[11px] text-slate-300 space-y-0.5">
                          <div>শুরু: <span className="font-mono text-slate-400">{ad.startDate}</span></div>
                          <div>শেষ: <span className="font-mono text-slate-400">{ad.endDate}</span></div>
                          <div className="text-[10px] text-amber-400 font-bold">অগ্রাধিকার: {ad.priority}/10</div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          {ad.showOnDesktop && (
                            <span title="Desktop">
                              <Monitor className="w-3.5 h-3.5 text-blue-400" />
                            </span>
                          )}
                          {ad.showOnMobile && (
                            <span title="Mobile">
                              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggle(ad.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            ad.active
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {ad.active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{ad.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(ad)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                            title="সম্পাদনা"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(ad.id, ad.title)}
                            className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/20"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create / Edit Advertisement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto text-white p-6 sm:p-8 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-400" />
                <span>{editingAd ? 'বিজ্ঞাপন সম্পাদনা করুন' : 'নতুন বিজ্ঞাপন তৈরি করুন'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">কোম্পানির নাম (Sponsor Company)</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="যেমন: ইসলামী ব্যাংক বাংলাদেশ"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">নির্ধারিত অ্যাড স্লট (Slot)</label>
                  <select
                    value={formData.slotId}
                    onChange={(e) => setFormData({ ...formData, slotId: e.target.value as AdSlotId })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    {adSlots.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id} - {s.nameBn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">বিজ্ঞাপনের শিরোনাম / বার্তা</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="বিজ্ঞাপনের মূল হেডলাইন..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">ব্যানার ইমেজ URL (Image URL)</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">ক্লিক গন্তব্য URL (Destination Link)</label>
                <input
                  type="url"
                  value={formData.destinationUrl}
                  onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">শুরুর তারিখ</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">শেষের তারিখ</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">অগ্রাধিকার (১ - ১০)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-bold">ডিভাইস ভিজিবিলিটি:</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showOnDesktop}
                      onChange={(e) => setFormData({ ...formData, showOnDesktop: e.target.checked })}
                      className="rounded accent-amber-500"
                    />
                    <span>ডেস্কটপ</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showOnMobile}
                      onChange={(e) => setFormData({ ...formData, showOnMobile: e.target.checked })}
                      className="rounded accent-amber-500"
                    />
                    <span>মোবাইল</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded accent-amber-500"
                    />
                    <span className="text-emerald-400 font-bold">সক্রিয়</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
