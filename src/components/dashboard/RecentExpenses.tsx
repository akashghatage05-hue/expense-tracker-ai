import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Expense } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface RecentExpensesProps {
  expenses: Expense[];
}

export default function RecentExpenses({ expenses }: RecentExpensesProps) {
  const recent = [...expenses]
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">Recent Expenses</h3>
        <Link
          href="/expenses"
          className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          View all <ArrowRight size={13} />
        </Link>
      </div>

      {!recent.length ? (
        <div className="px-6 py-10 text-center">
          <p className="text-gray-400 text-sm">No expenses yet. Add your first one!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {recent.map(exp => (
            <div key={exp.id} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{exp.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(exp.date)}</p>
              </div>
              <Badge category={exp.category} size="sm" />
              <span className="text-sm font-bold text-gray-900 shrink-0">{formatCurrency(exp.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
