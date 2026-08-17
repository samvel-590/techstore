import { createContext, useContext, useCallback, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';
import './toast.css';

const ToastContext = createContext(null);
let idCounter = 0;

const ICONS = {
  success: FiCheckCircle,
  error: FiXCircle,
  info: FiInfo,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = 'success', duration = 2600) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      window.setTimeout(() => remove(id), duration);
      return id;
    },
    [remove]
  );

  const api = useMemo(
    () => ({
      show: push,
      success: (msg, d) => push(msg, 'success', d),
      error: (msg, d) => push(msg, 'error', d),
      info: (msg, d) => push(msg, 'info', d),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-stack" role="region" aria-live="polite" aria-label="Уведомления">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type] || FiInfo;
            return (
              <motion.div
                key={t.id}
                className={`toast toast--${t.type}`}
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                layout
              >
                <Icon className="toast__icon" aria-hidden="true" />
                <span className="toast__msg">{t.message}</span>
                <button
                  className="toast__close"
                  onClick={() => remove(t.id)}
                  aria-label="Закрыть уведомление"
                >
                  <FiX />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
