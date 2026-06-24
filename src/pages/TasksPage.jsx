import { useState } from 'react';
import Card from '../components/common/Card';

export default function TasksPage() {
  const [tasks] = useState([]);

  return (
    <div className="h-full space-y-6 overflow-y-auto p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950 dark:text-slate-100">Tasks</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Track and manage your tasks</p>
      </div>

      {tasks.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <p className="text-6xl mb-4">✅</p>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No tasks yet</h2>
            <p className="text-slate-600 dark:text-slate-400">Create a new task to get started</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition">
              <input type="checkbox" className="w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{task.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
              </div>
              <span className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-full">
                {task.status}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
