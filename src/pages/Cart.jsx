import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import PageTransition from '../components/PageTransition';
import './Cart.css';

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, count, clearCart } = useCart();
  const toast = useToast();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleCheckout = () => setCheckoutOpen(true);

  const confirmOrder = () => {
    setCheckoutOpen(false);
    clearCart();
    toast.success('Заказ оформлен! Спасибо за покупку 🎉', 3500);
  };

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="container">
          <EmptyState
            icon={FiShoppingBag}
            title="Корзина пуста"
            subtitle="Загляните в каталог — там наверняка найдётся что-то интересное"
            actionLabel="В каталог"
            actionTo="/catalog"
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container cart">
        <h1 className="cart__title">Корзина <span className="mono">({count})</span></h1>

        <div className="cart__grid">
          <div className="cart__list">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  className="cart-item"
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={`/product/${item.id}`} className="cart-item__media">
                    <img src={item.image} alt={item.title} />
                  </Link>
                  <div className="cart-item__info">
                    <Link to={`/product/${item.id}`} className="cart-item__title">{item.title}</Link>
                    <span className="cart-item__price mono">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="cart-item__qty">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1} aria-label="Уменьшить">
                      <FiMinus />
                    </button>
                    <span className="mono">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Увеличить">
                      <FiPlus />
                    </button>
                  </div>
                  <span className="cart-item__total mono">${(item.price * item.qty).toFixed(2)}</span>
                  <button className="cart-item__remove" onClick={() => removeItem(item.id)} aria-label="Удалить товар">
                    <FiTrash2 />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.aside
            className="cart-summary"
            layout
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3>Итого</h3>
            <div className="cart-summary__row">
              <span>Товары ({count})</span>
              <span className="mono">${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary__row">
              <span>Доставка</span>
              <span className="mono">{shipping === 0 ? 'Бесплатно' : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className="cart-summary__hint">
                Добавьте товаров ещё на <strong className="mono">${(100 - subtotal).toFixed(2)}</strong> для бесплатной доставки
              </p>
            )}
            <div className="cart-summary__divider" />
            <div className="cart-summary__row cart-summary__row--total">
              <span>К оплате</span>
              <span className="mono">${total.toFixed(2)}</span>
            </div>
            <button className="btn btn--primary btn--block" onClick={handleCheckout}>
              Оформить заказ <FiArrowRight />
            </button>
            <Link to="/catalog" className="cart-summary__continue">Продолжить покупки</Link>
          </motion.aside>
        </div>
      </div>

      <Modal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} title="Подтверждение заказа">
        <p className="checkout-modal__text">
          Вы оформляете заказ на сумму <strong className="mono">${total.toFixed(2)}</strong> ({count} товар(а)).
          Это демонстрационный магазин — реальная оплата не производится.
        </p>
        <div className="checkout-modal__actions">
          <button className="btn btn--ghost btn--block" onClick={() => setCheckoutOpen(false)}>Отмена</button>
          <button className="btn btn--primary btn--block" onClick={confirmOrder}>Подтвердить</button>
        </div>
      </Modal>
    </PageTransition>
  );
}
