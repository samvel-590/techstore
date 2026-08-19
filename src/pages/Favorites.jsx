import { AnimatePresence, motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { useFavorites } from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import PageTransition from '../components/PageTransition';
import '../components/ProductGrid.css';
import './Catalog.css';

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <PageTransition>
      <div className="container catalog">
        <div className="catalog__header">
          <h1>Избранное</h1>
          <p>{favorites.length > 0 ? `Сохранено товаров: ${favorites.length}` : 'Здесь появятся товары, которые вам понравились'}</p>
        </div>

        {favorites.length === 0 ? (
          <EmptyState
            icon={FiHeart}
            title="Пока пусто"
            subtitle="Нажимайте на сердечко у товара, чтобы сохранить его здесь"
            actionLabel="В каталог"
            actionTo="/catalog"
          />
        ) : (
          <motion.div layout className="product-grid" style={{ marginTop: 24 }}>
            <AnimatePresence mode="popLayout">
              {favorites.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
