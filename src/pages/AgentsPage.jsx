import { useState } from 'react';
import Card from '../components/common/Card';

export default function AgentsPage() {
  const [agents] = useState([]);

  return (
    <div className="h-full space-y-6 overflow-y-auto p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950 dark:text-slate-100">Agents</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Manage your AI agents</p>
      </div>

      {agents.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <p className="text-6xl mb-4">🤖</p>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No agents yet</h2>
            <p className="text-slate-600 dark:text-slate-400">Create a new agent to get started</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.id} className="p-4 cursor-pointer hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <p className="text-3xl">🤖</p>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{agent.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{agent.type}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{agent.description}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
