import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import StarRating from './StarRating';
import './ProductCard.css';

const CATEGORY_LABEL = {
  electronics: 'Электроника',
  jewelery: 'Аксессуары',
  "men's clothing": 'Мужское',
  "women's clothing": 'Женское',
};

export default function ProductCard({ product, index = 0 }) {
  const { addItem, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const inCart = isInCart(product.id);
  const fav = isFavorite(product.id);

  return (
    <motion.article
      className="pcard"
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
    >
      <Link to={`/product/${product.id}`} className="pcard__media">
        {product.isNew && <span className="pcard__flag pcard__flag--new">Новинка</span>}
        {product.discountPct > 0 && (
          <span className="pcard__flag pcard__flag--sale">-{product.discountPct}%</span>
        )}
        <motion.img
          src={product.image}
          alt={product.title}
          loading="lazy"
          variants={{ hover: { scale: 1.08 } }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="pcard__scan"
          variants={{ hover: { top: '100%', opacity: [0, 1, 1, 0] } }}
          initial={{ top: '-10%' }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        />
      </Link>

      <button
        className={`pcard__fav ${fav ? 'pcard__fav--active' : ''}`}
        onClick={() => toggleFavorite(product)}
        aria-label={fav ? 'Убрать из избранного' : 'Добавить в избранное'}
        aria-pressed={fav}
      >
        <motion.span whileTap={{ scale: 1.4 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
          <FiHeart />
        </motion.span>
      </button>

      <div className="pcard__body">
        <span className="pcard__category">{CATEGORY_LABEL[product.category] || product.category}</span>
        <Link to={`/product/${product.id}`} className="pcard__title">
          {product.title}
        </Link>
        <StarRating rate={product.rating?.rate} count={product.rating?.count} />

        <div className="pcard__footer">
          <div className="pcard__price-tag mono">
            <span className="pcard__price">${product.price.toFixed(2)}</span>
            {product.oldPrice && <span className="pcard__old-price">${product.oldPrice.toFixed(2)}</span>}
          </div>

          <motion.button
            className={`pcard__cart-btn ${inCart ? 'pcard__cart-btn--added' : ''}`}
            onClick={() => addItem(product)}
            whileTap={{ scale: 0.9 }}
            aria-label={inCart ? 'Добавить ещё один товар' : 'Добавить в корзину'}
          >
            {inCart ? <FiCheck /> : <FiShoppingBag />}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
