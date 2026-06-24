import { categories } from '../../data/categories';

export default function CategoryFilter({ active, onChange, size = 'sm' }) {
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('')}
        className={`rounded-full font-medium transition duration-500 ${sizeClass} ${
          !active
            ? 'bg-accent-500 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`rounded-full font-medium transition duration-500 ${sizeClass} ${
            active === cat.id
              ? 'bg-accent-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
