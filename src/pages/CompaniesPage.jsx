import { useState } from 'react';
import Card from '../components/common/Card';

export default function CompaniesPage() {
  const [companies] = useState([]);

  return (
    <div className="h-full space-y-6 overflow-y-auto p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950 dark:text-slate-100">Companies</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Manage your company information</p>
      </div>

      {companies.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <p className="text-6xl mb-4">🏢</p>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No companies yet</h2>
            <p className="text-slate-600 dark:text-slate-400">Add a company to get started</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card key={company.id} className="p-4 cursor-pointer hover:shadow-lg transition">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{company.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{company.industry}</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-3">{company.email}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
