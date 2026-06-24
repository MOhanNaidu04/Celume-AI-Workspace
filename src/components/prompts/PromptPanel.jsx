import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import CategoryFilter from './CategoryFilter';
import PromptCard from './PromptCard';

export default function PromptPanel({ filter, onFilter, compact = false }) {
  const { promptTemplates, favorites, toggleFavorite } = useApp();

  const filtered = promptTemplates.filter((p) => !filter || p.category === filter);
  const display = compact ? filtered.slice(0, 3) : filtered;

  return (
    <Card className={compact ? '' : 'h-full'}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Productivity</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Prompt templates</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          {favorites.length} saved
        </span>
      </div>

      <CategoryFilter active={filter} onChange={onFilter} />

      <div className={`mt-4 space-y-3 ${compact ? 'max-h-64 overflow-y-auto' : ''}`}>
        {display.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            isFavorite={favorites.includes(prompt.id)}
            onBookmark={toggleFavorite}
            onUse={() => {}}
          />
        ))}
      </div>
    </Card>
  );
}
