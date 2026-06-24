export const categories = [
  { id: 'marketing', label: 'Marketing', color: 'sky' },
  { id: 'sales', label: 'Sales', color: 'emerald' },
  { id: 'hr', label: 'HR', color: 'violet' },
  { id: 'coding', label: 'Coding', color: 'amber' },
  { id: 'business', label: 'Business', color: 'rose' },
];

export const getCategoryLabel = (id) =>
  categories.find((c) => c.id === id)?.label ?? 'General';
