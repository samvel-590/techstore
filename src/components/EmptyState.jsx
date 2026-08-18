import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './EmptyState.css';

export default function EmptyState({ icon: Icon, title, subtitle, actionLabel, actionTo }) {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="empty-state__icon"
        initial={{ scale: 0.7, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
      >
        {Icon && <Icon />}
      </motion.div>
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="empty-state__cta">
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}
