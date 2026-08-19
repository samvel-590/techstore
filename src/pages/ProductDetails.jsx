import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiArrowLeft, FiCheck, FiMinus, FiPlus, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { fetchProductById, fetchProducts } from '../api/products';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import StarRating from '../components/StarRating';
import { ProductDetailsSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ProductCard from '../components/ProductCard';
import PageTransition from '../components/PageTransition';
import '../components/ProductGrid.css';
import './ProductDetails.css';

const CATEGORY_LABEL = {
  electronics: 'Электроника',
  jewelery: 'Аксессуары',
  "men's clothing": 'Мужское',
  "women's clothing": 'Женское',
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  const { addItem, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    setQty(1);
    fetchProductById(id)
      .then((p) => {
        if (!alive) return;
        setProduct(p);
        return fetchProducts().then((all) => {
          if (!alive) return;
          setRelated(all.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4));
        });
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <PageTransition>
        <div className="container details">
          <ProductDetailsSkeleton />
        </div>
      </PageTransition>
    );
  }

  if (error || !product) {
    return (
      <PageTransition>
        <div className="container details">
          <EmptyState
            title="Товар не найден"
            subtitle={error || 'Возможно, он был удалён или ссылка неверна'}
            actionLabel="Вернуться в каталог"
            actionTo="/catalog"
          />
        </div>
      </PageTransition>
    );
  }

  const fav = isFavorite(product.id);
  const inCart = isInCart(product.id);

  return (
    <PageTransition>
      <div className="container details">
        <button className="details__back" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Назад
        </button>

        <div className="details__grid">
          <motion.div
            className="details__media"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {product.discountPct > 0 && (
              <span className="details__flag details__flag--sale">-{product.discountPct}%</span>
            )}
            {product.isNew && <span className="details__flag details__flag--new">Новинка</span>}
            <img src={product.image} alt={product.title} />
          </motion.div>

          <motion.div
            className="details__info"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="details__category">{CATEGORY_LABEL[product.category] || product.category}</span>
            <h1 className="details__title">{product.title}</h1>
            <StarRating rate={product.rating?.rate} count={product.rating?.count} size="lg" />

            <div className="details__price-row mono">
              <span className="details__price">${product.price.toFixed(2)}</span>
              {product.oldPrice && <span className="details__old-price">${product.oldPrice.toFixed(2)}</span>}
            </div>

            <p className="details__description">{product.description}</p>

            <div className="details__qty-row">
              <span className="details__qty-label">Количество</span>
              <div className="details__qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Уменьшить количество">
                  <FiMinus />
                </button>
                <span className="mono">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Увеличить количество">
                  <FiPlus />
                </button>
              </div>
            </div>

            <div className="details__actions">
              <motion.button
                className={`btn btn--primary btn--block ${inCart ? 'details__added' : ''}`}
                onClick={() => addItem(product, qty)}
                whileTap={{ scale: 0.97 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {inCart ? (
                    <motion.span
                      key="added"
                      className="details__btn-content"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      <FiCheck /> В корзине — добавить ещё
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      className="details__btn-content"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      <FiShoppingBag /> Добавить в корзину
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <button
                className={`details__fav-btn ${fav ? 'details__fav-btn--active' : ''}`}
                onClick={() => toggleFavorite(product)}
                aria-pressed={fav}
                aria-label={fav ? 'Убрать из избранного' : 'В избранное'}
              >
                <FiHeart />
              </button>
            </div>

            <div className="details__perks">
              <div><FiTruck /> Быстрая доставка</div>
              <div><FiShield /> Официальная гарантия</div>
              <div><FiRefreshCw /> Возврат 14 дней</div>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="section">
            <h2 className="section__title">Похожие товары</h2>
            <div className="product-grid product-grid--4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
}
