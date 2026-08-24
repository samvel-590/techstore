import products from '../data/products.json';

function enrichProduct(p) {
  const hasDiscount = p.id % 3 === 0;
  const discountPct = hasDiscount ? [10, 15, 20, 25, 30][p.id % 5] : 0;
  const oldPrice = hasDiscount ? +(p.price / (1 - discountPct / 100)).toFixed(2) : null;
  return {
    ...p,
    oldPrice,
    discountPct,
    isNew: p.id % 4 === 0,
    rating: p.rating ?? { rate: 4.2, count: 120 },
  };
}

export async function fetchProducts() {
  return products.map(enrichProduct);
}

export async function fetchProductById(id) {
  const product = products.find((item) => item.id === Number(id));
  if (!product) throw new Error('Товар не найден');
  return enrichProduct(product);
}

export async function fetchCategories() {
  return [...new Set(products.map((item) => item.category))];
}

export async function fetchProductsByCategory(category) {
  return products.filter((item) => item.category === category).map(enrichProduct);
}

export function searchProducts(products, query) {
  if (!query?.trim()) return products;
  const q = query.trim().toLowerCase();
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
  );
}

export function filterByCategory(products, category) {
  if (!category || category === 'all') return products;
  return products.filter((p) => p.category === category);
}

export function filterByPriceRange(products, [min, max]) {
  return products.filter((p) => p.price >= min && p.price <= max);
}

export const SORT_OPTIONS = {
  RELEVANCE: 'relevance',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  RATING_DESC: 'rating_desc',
  NAME_ASC: 'name_asc',
};

export function sortProducts(products, sortKey) {
  const arr = [...products];
  switch (sortKey) {
    case SORT_OPTIONS.PRICE_ASC:
      return arr.sort((a, b) => a.price - b.price);
    case SORT_OPTIONS.PRICE_DESC:
      return arr.sort((a, b) => b.price - a.price);
    case SORT_OPTIONS.RATING_DESC:
      return arr.sort((a, b) => b.rating.rate - a.rating.rate);
    case SORT_OPTIONS.NAME_ASC:
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return arr;
  }
}
