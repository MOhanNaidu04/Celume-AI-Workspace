import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '../common/Button';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';

export default function ChatWindow({
  activeChat,
  messages,
  loading,
  promptValue,
  onPromptChange,
  onSendMessage,
  onSelectTemplate,
  quickTemplates,
  onExportText,
  onExportJSON,
  onNewChat,
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      className="flex h-[calc(100vh-12rem)] min-h-[480px] flex-col rounded-3xl border border-white/70 bg-white/80 shadow-lg shadow-slate-200/5 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-slate-950/5 lg:h-[calc(100vh-8rem)]"
    >
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Active thread</p>
          <h1 className="text-xl font-semibold text-slate-950 dark:text-slate-100 sm:text-2xl">
            {activeChat.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{activeChat.lastMessage}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={onNewChat} className="!rounded-xl !px-3 !py-2">
            New chat
          </Button>
          <Button variant="secondary" onClick={onExportText} className="!rounded-xl !px-3 !py-2">
            Export TXT
          </Button>
          <Button variant="secondary" onClick={onExportJSON} className="!rounded-xl !px-3 !py-2">
            JSON
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-1 flex-col items-center justify-center text-center"
          >
            <div className="bg-white/5 dark:bg-white/[0.02] backdrop-blur-md p-6">
              <p className="text-lg font-semibold text-slate-950 dark:text-slate-100">
                Start a conversation
              </p>
              <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400">
                Ask a question or pick a prompt template. AI responses are simulated with predefined
                answers based on your keywords.
              </p>
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <MessageBubble key={`${message.role}-${index}-${message.timestamp}`} message={message} index={index} />
          ))}
        </AnimatePresence>

        {loading && <TypingIndicator />}
      </div>

      <ChatInput
        value={promptValue}
        onChange={onPromptChange}
        onSend={onSendMessage}
        loading={loading}
        quickTemplates={quickTemplates}
        onSelectTemplate={onSelectTemplate}
      />
    </motion.div>
  );
}
