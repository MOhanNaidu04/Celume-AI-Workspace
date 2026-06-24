import { motion } from 'framer-motion';
import Button from '../common/Button';

export default function ChatInput({ value, onChange, onSend, loading, quickTemplates, onSelectTemplate }) {
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
      className="p-4 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your prompt, or choose a template below..."
          rows={3}
          disabled={loading}
          className="min-h-[100px] w-full resize-none bg-white/5 dark:bg-white/[0.02] backdrop-blur-md px-5 py-4 text-sm text-slate-950 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 disabled:opacity-60 focus:outline-none"
        />
        <Button
          onClick={() => onSend(value)}
          disabled={!value.trim() || loading}
          className="h-fit self-end px-6 py-4 sm:self-auto"
        >
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </div>

      {quickTemplates?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {quickTemplates.map((template) => (
            <motion.button
              key={template.id}
              type="button"
              onClick={() => onSelectTemplate(template.prompt)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-lg bg-white/5 dark:bg-white/[0.02] backdrop-blur-md px-3 py-2 text-left text-xs text-slate-900 dark:text-slate-100 transition hover:bg-white/10 dark:hover:bg-white/[0.03]"
            >
              {template.title}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
