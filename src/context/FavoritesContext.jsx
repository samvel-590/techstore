import { createContext, useContext, useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage('techstore_favorites', []);
  const toast = useToast();

  const toggleFavorite = useCallback(
    (product) => {
      setFavorites((prev) => {
        const exists = prev.some((p) => p.id === product.id);
        if (exists) {
          toast.info('Убрано из избранного');
          return prev.filter((p) => p.id !== product.id);
        }
        toast.success('Добавлено в избранное');
        return [...prev, product];
      });
    },
    [setFavorites, toast]
  );

  const isFavorite = useCallback(
    (id) => favorites.some((p) => p.id === id),
    [favorites]
  );

  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite, count: favorites.length }),
    [favorites, toggleFavorite, isFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
