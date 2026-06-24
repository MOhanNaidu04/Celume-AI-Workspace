export default function StatCard({ label, value, subtext }) {
  return (
    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-slate-100">{value}</p>
      {subtext && <p className="mt-1 text-xs text-slate-400">{subtext}</p>}
    </div>
  );
}
