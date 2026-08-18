import './Skeleton.css';

export function ProductCardSkeleton() {
  return (
    <div className="pcard skeleton-card">
      <div className="skeleton skeleton-card__media" />
      <div className="skeleton-card__body">
        <div className="skeleton skeleton-card__line" style={{ width: '40%', height: 10 }} />
        <div className="skeleton skeleton-card__line" style={{ width: '90%', height: 14 }} />
        <div className="skeleton skeleton-card__line" style={{ width: '60%', height: 14 }} />
        <div className="skeleton-card__footer">
          <div className="skeleton skeleton-card__line" style={{ width: 60, height: 18 }} />
          <div className="skeleton skeleton-card__circle" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="details-skeleton">
      <div className="skeleton details-skeleton__media" />
      <div className="details-skeleton__info">
        <div className="skeleton skeleton-card__line" style={{ width: '30%', height: 12 }} />
        <div className="skeleton skeleton-card__line" style={{ width: '80%', height: 26 }} />
        <div className="skeleton skeleton-card__line" style={{ width: '50%', height: 14 }} />
        <div className="skeleton skeleton-card__line" style={{ width: '25%', height: 32, marginTop: 12 }} />
        <div className="skeleton skeleton-card__line" style={{ width: '100%', height: 14, marginTop: 20 }} />
        <div className="skeleton skeleton-card__line" style={{ width: '95%', height: 14 }} />
        <div className="skeleton skeleton-card__line" style={{ width: '70%', height: 14 }} />
        <div className="skeleton skeleton-card__line" style={{ width: '100%', height: 48, marginTop: 20 }} />
      </div>
    </div>
  );
}
