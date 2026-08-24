import { useEffect } from 'react';
import { Routes, Route, useLocation, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';

function ProductDetailsRoute() {
  const { id } = useParams();
  return <ProductDetails key={id} />;
}

function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageUrl = new URL(pathname, window.location.origin).href;
    const canonical = document.querySelector('link[rel="canonical"]');
    const openGraphUrl = document.querySelector('meta[property="og:url"]');

    canonical?.setAttribute('href', pageUrl);
    openGraphUrl?.setAttribute('content', pageUrl);
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetailsRoute />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          <FavoritesProvider>
            <ScrollToTop />
            <RouteMetadata />
            <Header />
            <main style={{ flex: 1 }}>
              <AnimatedRoutes />
            </main>
            <Footer />
          </FavoritesProvider>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
