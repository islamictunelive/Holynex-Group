import React, { useState, useMemo } from 'react';
import { ProductItem } from '../../types';
import { useLanguage } from '../../lib/languageContext';
import {
  Search,
  SlidersHorizontal,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  X,
  Phone,
  Store,
  ChevronRight,
} from 'lucide-react';

interface ProductsViewProps {
  products: ProductItem[];
  navigate: (path: string) => void;
  selectedProduct?: ProductItem | null;
  onClearSelectedProduct?: () => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  navigate,
  selectedProduct,
  onClearSelectedProduct,
}) => {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProduct, setActiveModalProduct] = useState<ProductItem | null>(selectedProduct || null);
  const [calculatorMonths, setCalculatorMonths] = useState<number>(12);

  // Sync modal when prop changes
  React.useEffect(() => {
    if (selectedProduct) {
      setActiveModalProduct(selectedProduct);
      setCalculatorMonths(selectedProduct.months || 12);
    }
  }, [selectedProduct]);

  const categories = [
    { id: 'all', labelBn: 'সকল পণ্য', labelEn: 'All Products' },
    { id: 'appliances', labelBn: 'হোম অ্যাপ্লায়েন্স', labelEn: 'Home Appliances' },
    { id: 'electronics', labelBn: 'ইলেকট্রনিক্স ও টিভি', labelEn: 'Electronics & TV' },
    { id: 'motorcycle', labelBn: 'মোটরসাইকেল', labelEn: 'Motorcycles' },
    { id: 'mobile', labelBn: 'স্মার্টফোন ও গ্যাজেট', labelEn: 'Smartphones & Gadgets' },
    { id: 'furniture', labelBn: 'ফার্নিচার ও গৃহসজ্জা', labelEn: 'Furniture' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.nameBn.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.descBn.toLowerCase().includes(q) ||
        p.descEn.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleOpenModal = (prod: ProductItem) => {
    setActiveModalProduct(prod);
    setCalculatorMonths(prod.months || 12);
  };

  const handleCloseModal = () => {
    setActiveModalProduct(null);
    if (onClearSelectedProduct) onClearSelectedProduct();
  };

  // Custom calculation for modal
  const calcDownPayment = activeModalProduct ? Math.round(activeModalProduct.price * 0.2) : 0;
  const calcRemaining = activeModalProduct ? activeModalProduct.price - calcDownPayment : 0;
  const calcMonthly = activeModalProduct ? Math.round(calcRemaining / calculatorMonths) : 0;

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Page Header */}
        <div className="max-w-3xl mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider bg-blue-100 px-3 py-1 rounded-full">
            <CreditCard className="w-3.5 h-3.5 text-blue-700" />
            {t('ফেয়ার প্রাইস ও কিস্তি ক্যাটালগ', 'Fair Price & Installment Catalog')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            {t('হোলিনেক্স গ্রুপের অফিশিয়াল পণ্যসম্ভার', 'Official Holynex Products Catalog')}
          </h1>
          <p className="text-sm text-slate-600">
            {t(
              'সকল পণ্যে পাবেন জেনুইন প্রস্তুতকারক ওয়ারেন্টি, সর্বনিম্ন ডাউন পেমেন্ট এবং ৬ থেকে ২৪ মাসের সহজ কিস্তির সুযোগ।',
              'All items feature verified manufacturer warranty, minimal down payment, and 6 to 24 months equal installment tenures.'
            )}
          </p>
        </div>

        {/* Filters & Search Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('পণ্য খুঁজুন (নাম বা মডেল)...', 'Search products (name or model)...')}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Total Count */}
            <div className="text-xs text-slate-500 font-medium">
              {t('মোট পাওয়া গেছে:', 'Showing:')}{' '}
              <span className="font-bold text-slate-900">{filteredProducts.length}</span>{' '}
              {t('টি পণ্য', 'products')}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {t(cat.labelBn, cat.labelEn)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 text-sm">
              {t('কোনো পণ্য পাওয়া যায়নি। অনুগ্রহ করে অন্য ক্যাটাগরি অথবা সার্চ কি-ওয়ার্ড চেক করুন।', 'No products matched your search. Please adjust your query or category filter.')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Product Image */}
                <div className="relative h-60 bg-slate-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={lang === 'bn' ? product.nameBn : product.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-md">
                      {product.badge}
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white font-bold text-xs px-2.5 py-1 rounded-lg">
                    ৳ {product.price.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-950 text-base line-clamp-1 group-hover:text-blue-900 transition-colors">
                      {lang === 'bn' ? product.nameBn : product.nameEn}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {lang === 'bn' ? product.descBn : product.descEn}
                    </p>
                  </div>

                  {/* Installment Badge Box */}
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">{t('ডাউন পেমেন্ট (২০%):', 'Down Payment (20%):')}</span>
                      <span className="font-bold text-slate-900">৳ {product.downPayment.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-right border-l border-amber-200 pl-3">
                      <span className="text-amber-800 block font-semibold text-[11px]">{product.months} {t('মাসের কিস্তি', 'Mos Term')}</span>
                      <span className="font-extrabold text-amber-700 text-sm">৳ {product.monthly.toLocaleString('en-IN')}/মাস</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-950 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t('কিস্তি ক্যালকুলেটর ও বিস্তারিত', 'Installment Breakdown')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product & Installment Modal Dialog */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {t('পণ্য বিবরণ ও কিস্তি স্কিম', 'Product Details & Installment Scheme')}
                </span>
                <h3 className="text-xl font-extrabold text-slate-950 mt-1">
                  {lang === 'bn' ? activeModalProduct.nameBn : activeModalProduct.nameEn}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Image & Key Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="h-56 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                <img
                  src={activeModalProduct.image}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">{t('সর্বমোট নগদ মূল্য:', 'Total Cash Price:')}</span>
                  <span className="text-xl font-black text-slate-950">
                    ৳ {activeModalProduct.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-1 text-slate-600">
                  <p className="font-semibold text-slate-900">{t('পণ্য পরিচিতি:', 'Overview:')}</p>
                  <p className="leading-relaxed">
                    {lang === 'bn' ? activeModalProduct.descBn : activeModalProduct.descEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Installment Calculator */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {t('কিস্তির মেয়াদ নির্বাচন করুন:', 'Select Installment Tenure:')}
                </span>
                <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg">
                  {[6, 12, 18, 24].map((m) => (
                    <button
                      key={m}
                      onClick={() => setCalculatorMonths(m)}
                      className={`px-2.5 py-1 text-xs font-bold rounded ${
                        calculatorMonths === m ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {m} {t('মাস', 'M')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center pt-2 border-t border-slate-800">
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">{t('ডাউন পেমেন্ট (২০%)', 'Down Payment (20%)')}</span>
                  <span className="font-bold text-white text-sm">৳ {calcDownPayment.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">{t('বাকি কিস্তির পরিমাণ', 'Principal Balance')}</span>
                  <span className="font-bold text-white text-sm">৳ {calcRemaining.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2.5 bg-amber-500/20 rounded-xl border border-amber-500/30">
                  <span className="text-[11px] text-amber-300 block font-semibold">{t('মাসিক কিস্তি', 'Monthly Rate')}</span>
                  <span className="font-black text-amber-400 text-base">৳ {calcMonthly.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {t(
                    'কোনো গোপন ফি বা জটিল প্রসেসিং চার্জ নেই। হোলিনেক্স ফেয়ার প্রাইস কার্ডধারীদের জন্য বিশেষ সুবিধা।',
                    'Zero hidden processing fees. Special privileges for Holynex Fair Price Cardholders.'
                  )}
                </span>
              </div>
            </div>

            {/* Modal Footer Call to Action */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  handleCloseModal();
                  navigate('/dealer-application');
                }}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-sm shadow-md hover:brightness-105 transition-all text-center flex items-center justify-center gap-2"
              >
                <Store className="w-4 h-4" />
                <span>{t('নিকটস্থ ডিলারের মাধ্যমে অর্ডার করুন', 'Order via Nearest Dealer')}</span>
              </button>

              <a
                href="tel:01307835260"
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-600" />
                <span>01307835260</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
