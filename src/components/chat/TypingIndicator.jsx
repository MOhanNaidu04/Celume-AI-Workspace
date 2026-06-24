import { motion } from 'framer-motion';
import { formatTime } from '../../utils/formatTime';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[85%] self-start rounded-3xl bg-slate-100 p-5 shadow-soft dark:bg-slate-900"
    >
      <div className="flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold">AI Assistant</span>
        <span>{formatTime()}</span>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-accent-400"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
        <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">Thinking...</span>
      </div>
    </motion.div>
  );
}
