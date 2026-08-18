import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="header__logo-mark">TS</span>
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
            <h4>Соцсети</h4>
            <div className="footer__socials">
              <a href="#" aria-label="GitHub"><FiGithub /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© {new Date().getFullYear()} TechStore. Учебный проект.</span>
          <span className="mono footer__version">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
