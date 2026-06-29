import { motion } from 'framer-motion';
import Button from '../common/Button';

export default function ChatInput({ value, onChange, onSend, loading, quickTemplates, onSelectTemplate, onCopyPrompt }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="border-t border-slate-200/80 bg-slate-50/90 p-3 shadow-[0_-1px_0_rgba(255,255,255,0.7)] sm:p-4 sm:pb-6 dark:border-slate-800/80 dark:bg-slate-950/70 dark:shadow-[0_-1px_0_rgba(15,23,42,0.35)]"
    >
      <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your prompt, or choose a template below..."
          rows={3}
          disabled={loading}
          className="min-h-[112px] w-full resize-none rounded-2xl border border-slate-300/90 bg-white px-4 py-4 text-sm text-slate-950 shadow-sm shadow-slate-200/40 placeholder:text-slate-500 transition focus:border-accent-500 focus:bg-white focus:shadow-[0_0_0_4px_rgb(var(--accent-500)/0.12)] focus:outline-none disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100 dark:placeholder:text-slate-400 dark:shadow-slate-950/20 dark:focus:bg-slate-900"
        />
        <Button
          onClick={() => onSend(value)}
          disabled={!value.trim() || loading}
          className="h-fit w-full self-end px-6 py-4 sm:w-auto sm:self-auto"
        >
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">Draft your prompt here, then copy or send it.</p>
        <Button variant="secondary" onClick={() => onCopyPrompt?.(value)} disabled={!value.trim()} className="!rounded-xl !px-3 !py-2 text-xs">
          Copy prompt
        </Button>
      </div>

      {quickTemplates?.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {quickTemplates.map((template) => (
            <motion.button
              key={template.id}
              type="button"
              onClick={() => onSelectTemplate(template.prompt)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="max-w-[80vw] shrink-0 rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-left text-xs text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-white/[0.02] dark:text-slate-100 dark:hover:bg-white/[0.04] sm:max-w-xs"
            >
              {template.title}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
