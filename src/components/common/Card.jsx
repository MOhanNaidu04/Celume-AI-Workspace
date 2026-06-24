import { motion } from 'framer-motion';

export default function Card({ children, className = '', padding = 'p-5' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={`rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-950/95 ${padding} ${className}`}
    >
      {children}
    </motion.section>
  );
}
