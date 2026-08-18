import { motion, AnimatePresence } from 'framer-motion';
import { FiSliders, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { SORT_OPTIONS } from '../api/products';
import './FiltersBar.css';

const CATEGORY_LABEL = {
  all: 'Все',
  electronics: 'Электроника',
  jewelery: 'Аксессуары',
  "men's clothing": 'Мужское',
  "women's clothing": 'Женское',
};

const SORT_LABEL = {
  [SORT_OPTIONS.RELEVANCE]: 'По умолчанию',
  [SORT_OPTIONS.PRICE_ASC]: 'Сначала дешевле',
  [SORT_OPTIONS.PRICE_DESC]: 'Сначала дороже',
  [SORT_OPTIONS.RATING_DESC]: 'По рейтингу',
  [SORT_OPTIONS.NAME_ASC]: 'По названию А-Я',
};

export default function FiltersBar({
  categories,
  category,
  onCategoryChange,
  priceRange,
  bounds,
  onPriceChange,
  sort,
  onSortChange,
  resultCount,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <>
      <div className="filters-bar__group">
        <span className="filters-bar__label">Категория</span>
        <div className="filters-bar__chips">
          {['all', ...categories].map((c) => (
            <button
              key={c}
              className={`chip ${category === c ? 'chip--active' : ''}`}
              onClick={() => onCategoryChange(c)}
            >
              {CATEGORY_LABEL[c] || c}
            </button>
          ))}
        </div>
      </div>

      <div className="filters-bar__group">
        <span className="filters-bar__label">
          Цена: <span className="mono">${priceRange[0]} – ${priceRange[1]}</span>
        </span>
        <div className="filters-bar__range">
          <input
            type="range"
            min={bounds[0]}
            max={bounds[1]}
            value={priceRange[0]}
            onChange={(e) => {
              const v = Math.min(Number(e.target.value), priceRange[1]);
              onPriceChange([v, priceRange[1]]);
            }}
          />
          <input
            type="range"
            min={bounds[0]}
            max={bounds[1]}
            value={priceRange[1]}
            onChange={(e) => {
              const v = Math.max(Number(e.target.value), priceRange[0]);
              onPriceChange([priceRange[0], v]);
            }}
          />
        </div>
      </div>

      <div className="filters-bar__group">
        <span className="filters-bar__label">Сортировка</span>
        <select value={sort} onChange={(e) => onSortChange(e.target.value)} className="filters-bar__select">
          {Object.entries(SORT_LABEL).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>
    </>
  );

  return (
    <div className="filters-bar">
      <div className="filters-bar__desktop">{content}</div>

      <div className="filters-bar__mobile-header">
        <span className="filters-bar__count">{resultCount} товаров</span>
        <button className="filters-bar__toggle" onClick={() => setMobileOpen(true)}>
          <FiSliders /> Фильтры
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="filters-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="filters-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              <div className="filters-drawer__header">
                <h3>Фильтры</h3>
                <button onClick={() => setMobileOpen(false)} aria-label="Закрыть"><FiX /></button>
              </div>
              <div className="filters-drawer__body">{content}</div>
              <button className="filters-drawer__apply" onClick={() => setMobileOpen(false)}>
                Показать {resultCount} товаров
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
