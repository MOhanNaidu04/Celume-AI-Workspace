import { motion } from 'framer-motion';

const typeStyles = {
  success: 'border-emerald-500/30 bg-white dark:bg-slate-900',
  error: 'border-rose-500/30 bg-white dark:bg-slate-900',
  info: 'border-sky-500/30 bg-white dark:bg-slate-900',
};

export default function Toast({ title, message, type = 'success', onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      className={`min-w-[280px] max-w-sm rounded-2xl border p-4 shadow-lg ${typeStyles[type] ?? typeStyles.info}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Dismiss"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}
