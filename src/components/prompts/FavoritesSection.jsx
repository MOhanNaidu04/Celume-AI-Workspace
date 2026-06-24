import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import PromptCard from './PromptCard';

export default function FavoritesSection({ onUsePrompt }) {
  const { promptTemplates, favorites, toggleFavorite } = useApp();

  const saved = promptTemplates.filter((p) => favorites.includes(p.id));

  return (
    <Card>
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Saved</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Favorite prompts</h3>
      </div>

      {saved.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Bookmark prompt templates to quickly reuse them here.
        </p>
      ) : (
        <div className="space-y-3">
          {saved.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              isFavorite
              onBookmark={toggleFavorite}
              onUse={(p) => onUsePrompt?.(p.prompt, p.id)}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
