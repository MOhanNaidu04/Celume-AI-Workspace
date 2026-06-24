import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useAccentColor } from '../hooks/useAccentColor';
import { useNotification } from '../context/NotificationContext';
import { exportChatAsText, exportChatAsJSON, downloadFile } from '../utils/exportChat';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const accentColors = {
  sky: 'bg-sky-500',
  violet: 'bg-violet-500',
  emerald: 'bg-emerald-500',
  rose: 'bg-rose-500',
};

const accentRings = {
  sky: 'ring-sky-400',
  violet: 'ring-violet-400',
  emerald: 'ring-emerald-400',
  rose: 'ring-rose-400',
};

export default function SettingsPage() {
  const { selectedChat, messages } = useApp();
  const { theme, toggleTheme } = useTheme();
  const { accentColor, changeAccentColor } = useAccentColor();
  const { notify } = useNotification();

  const handleExportText = () => {
    const content = exportChatAsText(selectedChat, messages);
    downloadFile(content, `${selectedChat.title.replace(/\s+/g, '-')}.txt`);
    notify('Export complete', 'Chat exported as text file.');
  };

  const handleExportJSON = () => {
    const content = exportChatAsJSON(selectedChat, messages);
    downloadFile(content, `${selectedChat.title.replace(/\s+/g, '-')}.json`, 'application/json');
    notify('Export complete', 'Chat exported as JSON file.');
  };

  const handleClearData = () => {
    if (window.confirm('Clear all local data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Preferences</p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Settings</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Appearance</p>
            <p className="mt-1 text-xs text-slate-500">Currently in {theme} mode</p>
            <Button variant="secondary" onClick={toggleTheme} className="mt-4">
              Switch to {theme === 'dark' ? 'light' : 'dark'} mode
            </Button>
          </div>

          <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Accent color</p>
            <div className="mt-3 flex gap-2">
              {['sky', 'violet', 'emerald', 'rose'].map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    changeAccentColor(color);
                    notify('Theme updated', `Accent color set to ${color}.`);
                  }}
                  className={`h-8 w-8 rounded-full ${accentColors[color]} ring-2 ring-offset-2 ring-offset-slate-100 transition dark:ring-offset-slate-900 ${
                    accentColor === color ? accentRings[color] : 'ring-transparent'
                  }`}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Export current chat</p>
        <p className="mt-1 text-xs text-slate-500">Download "{selectedChat.title}" as text or JSON.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={handleExportText}>Export as .txt</Button>
          <Button variant="secondary" onClick={handleExportJSON}>
            Export as .json
          </Button>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-medium text-rose-600 dark:text-rose-400">Danger zone</p>
        <p className="mt-1 text-xs text-slate-500">Clear all chats, favorites, and settings stored locally.</p>
        <Button variant="danger" onClick={handleClearData} className="mt-4">
          Clear all data
        </Button>
      </Card>
    </div>
  );
}
