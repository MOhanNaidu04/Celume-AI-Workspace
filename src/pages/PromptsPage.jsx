import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import Card from '../components/common/Card';
import CategoryFilter from '../components/prompts/CategoryFilter';
import PromptCard from '../components/prompts/PromptCard';

export default function PromptsPage() {
  const { promptTemplates, favorites, toggleFavorite, usePromptTemplate, setDraftPrompt } = useApp();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');

  const filtered = promptTemplates.filter((p) => !filter || p.category === filter);

  const handleUse = (prompt) => {
    usePromptTemplate(prompt.id);
    setDraftPrompt(prompt.prompt);
    notify('Prompt ready', `"${prompt.title}" loaded — head to Chat to send.`);
    navigate('/');
  };

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Prompt library</p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Manage prompts</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Browse, bookmark, and reuse productivity templates across categories.
        </p>

        <div className="mt-4">
          <CategoryFilter active={filter} onChange={setFilter} />
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            isFavorite={favorites.includes(prompt.id)}
            onBookmark={toggleFavorite}
            onUse={handleUse}
          />
        ))}
      </div>
    </div>
  );
}
