import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import PageTransition from '../components/PageTransition';
import './NotFound.css';

export default function NotFound() {
  return (
    <PageTransition>
      <div className="container not-found">
        <motion.span
          className="not-found__code mono"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.span>
        <motion.div
          className="not-found__scan"
          animate={{ x: ['-30%', '130%'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Страница не найдена
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          Похоже, такого товара или раздела не существует, либо ссылка устарела.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.26 }}
        >
          <Link to="/" className="btn btn--primary">
            <FiArrowLeft /> На главную
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
}
