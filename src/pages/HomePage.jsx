import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';

const suggestions = [
  {
    title: 'Write a script',
    text: 'Write a TypeScript script that fetches data from an API and processes it.',
  },
  {
    title: 'Analyze document',
    text: 'Analyze this document and provide a comprehensive summary with key insights.',
  },
  {
    title: 'Brainstorm ideas',
    text: 'Brainstorm 10 innovative product ideas for AI-powered tools in 2025.',
  },
  {
    title: 'Research topic',
    text: 'Provide a comprehensive research overview on quantum computing and its applications.',
  },
];

export default function HomePage() {
  const { loading, sendMessage, draftPrompt, setDraftPrompt } = useApp();
  const { notify } = useNotification();
  const [promptText, setPromptText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (draftPrompt) {
      setPromptText(draftPrompt);
      setDraftPrompt('');
    }
  }, [draftPrompt, setDraftPrompt]);

  const handleSend = async () => {
    if (!promptText.trim()) return;
    const text = promptText;
    setPromptText('');
    await sendMessage(text, notify);
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcript;
        else interim += transcript;
      }
      setPromptText((prev) => (prev ? prev + ' ' + final + interim : final + interim));
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (e) {}
      recognitionRef.current = null;
    };
  }, []);

  const toggleListen = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      notify('Voice not supported', 'Your browser does not support speech recognition.');
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (e) {}
    }
  };

  const handleSelectTemplate = (text) => {
    setPromptText(text);
    notify('Template loaded', 'Prompt inserted into the input box.');
  };

  return (
    <div className="w-full px-4 py-10 text-slate-950 dark:text-white">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="rounded-3xl border border-white/70 bg-white/80 p-10 shadow-lg shadow-slate-200/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-slate-950/5"
        >
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-accent-500 dark:text-accent-400">Celume AI</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white">Good afternoon, Mohan</h1>
          </div>

          <div className="mt-10 rounded-3xl bg-white/70 p-6 backdrop-blur-lg dark:bg-slate-900/70">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-300">How can I help you today?</p>
              <span className="hidden sm:inline rounded-full bg-white/5 dark:bg-white/[0.02] backdrop-blur-lg px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-700 dark:text-slate-100">Celume Ultra 3.1</span>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-soft backdrop-blur-lg dark:bg-slate-950">
              <button
                type="button"
                onClick={() => setPromptText('')}
                className="h-12 w-12 rounded-full bg-accent-500 text-lg font-bold text-white transition hover:bg-accent-600"
              >
                +
              </button>
              <input
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                placeholder="Ask anything"
                className="flex-1 bg-transparent text-base text-slate-950 dark:text-white outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={toggleListen}
                className="ml-2 h-12 rounded-full bg-accent-500 px-6 text-sm font-semibold text-white transition hover:bg-accent-600"
              >
                {isListening ? 'Stop' : 'Record'}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion.title}
              type="button"
              onClick={() => handleSelectTemplate(suggestion.text)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.24, delay: index * 0.05 }}
              className="cursor-pointer rounded-2xl border border-white/70 bg-white/70 p-6 text-left shadow-soft backdrop-blur-lg transition hover:bg-white dark:border-slate-800 dark:bg-slate-950/70 dark:hover:bg-slate-900"
            >
              <p className="text-sm font-semibold text-slate-950 dark:text-white">{suggestion.title}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{suggestion.text}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
