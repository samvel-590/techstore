import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  FiArrowRight,
  FiBox,
  FiCheck,
  FiCpu,
  FiHeadphones,
  FiRefreshCw,
  FiShield,
  FiTruck,
  FiZap,
} from 'react-icons/fi';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import PageTransition from '../components/PageTransition';
import '../components/ProductGrid.css';
import './Home.css';

const CATEGORIES = [
  { key: 'electronics', label: 'Электроника', desc: 'Устройства для нового ритма', icon: FiCpu, index: '01' },
  { key: 'jewelery', label: 'Аксессуары', desc: 'Технологичные детали', icon: FiHeadphones, index: '02' },
  { key: "men's clothing", label: 'Мужское', desc: 'Функциональный гардероб', icon: FiBox, index: '03' },
  { key: "women's clothing", label: 'Женское', desc: 'Современные силуэты', icon: FiZap, index: '04' },
];

const FEATURES = [
  { icon: FiTruck, title: 'Быстрая доставка', text: 'В среднем 2–4 дня по стране' },
  { icon: FiShield, title: 'Гарантия качества', text: 'Официальная гарантия на всё' },
  { icon: FiRefreshCw, title: 'Лёгкий возврат', text: '14 дней на обмен без вопросов' },
  { icon: FiZap, title: 'Проверено экспертами', text: 'Каждый товар — на тестах' },
];

const STORY = [
  {
    number: '01',
    title: 'Сначала — отбор',
    text: 'Сравниваем характеристики, сценарии использования и реальную ценность каждой модели.',
  },
  {
    number: '02',
    title: 'Затем — проверка',
    text: 'Оставляем только понятные товары без скрытых компромиссов и маркетингового шума.',
  },
  {
    number: '03',
    title: 'После — ваш выбор',
    text: 'Чёткая карточка, честная цена и быстрая доставка. Всё остальное мы уже сделали.',
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const storyRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ['start end', 'end start'],
  });
  const storyRotate = useTransform(scrollYProgress, [0, 1], [-9, 10]);
  const storyY = useTransform(scrollYProgress, [0, 1], [70, -70]);

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
      <section className="hero">
        <div className="hero__grid" aria-hidden="true" />
        <div className="hero__glow hero__glow--one" aria-hidden="true" />
        <div className="hero__glow hero__glow--two" aria-hidden="true" />
        <div className="container hero__inner">
          <motion.div
            className="hero__copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="hero__eyebrow"><span className="hero__eyebrow-dot" /> Коллекция 2026 уже здесь</span>
            <h1 className="hero__title">
              Будущее.<br />
              <span className="hero__title-accent">Без лишнего.</span>
            </h1>
            <p className="hero__subtitle">
              Техника и вещи, которые действительно стоят внимания. Отбираем точнее,
              объясняем проще, доставляем быстрее.
            </p>
            <div className="hero__actions">
              <Link to="/catalog" className="btn btn--primary">
                Открыть каталог <FiArrowRight />
              </Link>
              <Link to="/catalog?category=electronics" className="btn btn--ghost">
                Смотреть новинки
              </Link>
            </div>
            <div className="hero__stats">
              <div><strong>20+</strong><span>отобранных товаров</span></div>
              <div><strong>4.8</strong><span>средняя оценка</span></div>
              <div><strong>2–4</strong><span>дня до двери</span></div>
            </div>
          </motion.div>

          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero__orbit hero__orbit--outer" aria-hidden="true" />
            <div className="hero__orbit hero__orbit--inner" aria-hidden="true" />
            <div className="hero__product-no mono" aria-hidden="true">01 / SELECTED</div>
            <div className="hero__card hero__card--main">
              <div className="hero__card-shine" aria-hidden="true" />
              {products[0]?.image && (
                <img
                  src={products[0].image}
                  alt={products[0].title || 'Выбранный товар'}
                  fetchPriority="high"
                />
              )}
            </div>
            <motion.div
              className="hero__chip hero__chip--1"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="hero__chip-icon"><FiZap /></span>
              <span><b>-25%</b><small>цена дня</small></span>
            </motion.div>
            <motion.div
              className="hero__chip hero__chip--2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              <span className="hero__chip-check"><FiCheck /></span>
              <span><b>Проверено</b><small>выбор экспертов</small></span>
            </motion.div>
          </motion.div>
        </div>
        <div className="hero__scroll-cue mono" aria-hidden="true"><span /> SCROLL TO EXPLORE</div>
      </section>

      <div className="ticker" aria-label="Преимущества магазина">
        <div className="ticker__track">
          {[...Array(2)].flatMap((_, loop) => ['ТОЧНЫЙ ВЫБОР', 'ЧЕСТНЫЕ ЦЕНЫ', 'БЫСТРАЯ ДОСТАВКА', 'НОВЫЕ ТЕХНОЛОГИИ'].map((text) => (
            <span key={`${loop}-${text}`}>{text}<i>✦</i></span>
          )))}
        </div>
      </div>

      <section className="section container categories-section">
        <div className="section-kicker mono">01 / НАПРАВЛЕНИЯ</div>
        <div className="section__header section__header--intro">
          <h2 className="section__title">Выберите свой ритм</h2>
          <p>Четыре направления. Только актуальные вещи — для работы, города и жизни.</p>
        </div>
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
                <span className="cat-card__index mono">{c.index}</span>
                <span className="cat-card__icon"><c.icon /></span>
                <span className="cat-card__label">{c.label}</span>
                <span className="cat-card__desc">{c.desc}</span>
                <span className="cat-card__arrow"><FiArrowRight /></span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section container products-section">
        <div className="section-kicker mono">02 / ВЫБОР ПОКУПАТЕЛЕЙ</div>
        <div className="section__header">
          <h2 className="section__title">Те самые. Лучшие.</h2>
          <Link to="/catalog?sort=rating_desc" className="section__link">Смотреть все <FiArrowRight /></Link>
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

      <section className="story" ref={storyRef}>
        <div className="story__noise" aria-hidden="true" />
        <div className="container story__grid">
          <div className="story__content">
            <div className="section-kicker section-kicker--light mono">03 / КАК МЫ ВЫБИРАЕМ</div>
            <h2>Технологии должны<br />работать на вас.</h2>
            <div className="story__steps">
              {STORY.map((item) => (
                <motion.article
                  className="story-step"
                  key={item.number}
                  initial={{ opacity: 0.35, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ margin: '-38% 0px -38% 0px' }}
                  transition={{ duration: 0.45 }}
                >
                  <span className="mono">{item.number}</span>
                  <div><h3>{item.title}</h3><p>{item.text}</p></div>
                </motion.article>
              ))}
            </div>
          </div>
          <div className="story__stage" aria-label="Товар проходит проверку качества">
            <motion.div className="story__device" style={{ rotate: storyRotate, y: storyY }}>
              <div className="story__rings" aria-hidden="true" />
              {products[5]?.image && <img src={products[5].image} alt={products[5].title} loading="lazy" />}
              <span className="story__badge story__badge--top mono">QUALITY / 100%</span>
              <span className="story__badge story__badge--bottom"><FiCheck /> Выбор подтверждён</span>
            </motion.div>
          </div>
        </div>
      </section>

      {newest.length > 0 && (
        <section className="section container products-section products-section--new">
          <div className="section-kicker mono">04 / СВЕЖЕЕ ПОСТУПЛЕНИЕ</div>
          <div className="section__header">
            <h2 className="section__title">Только появилось</h2>
            <Link to="/catalog" className="section__link">Весь каталог <FiArrowRight /></Link>
          </div>
          <div className="product-grid product-grid--4">
            {newest.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <section className="section container service-section">
        <div className="service-section__intro">
          <div className="section-kicker mono">05 / СЕРВИС</div>
          <h2 className="section__title">Спокойно на каждом этапе</h2>
        </div>
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

      <section className="container cta-section">
        <div className="cta-section__glow" aria-hidden="true" />
        <div>
          <span className="section-kicker section-kicker--light mono">ВАШ СЛЕДУЮЩИЙ АПГРЕЙД</span>
          <h2>Пора выбрать<br />что-то действительно стоящее.</h2>
        </div>
        <Link to="/catalog" className="cta-section__button" aria-label="Перейти в каталог">
          <span>В каталог</span><FiArrowRight />
        </Link>
      </section>
    </PageTransition>
  );
}
