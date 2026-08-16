const BASE_URL = 'https://fakestoreapi.com';

async function request(path, { minDelay = 400 } = {}) {
  const start = Date.now();
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Ошибка сети: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const elapsed = Date.now() - start;
  if (elapsed < minDelay) {
    await new Promise((r) => setTimeout(r, minDelay - elapsed));
  }
  return data;
}

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
  const data = await request('/products');
  return data.map(enrichProduct);
}

export async function fetchProductById(id) {
  const data = await request(`/products/${id}`, { minDelay: 250 });
  return enrichProduct(data);
}

export async function fetchCategories() {
  return request('/products/categories', { minDelay: 0 });
}

export async function fetchProductsByCategory(category) {
  const data = await request(`/products/category/${encodeURIComponent(category)}`);
  return data.map(enrichProduct);
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
