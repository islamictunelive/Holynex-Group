import React, { useState } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { SlideItem } from '../../types';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  Save,
  X,
  Eye,
  Layers,
} from 'lucide-react';

interface AdminSlidesTabProps {
  onRefresh: () => void;
}

export const AdminSlidesTab: React.FC<AdminSlidesTabProps> = ({ onRefresh }) => {
  const { t } = useLanguage();
  const [slides, setSlides] = useState<SlideItem[]>(() => Storage.getSlides());
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SlideItem | null>(null);

  const [formData, setFormData] = useState({
    titleBn: '',
    titleEn: '',
    subtitleBn: '',
    subtitleEn: '',
    image: '',
    ctaTextBn: '',
    ctaTextEn: '',
    ctaLink: '/dealer-application',
    active: true,
  });

  const [feedback, setFeedback] = useState('');

  const refreshList = () => {
    setSlides(Storage.getSlides());
    onRefresh();
  };

  const openCreateModal = () => {
    setEditingSlide(null);
    setFormData({
      titleBn: '',
      titleEn: '',
      subtitleBn: '',
      subtitleEn: '',
      image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1600&q=80',
      ctaTextBn: 'ডিলার আবেদন করুন',
      ctaTextEn: 'Apply for Dealership',
      ctaLink: '/dealer-application',
      active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (slide: SlideItem) => {
    setEditingSlide(slide);
    setFormData({
      titleBn: slide.titleBn,
      titleEn: slide.titleEn,
      subtitleBn: slide.subtitleBn,
      subtitleEn: slide.subtitleEn,
      image: slide.image,
      ctaTextBn: slide.ctaTextBn || '',
      ctaTextEn: slide.ctaTextEn || '',
      ctaLink: slide.ctaLink || '/dealer-application',
      active: slide.active !== false,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const slideObj: SlideItem = {
      id: editingSlide ? editingSlide.id : `slide-${Date.now()}`,
      titleBn: formData.titleBn,
      titleEn: formData.titleEn,
      subtitleBn: formData.subtitleBn,
      subtitleEn: formData.subtitleEn,
      image: formData.image,
      ctaTextBn: formData.ctaTextBn,
      ctaTextEn: formData.ctaTextEn,
      ctaLink: formData.ctaLink,
      active: formData.active,
    };

    Storage.saveSlide(slideObj);

    try {
      if (editingSlide) {
        await fetch(`/api/admin/slides/${editingSlide.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slideObj),
        });
      } else {
        await fetch('/api/admin/slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slideObj),
        });
      }
    } catch {}

    setFeedback(
      editingSlide
        ? t('স্লাইড সফলভাবে আপডেট করা হয়েছে', 'Slide updated successfully')
        : t('নতুন স্লাইড যুক্ত করা হয়েছে', 'New slide added successfully')
    );
    setShowModal(false);
    refreshList();
    setTimeout(() => setFeedback(''), 3500);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('আপনি কি নিশ্চিত এই স্লাইডারটি মুছে ফেলতে চান?', 'Delete this banner slide?'))) return;

    Storage.deleteSlide(id);
    try {
      await fetch(`/api/admin/slides/${id}`, { method: 'DELETE' });
    } catch {}

    refreshList();
    setFeedback(t('স্লাইড মুছে ফেলা হয়েছে', 'Slide deleted'));
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              {t('ওয়েবসাইট ব্যানার ও স্লাইডার নিয়ন্ত্রণ', 'Hero Banners & Sliders Management')}
            </h2>
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
              {slides.length} {t('টি স্লাইড', 'Slides')}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {t(
              'হোমপেজের মূল হিরো ব্যানার, শিরোনাম, বিবরণ এবং অ্যাকশন বাটন সহজে পরিবর্তন করুন।',
              'Update hero slider images, titles, promotional captions, and call-to-action buttons.'
            )}
          </p>
        </div>

        <button
          id="btn-add-hero-slide"
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t('নতুন ব্যানার স্লাইড যোগ করুন', 'Add New Banner Slide')}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Slides Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Image banner preview */}
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.titleEn}
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-md border border-white/20">
                  #{index + 1} {t('স্লাইড', 'Slide')}
                </span>
                <span
                  className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${
                    slide.active !== false
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-500 text-slate-100'
                  }`}
                >
                  {slide.active !== false ? t('লাইভ', 'Active') : t('স্থগিত', 'Draft')}
                </span>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-bold text-base line-clamp-1">{slide.titleBn}</h4>
                  <p className="text-xs text-amber-300 line-clamp-1">{slide.titleEn}</p>
                </div>
              </div>

              {/* Text content */}
              <div className="p-4 space-y-2">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {slide.subtitleBn || slide.subtitleEn}
                </p>

                {slide.ctaTextBn && (
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <span className="font-semibold text-slate-700">{slide.ctaTextBn}</span>
                    <span className="font-mono text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {slide.ctaLink}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(slide)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{t('সম্পাদনা', 'Edit')}</span>
              </button>
              <button
                onClick={() => handleDelete(slide.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('মুছুন', 'Delete')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900">
                  {editingSlide ? t('ব্যানার স্লাইড সম্পাদনা করুন', 'Edit Banner Slide') : t('নতুন ব্যানার স্লাইড তৈরি করুন', 'Create Banner Slide')}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('প্রধান শিরোনাম (বাংলা) *', 'Title (Bengali) *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleBn}
                    onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                    placeholder="হোলিনেক্স ফেয়ার প্রাইস কার্ড ও সহজ কিস্তি"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('প্রধান শিরোনাম (English) *', 'Title (English) *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="Holynex Fair Price Card & Installment Facilities"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('উপ-শিরোনাম / বিবরণ (বাংলা)', 'Subtitle (Bengali)')}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.subtitleBn}
                    onChange={(e) => setFormData({ ...formData, subtitleBn: e.target.value })}
                    placeholder="নূন্যতম ডাউনপেমেন্টে সহজ মাসিক কিস্তিতে প্রয়োজনীয় সামগ্রী গ্রহণ করুন"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('উপ-শিরোনাম / বিবরণ (English)', 'Subtitle (English)')}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.subtitleEn}
                    onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                    placeholder="Empowering households across Bangladesh with reliable installment plans"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('ব্যানার ছবির লিংক (Image URL) *', 'Banner Image URL *')}
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
                {formData.image && (
                  <div className="mt-2 h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                    <img
                      src={formData.image}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('বাটন টেক্সট (বাংলা)', 'Button Text (BN)')}
                  </label>
                  <input
                    type="text"
                    value={formData.ctaTextBn}
                    onChange={(e) => setFormData({ ...formData, ctaTextBn: e.target.value })}
                    placeholder="ডিলার আবেদন"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('বাটন টেক্সট (EN)', 'Button Text (EN)')}
                  </label>
                  <input
                    type="text"
                    value={formData.ctaTextEn}
                    onChange={(e) => setFormData({ ...formData, ctaTextEn: e.target.value })}
                    placeholder="Apply Dealership"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('বাটন লিংক (Route/URL)', 'Button Link')}
                  </label>
                  <input
                    type="text"
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    placeholder="/dealer-application"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-slate-800">{t('স্লাইড সক্রিয় রাখুন', 'Active on Home')}</span>
                  <p className="text-[11px] text-slate-500">{t('বন্ধ করলে হোমপেজে এই ব্যানারটি দৃশ্যমান হবে না', 'Hide from carousel')}</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 rounded text-amber-500 focus:ring-amber-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSlide ? t('আপডেট সংরক্ষণ করুন', 'Save Changes') : t('স্লাইড সংরক্ষণ করুন', 'Create Slide')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
