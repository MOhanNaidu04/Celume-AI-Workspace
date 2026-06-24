import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import StatCard from './StatCard';
import CategoryChart from './CategoryChart';

export default function AnalyticsCard() {
  const { analytics } = useApp();

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Insights</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Quick stats</h3>
        </div>
        <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          Live
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Total chats" value={analytics.totalChats} />
        <StatCard label="Messages" value={analytics.totalMessages} />
        <StatCard
          label="Top category"
          value={analytics.categoryUsage.sort((a, b) => b.value - a.value)[0]?.name ?? '—'}
        />
      </div>

      <div className="mt-4 h-48 rounded-2xl bg-slate-100 p-3 dark:bg-slate-900">
        <CategoryChart data={analytics.categoryUsage} />
      </div>
    </Card>
  );
}
