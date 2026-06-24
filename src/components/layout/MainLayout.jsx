import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../../hooks/useTheme';

export default function MainLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="flex min-h-screen gap-6 p-4 lg:p-6">
        <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="hidden min-w-0 flex-1 flex-col overflow-hidden lg:flex"
        >
          <Header />
          <div className="mt-4 flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </motion.div>

        <div className="flex flex-1 flex-col overflow-hidden lg:hidden">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="mb-4 rounded-2xl bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900 shadow-soft transition hover:bg-white dark:bg-slate-950/90 dark:text-white dark:hover:bg-slate-900"
          >
            Menu
          </button>
          <Header />
          <div className="mt-4 flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
