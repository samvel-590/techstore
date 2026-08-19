import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiZap } from 'react-icons/fi';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import PageTransition from '../components/PageTransition';
import '../components/ProductGrid.css';
import './Home.css';

const CATEGORIES = [
  { key: 'electronics', label: 'Электроника', desc: 'Гаджеты и устройства' },
  { key: "men's clothing", label: 'Мужское', desc: 'Стиль и комфорт' },
  { key: "women's clothing", label: 'Женское', desc: 'Актуальные образы' },
  { key: 'jewelery', label: 'Аксессуары', desc: 'Детали, которые важны' },
];

const FEATURES = [
  { icon: FiTruck, title: 'Быстрая доставка', text: 'В среднем 2–4 дня по стране' },
  { icon: FiShield, title: 'Гарантия качества', text: 'Официальная гарантия на всё' },
  { icon: FiRefreshCw, title: 'Лёгкий возврат', text: '14 дней на обмен без вопросов' },
  { icon: FiZap, title: 'Проверено экспертами', text: 'Каждый товар — на тестах' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchProducts()
      .then((data) => {
        if (!alive) return;
        setProducts(data);
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const bestRated = [...products].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 4);
  const newest = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <PageTransition>
      {/* HERO */}
      <section className="hero">
        <div className="hero__grid" aria-hidden="true" />
        <div className="container hero__inner">
          <motion.div
            className="hero__copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="hero__eyebrow mono">// каталог 2026</span>
            <h1 className="hero__title">
              Технология,
              <br />
              выбранная <span className="hero__underline">с точностью</span>.
            </h1>
            <p className="hero__subtitle">
              Отобранная электроника и вещи для повседневной жизни — без лишнего шума,
              с честными характеристиками и ценами.
            </p>
            <div className="hero__actions">
              <Link to="/catalog" className="btn btn--primary">
                Смотреть каталог <FiArrowRight />
              </Link>
              <Link to="/catalog?category=electronics" className="btn btn--ghost">
                Электроника
              </Link>
            </div>
            <div className="hero__stats">
              <div><strong>20+</strong><span>товаров</span></div>
              <div><strong>4.6</strong><span>средний рейтинг</span></div>
              <div><strong>24/7</strong><span>поддержка</span></div>
            </div>
          </motion.div>

          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero__card hero__card--main">
              {products[0]?.image && <img src={products[0].image} alt="" />}
            </div>
            <motion.div
              className="hero__chip hero__chip--1"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="mono">-25%</span> сегодня
            </motion.div>
            <motion.div
              className="hero__chip hero__chip--2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              ★ 4.8 рейтинг
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section container">
        <h2 className="section__title">Категории</h2>
        <div className="cat-grid">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link to={`/catalog?category=${encodeURIComponent(c.key)}`} className="cat-card">
                <span className="cat-card__label">{c.label}</span>
                <span className="cat-card__desc">{c.desc}</span>
                <FiArrowRight className="cat-card__arrow" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BEST RATED */}
      <section className="section container">
        <div className="section__header">
          <h2 className="section__title">Лучшие по рейтингу</h2>
          <Link to="/catalog?sort=rating_desc" className="section__link">Все товары <FiArrowRight /></Link>
        </div>
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="product-grid product-grid--4">
            {bestRated.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* NEW ARRIVALS */}
      {newest.length > 0 && (
        <section className="section container">
          <div className="section__header">
            <h2 className="section__title">Новинки</h2>
            <Link to="/catalog" className="section__link">Все товары <FiArrowRight /></Link>
          </div>
          <div className="product-grid product-grid--4">
            {newest.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="section container">
        <div className="features">
          {FEATURES.map((f, i) => (
            <motion.div
              className="feature"
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <f.icon className="feature__icon" />
              <h4>{f.title}</h4>
              <p>{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
