import React, { useState, useRef } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { ProductItem, AdminUser } from '../../types';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Upload,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface AdminProductsTabProps {
  currentUser: AdminUser | null;
  onRefresh: () => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  currentUser,
  onRefresh,
}) => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<ProductItem[]>(() => Storage.getProducts());
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    nameBn: '',
    nameEn: '',
    descBn: '',
    descEn: '',
    category: 'consumer',
    image: '',
    price: 3800,
    downPayment: 800,
    months: 3,
    monthly: 1000,
    badge: 'জনপ্রিয় নিত্যপণ্য',
  });

  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [feedback, setFeedback] = useState('');

  const refreshList = () => {
    setProducts(Storage.getProducts());
    onRefresh();
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({
      nameBn: '',
      nameEn: '',
      descBn: '',
      descEn: '',
      category: 'consumer',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      price: 3800,
      downPayment: 800,
      months: 3,
      monthly: 1000,
      badge: 'জনপ্রিয় নিত্যপণ্য',
    });
    setUploadMode('file');
    setShowModal(true);
  };

  const openEditModal = (prod: ProductItem) => {
    setEditingProduct(prod);
    setForm({
      nameBn: prod.nameBn,
      nameEn: prod.nameEn,
      descBn: prod.descBn,
      descEn: prod.descEn,
      category: prod.category,
      image: prod.image,
      price: prod.price,
      downPayment: prod.downPayment,
      months: prod.months,
      monthly: prod.monthly,
      badge: prod.badge || '',
    });
    setUploadMode(prod.image.startsWith('data:') ? 'file' : 'url');
    setShowModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ইমেজ ফাইল (JPG, PNG, WebP) নির্বাচন করুন');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setForm((prev) => ({ ...prev, image: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePriceChange = (price: number, downPayment: number, months: number) => {
    const principal = Math.max(0, price - downPayment);
    const calculatedMonthly = months > 0 ? Math.round(principal / months) : 0;
    setForm((prev) => ({
      ...prev,
      price,
      downPayment,
      months,
      monthly: calculatedMonthly,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const productObj: ProductItem = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      nameBn: form.nameBn,
      nameEn: form.nameEn,
      descBn: form.descBn,
      descEn: form.descEn,
      category: form.category,
      image: form.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      price: Number(form.price),
      downPayment: Number(form.downPayment),
      months: Number(form.months),
      monthly: Number(form.monthly),
      badge: form.badge,
    };

    Storage.saveProduct(productObj);

    try {
      if (editingProduct) {
        await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productObj),
        });
      } else {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productObj),
        });
      }
    } catch {}

    setFeedback(
      editingProduct
        ? t('পণ্য সফলভাবে আপডেট হয়েছে', 'Product updated successfully')
        : t('নতুন পণ্য সফলভাবে যুক্ত হয়েছে', 'New product added successfully')
    );
    setShowModal(false);
    refreshList();
    setTimeout(() => setFeedback(''), 3500);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('আপনি কি নিশ্চিত যে এই পণ্যটি ডিলিট করতে চান?', 'Are you sure you want to delete this product?'))) {
      return;
    }

    Storage.deleteProduct(id);

    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    } catch {}

    setFeedback(t('পণ্যটি সফলভাবে মুছে ফেলা হয়েছে', 'Product deleted successfully'));
    refreshList();
    setTimeout(() => setFeedback(''), 3500);
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategoryFilter === 'all') return true;
    return p.category === selectedCategoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Header info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 p-6 rounded-2xl border border-amber-500/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
              {t('পণ্য ক্যাটালগ ও কিস্তি তালিকা', 'Product & EMI Inventory')}
            </h2>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/40">
              {products.length} {t('টি পণ্য', 'Products')}
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            {t(
              'পণ্য যুক্ত করুন, সরাসরি ছবি আপলোড দিন এবং কিস্তি ও মূল্যের হিসাব পরিবর্তন করুন।',
              'Manage catalog, upload product photos directly, and adjust EMI installment terms.'
            )}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>{t('নতুন পণ্য যোগ করুন', 'Add New Product')}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { id: 'all', labelBn: 'সকল পণ্য', labelEn: 'All' },
          { id: 'consumer', labelBn: 'নিত্যপণ্য (চাউল, ডাল, তৈল, চিনি)', labelEn: 'Consumer Goods' },
          { id: 'appliances', labelBn: 'হোম অ্যাপ্লায়েন্স', labelEn: 'Appliances' },
          { id: 'electronics', labelBn: 'ইলেকট্রনিক্স', labelEn: 'Electronics' },
          { id: 'furniture', labelBn: 'ফার্নিচার', labelEn: 'Furniture' },
          { id: 'solar', labelBn: 'সোলার ও আইপিএস', labelEn: 'Solar/IPS' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryFilter(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              selectedCategoryFilter === cat.id
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            {t(cat.labelBn, cat.labelEn)}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-slate-900/90 border border-amber-500/20 hover:border-amber-500/50 rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all group"
          >
            <div>
              {/* Image & Badge */}
              <div className="relative h-44 rounded-xl overflow-hidden bg-black border border-slate-800">
                <img
                  src={prod.image}
                  alt={prod.nameBn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                {prod.badge && (
                  <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full shadow-md">
                    {prod.badge}
                  </span>
                )}
                <span className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-sm text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">
                  {prod.category}
                </span>
              </div>

              {/* Title & Description */}
              <div className="mt-3.5 space-y-1">
                <h3 className="font-bold text-white text-base leading-snug">{prod.nameBn}</h3>
                <p className="text-xs text-amber-200/70 font-sans">{prod.nameEn}</p>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{prod.descBn}</p>
              </div>

              {/* Price & EMI Calculations */}
              <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{t('নগদ মূল্য', 'Cash Price')}</span>
                  <span className="font-black text-amber-300 font-mono text-xs">৳ {prod.price.toLocaleString()}</span>
                </div>
                <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{t('ডাউন পেমেন্ট', 'Down')}</span>
                  <span className="font-bold text-slate-200 font-mono text-xs">৳ {prod.downPayment.toLocaleString()}</span>
                </div>
                <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/30">
                  <span className="text-[10px] text-amber-400 block font-bold">{t('মাসিক কিস্তি', 'Monthly')}</span>
                  <span className="font-black text-amber-300 font-mono text-xs">৳ {prod.monthly}/মাস</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(prod)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{t('সম্পাদনা', 'Edit')}</span>
              </button>
              <button
                onClick={() => handleDelete(prod.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('ডিলিট', 'Delete')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-xl w-full my-8 shadow-2xl p-6 sm:p-8 space-y-4 text-white animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  {editingProduct ? t('পণ্য তথ্য সম্পাদনা করুন', 'Edit Product Details') : t('নতুন পণ্য যুক্ত করুন', 'Add New Product')}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{t('পণ্যের নাম (বাংলা) *', 'Name (Bengali) *')}</label>
                  <input
                    type="text"
                    required
                    value={form.nameBn}
                    onChange={(e) => setForm({ ...form, nameBn: e.target.value })}
                    placeholder="হোলিনেক্স প্রিমিয়াম চাউল / স্মার্ট ফ্রিজ"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">{t('পণ্যের নাম (English) *', 'Name (English) *')}</label>
                  <input
                    type="text"
                    required
                    value={form.nameEn}
                    onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                    placeholder="Holynex Premium Rice / Smart Fridge"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Direct Image Upload vs URL Switcher */}
              <div className="space-y-2 p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-amber-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>{t('পণ্যের ছবি যুক্ত করুন (সরাসরি আপলোড)', 'Product Photo (Direct Upload)')}</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setUploadMode('file')}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                        uploadMode === 'file' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {t('সরাসরি আপলোড', 'Direct Upload')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('url')}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                        uploadMode === 'url' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {t('ওয়েব লিংক (URL)', 'Image URL')}
                    </button>
                  </div>
                </div>

                {uploadMode === 'file' ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-slate-900/60 rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                      <Upload className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-slate-200">
                        {t('কম্পিউটার বা মোবাইল থেকে ছবি নির্বাচন করুন', 'Click to Select Image from Device')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {t('JPG, PNG, WebP সমর্থিত • সরাসরি আপলোড ও লাইভ প্রিভিউ', 'JPG, PNG, WebP supported')}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>
                )}

                {/* Image preview */}
                {form.image && (
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-amber-400/50 bg-black shrink-0">
                      <img
                        src={form.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-[11px] text-slate-300">
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> {t('ছবি প্রস্তুত হয়েছে', 'Image Ready')}
                      </span>
                      <span className="text-slate-500 block truncate max-w-[280px]">
                        {form.image.startsWith('data:') ? 'লোকাল ফাইল (Direct Uploaded)' : form.image}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{t('মোট মূল্য (টাকা) *', 'Total Price (BDT) *')}</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => handlePriceChange(Number(e.target.value), form.downPayment, form.months)}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">{t('ডাউনপেমেন্ট (টাকা) *', 'Down Payment (BDT) *')}</label>
                  <input
                    type="number"
                    required
                    value={form.downPayment}
                    onChange={(e) => handlePriceChange(form.price, Number(e.target.value), form.months)}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">{t('কিস্তির মেয়াদ (মাস) *', 'Duration (Months) *')}</label>
                  <input
                    type="number"
                    required
                    value={form.months}
                    onChange={(e) => handlePriceChange(form.price, form.downPayment, Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              {/* Calculated Monthly */}
              <div className="p-3 bg-amber-500/15 rounded-xl border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-300 block">{t('স্বয়ংক্রিয় হিসাবকৃত মাসিক কিস্তি:', 'Calculated Monthly EMI:')}</span>
                  <span className="text-xs text-amber-200/80">({form.price} - {form.downPayment}) ÷ {form.months} মাস</span>
                </div>
                <span className="text-lg font-black text-amber-300 font-mono">
                  ৳ {form.monthly}/মাস
                </span>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{t('ক্যাটাগরি', 'Category')}</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="consumer">{t('নিত্যপ্রয়োজনীয় পণ্য (চাউল, ডাল, তৈল, চিনি, ইত্যাদি)', 'Consumer Goods (Rice, Oil, Pulses)')}</option>
                    <option value="appliances">{t('হোম অ্যাপ্লায়েন্স (Home Appliances)', 'Home Appliances')}</option>
                    <option value="electronics">{t('ইলেকট্রনিক্স (Electronics)', 'Electronics')}</option>
                    <option value="furniture">{t('ফার্নিচার (Furniture)', 'Furniture')}</option>
                    <option value="solar">{t('সোলার ও আইপিএস (Solar/IPS)', 'Solar/IPS')}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">{t('প্রমোশনাল ব্যাজ', 'Badge')}</label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="হট অফার / স্পেশাল ডিল"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              {/* Bengali & English Description */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">{t('পণ্যের বিবরণ (বাংলা)', 'Description (Bengali)')}</label>
                <textarea
                  rows={2}
                  value={form.descBn}
                  onChange={(e) => setForm({ ...form, descBn: e.target.value })}
                  placeholder="পণ্যের মান ও স্পেসিফিকেশন..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20"
                >
                  {editingProduct ? t('আপডেট করুন', 'Update Product') : t('সংরক্ষণ করুন', 'Save Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
