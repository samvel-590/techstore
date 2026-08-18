import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiHeart, FiShoppingBag, FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import './Header.css';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { count } = useCart();
  const { count: favCount } = useFavorites();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/catalog?q=${encodeURIComponent(query.trim())}` : '/catalog');
    setMobileOpen(false);
  };

  const links = [
    { to: '/', label: 'Главная' },
    { to: '/catalog', label: 'Каталог' },
    { to: '/favorites', label: 'Избранное' },
  ];

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <button
          className="header__burger"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Открыть меню"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>

        <Link to="/" className="header__logo" onClick={() => setMobileOpen(false)}>
          <span className="header__logo-mark">TS</span>
          <span className="header__logo-text">Tech<em>Store</em></span>
        </Link>

        <nav className="header__nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `header__link${isActive ? ' header__link--active' : ''}`}
              end={l.to === '/'}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <form className="header__search" onSubmit={submitSearch} role="search">
          <FiSearch className="header__search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            placeholder="Найти технику…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Поиск товаров"
          />
        </form>

        <div className="header__actions">
          <button
            className="header__icon-btn"
            onClick={toggleTheme}
            aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
            title={isDark ? 'Светлая тема' : 'Тёмная тема'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? 'moon' : 'sun'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'flex' }}
              >
                {isDark ? <FiMoon /> : <FiSun />}
              </motion.span>
            </AnimatePresence>
          </button>

          <Link to="/favorites" className="header__icon-btn" aria-label="Избранное">
            <FiHeart />
            <AnimatePresence>
              {favCount > 0 && (
                <motion.span
                  className="header__badge"
                  key={favCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  {favCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <Link to="/cart" className="header__icon-btn" aria-label="Корзина">
            <FiShoppingBag />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  className="header__badge header__badge--accent"
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="header__mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <form className="header__search header__search--mobile" onSubmit={submitSearch} role="search">
              <FiSearch className="header__search-icon" aria-hidden="true" />
              <input
                type="search"
                placeholder="Найти технику…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Поиск товаров"
              />
            </form>
            <nav className="header__mobile-nav">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className="header__mobile-link"
                  onClick={() => setMobileOpen(false)}
                  end={l.to === '/'}
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
