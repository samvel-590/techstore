import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSearch, FiAlertCircle } from 'react-icons/fi';
import {
  fetchProducts,
  fetchCategories,
  searchProducts,
  filterByCategory,
  filterByPriceRange,
  sortProducts,
  SORT_OPTIONS,
} from '../api/products';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import FiltersBar from '../components/FiltersBar';
import EmptyState from '../components/EmptyState';
import PageTransition from '../components/PageTransition';
import { useDebounce } from '../hooks/useDebounce';
import '../components/ProductGrid.css';
import './Catalog.css';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = searchParams.get('q') || '';
  const debouncedQuery = useDebounce(query, 250);
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || SORT_OPTIONS.RELEVANCE;

  const bounds = useMemo(() => {
    if (!allProducts.length) return [0, 1000];
    const prices = allProducts.map((p) => p.price);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [allProducts]);

  const [priceRange, setPriceRange] = useState([0, 1000]);

  useEffect(() => {
    setPriceRange(bounds);
  }, [bounds[0], bounds[1]]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    Promise.all([fetchProducts(), fetchCategories()])
      .then(([products, cats]) => {
        if (!alive) return;
        setAllProducts(products);
        setCategories(cats);
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const results = useMemo(() => {
    let list = searchProducts(allProducts, debouncedQuery);
    list = filterByCategory(list, category);
    list = filterByPriceRange(list, priceRange);
    list = sortProducts(list, sort);
    return list;
  }, [allProducts, debouncedQuery, category, priceRange, sort]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  return (
    <PageTransition>
      <div className="container catalog">
        <div className="catalog__header">
          <h1>Каталог</h1>
          <p>
            {query ? (
              <>Результаты по запросу «{query}»</>
            ) : (
              'Вся техника и товары, отобранные для вас'
            )}
          </p>
        </div>

        {!loading && !error && (
          <FiltersBar
            categories={categories}
            category={category}
            onCategoryChange={(c) => updateParam('category', c)}
            priceRange={priceRange}
            bounds={bounds}
            onPriceChange={setPriceRange}
            sort={sort}
            onSortChange={(s) => updateParam('sort', s)}
            resultCount={results.length}
          />
        )}

        {error && (
          <EmptyState
            icon={FiAlertCircle}
            title="Не удалось загрузить товары"
            subtitle={error}
          />
        )}

        {loading && <ProductGridSkeleton count={8} />}

        {!loading && !error && results.length === 0 && (
          <EmptyState
            icon={FiSearch}
            title="Ничего не найдено"
            subtitle="Попробуйте изменить запрос или сбросить фильтры"
          />
        )}

        {!loading && !error && results.length > 0 && (
          <motion.div layout className="product-grid">
            <AnimatePresence mode="popLayout">
              {results.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
