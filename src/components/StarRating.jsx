import { FiStar } from 'react-icons/fi';
import './StarRating.css';

export default function StarRating({ rate = 0, count, size = 'md' }) {
  const stars = [0, 1, 2, 3, 4];
  return (
    <div className={`star-rating star-rating--${size}`} aria-label={`Рейтинг ${rate} из 5`}>
      <div className="star-rating__stars">
        {stars.map((i) => {
          const fill = Math.min(Math.max(rate - i, 0), 1) * 100;
          return (
            <span className="star-rating__star" key={i}>
              <FiStar className="star-rating__base" aria-hidden="true" />
              <span className="star-rating__fill" style={{ width: `${fill}%` }}>
                <FiStar aria-hidden="true" />
              </span>
            </span>
          );
        })}
      </div>
      {count !== undefined && <span className="star-rating__count">({count})</span>}
    </div>
  );
}
