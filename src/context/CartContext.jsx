import { createContext, useContext, useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('techstore_cart', []);
  const toast = useToast();

  const addItem = useCallback(
    (product, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + qty } : i
          );
        }
        return [...prev, { ...product, qty }];
      });
      toast.success(`«${truncate(product.title)}» добавлен в корзину`);
    },
    [setItems, toast]
  );

  const removeItem = useCallback(
    (id, options = {}) => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (!options.silent) toast.info('Товар удалён из корзины');
    },
    [setItems, toast]
  );

  const updateQty = useCallback(
    (id, qty) => {
      if (qty < 1) return;
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
    },
    [setItems]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const isInCart = useCallback((id) => items.some((i) => i.id === id), [items]);

  const totals = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    return { count, subtotal };
  }, [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQty, clearCart, isInCart, ...totals }),
    [items, addItem, removeItem, updateQty, clearCart, isInCart, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function truncate(str, n = 34) {
  return str.length > n ? str.slice(0, n).trim() + '…' : str;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
