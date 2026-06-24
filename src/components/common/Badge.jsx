const colors = {
  marketing: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  sales: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  hr: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  coding: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  business: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
};

export default function Badge({ category, label, className = '' }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${colors[category] ?? colors.business} ${className}`}
    >
      {label ?? category}
    </span>
  );
}
