import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '../../utils/formatTime';

export default function MessageBubble({ message, index, onCopy, onRewrite }) {
  const isAssistant = message.role === 'assistant';
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      layout
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className={`flex w-full ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      <div
        className={`max-w-[96%] min-w-0 rounded-2xl border p-3 sm:max-w-[85%] sm:rounded-3xl sm:p-5 ${
          isAssistant
            ? 'border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900'
            : 'border-accent-500 bg-accent-500'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex items-center gap-3 text-[11px] sm:text-xs ${
              isAssistant ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-white/80'
            }`}
          >
            <span className="font-semibold">{isAssistant ? 'AI Assistant' : 'You'}</span>
            <span className="shrink-0">{message.timestamp ?? formatTime()}</span>
          </div>

          {!isAssistant && (
            <div ref={menuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                className="rounded-lg p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Message actions"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6h.01M12 12h.01M12 18h.01" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-8 z-30 w-40 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-950">
                  <button
                    type="button"
                    onClick={() => {
                      onCopy?.(message.text);
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onRewrite?.(message.text);
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Rewrite
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <p
          className={`mt-3 whitespace-pre-wrap break-words text-sm leading-6 sm:leading-7 ${
            isAssistant ? 'text-slate-800 dark:text-slate-100' : 'text-slate-950 dark:text-white'
          }`}
        >
          {message.text}
        </p>
      </div>
    </motion.div>
  );
}
