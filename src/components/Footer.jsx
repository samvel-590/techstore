import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiHeart, FiShoppingBag } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="header__logo-mark"><i />TS</span>
            <span className="footer__logo-text">Tech<em>Store</em></span>
          </div>
          <p className="footer__tagline">Технология, выбранная с точностью.</p>
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <h4>Каталог</h4>
            <Link to="/catalog?category=electronics">Электроника</Link>
            <Link to="/catalog?category=jewelery">Аксессуары</Link>
            <Link to="/catalog?category=men's clothing">Мужское</Link>
            <Link to="/catalog?category=women's clothing">Женское</Link>
          </div>
          <div className="footer__col">
            <h4>Покупателям</h4>
            <Link to="/cart">Корзина</Link>
            <Link to="/favorites">Избранное</Link>
            <Link to="/catalog">Все товары</Link>
          </div>
          <div className="footer__col">
            <h4>Быстрый доступ</h4>
            <div className="footer__socials">
              <Link to="/catalog" aria-label="Открыть каталог"><FiArrowUpRight /></Link>
              <Link to="/favorites" aria-label="Открыть избранное"><FiHeart /></Link>
              <Link to="/cart" aria-label="Открыть корзину"><FiShoppingBag /></Link>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© {new Date().getFullYear()} TechStore. Технологии, выбранные точно.</span>
          <span className="mono footer__version">DESIGNED FOR EVERYDAY</span>
        </div>
      </div>
    </footer>
  );
}
