import React, { useState, useEffect, useCallback } from 'react';
import { LanguageProvider, useLanguage } from './lib/languageContext';
import { getSlides, getNews, getProducts } from './lib/data';
import { SlideItem, NewsItem, ProductItem } from './types';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import HomeClient from './components/home/HomeClient';
import { ProductsView } from './components/products/ProductsView';
import { DealerApplicationForm } from './components/dealer/DealerApplicationForm';
import { DealerStatusCheck } from './components/dealer/DealerStatusCheck';
import { AboutView } from './components/pages/AboutView';
import { CustomerBenefitsView } from './components/pages/CustomerBenefitsView';
import { NewsView } from './components/pages/NewsView';
import { DealerAgreementView } from './components/pages/DealerAgreementView';
import { LegalView } from './components/pages/LegalView';
import { AdminPortal } from './components/admin/AdminPortal';
import { FloatingSocialBar } from './components/layout/FloatingSocialBar';
import { FloatingChatWidget } from './components/layout/FloatingChatWidget';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';

function MainApp() {
  const { lang, t } = useLanguage();

  // Navigation State supporting hash routes or simple state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash ? (hash.startsWith('/') ? hash : `/${hash}`) : '/';
  });

  // Data states
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Synchronize hash with route changes
  const navigate = useCallback((path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen to browser forward/back buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      const path = hash ? (hash.startsWith('/') ? hash : `/${hash}`) : '/';
      setCurrentPath(path);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch data
  const loadData = useCallback(async () => {
    try {
      const [s, n, p] = await Promise.all([getSlides(), getNews(), getProducts()]);
      setSlides(s);
      setNews(n);
      setProducts(p);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleProductSelect = (product: ProductItem) => {
    setSelectedProduct(product);
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-blue-600 flex items-center justify-center font-black text-2xl animate-pulse shadow-xl shadow-amber-500/20 mb-4">
          H
        </div>
        <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
          HOLYNEX GROUP
        </h2>
        <p className="text-xs text-amber-400 mt-1">
          {lang === 'bn' ? 'ফেয়ার প্রাইস সিস্টেম লোড হচ্ছে...' : 'Loading Fair Price System...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-amber-500 selection:text-slate-950 font-['Hind_Siliguri',sans-serif]">
      {/* Header with Navigation */}
      <Header currentPath={currentPath} navigate={navigate} />

      {/* Main Content View Container */}
      <main className="flex-1 w-full">
        {currentPath === '/' && (
          <HomeClient
            slides={slides.map((s) => ({
              id: s.id,
              titleEn: s.titleEn,
              titleBn: s.titleBn,
              subtitleEn: s.subtitleEn,
              subtitleBn: s.subtitleBn,
              image: s.image,
            }))}
            news={news.map((n) => ({
              id: n.id,
              textEn: n.textEn,
              textBn: n.textBn,
            }))}
            products={products.map((p) => ({
              id: p.id,
              nameEn: p.nameEn,
              nameBn: p.nameBn,
              descEn: p.descEn,
              descBn: p.descBn,
              image: p.image,
              category: p.category,
              price: p.price,
              downPayment: p.downPayment,
              months: p.months,
              monthly: p.monthly,
              badge: p.badge,
            }))}
            navigate={navigate}
            onSelectProduct={handleProductSelect}
          />
        )}

        {currentPath === '/about' && <AboutView navigate={navigate} />}

        {currentPath === '/products' && (
          <ProductsView
            products={products}
            navigate={navigate}
            selectedProduct={selectedProduct}
            onClearSelectedProduct={() => setSelectedProduct(null)}
          />
        )}

        {currentPath === '/customer-benefits' && <CustomerBenefitsView navigate={navigate} />}

        {currentPath === '/dealer-application' && <DealerApplicationForm navigate={navigate} />}

        {currentPath === '/status' && <DealerStatusCheck />}

        {currentPath === '/news' && <NewsView news={news} navigate={navigate} />}

        {currentPath === '/dealer-agreement' && <DealerAgreementView navigate={navigate} />}

        {currentPath === '/terms' && <LegalView type="terms" navigate={navigate} />}

        {currentPath === '/privacy-policy' && <LegalView type="privacy" navigate={navigate} />}

        {(currentPath === '/admin' || currentPath === '/admin-portal') && (
          <AdminPortal navigate={navigate} onDataChange={loadData} />
        )}
      </main>

      {/* Floating Vertical Social Navigation Bar (Left edge, matching design) */}
      {currentPath !== '/admin' && currentPath !== '/admin-portal' && <FloatingSocialBar />}

      {/* Floating Radiant Gold Chat / Support Widget (Right edge, matching design) */}
      {currentPath !== '/admin' && currentPath !== '/admin-portal' && <FloatingChatWidget />}

      {/* Back to Top Floating Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-4 sm:right-6 z-40 w-10 h-10 rounded-full bg-slate-900/90 hover:bg-black text-amber-400 border border-amber-500/40 shadow-xl flex items-center justify-center backdrop-blur transition-all hover:scale-105"
          title="Scroll to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Footer */}
      <Footer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
