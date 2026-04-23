'use client';
import { Search, X } from 'lucide-react';
import { ExpenseFilters } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

interface ExpenseFiltersProps {
  filters: ExpenseFilters;
  onChange: (f: ExpenseFilters) => void;
  resultCount: number;
  totalCount: number;
}

export default function ExpenseFiltersBar({ filters, onChange, resultCount, totalCount }: ExpenseFiltersProps) {
  const hasActive =
    filters.searchQuery ||
    filters.category !== 'All' ||
    filters.startDate ||
    filters.endDate;

  const reset = () =>
    onChange({ searchQuery: '', category: 'All', startDate: '', endDate: '' });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.searchQuery}
            onChange={e => onChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-400 transition-colors"
          />
        </div>

        {/* Category */}
        <select
          value={filters.category}
          onChange={e => onChange({ ...filters, category: e.target.value as ExpenseFilters['category'] })}
          className="py-2 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-400 transition-colors bg-white text-gray-700"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs text-gray-500 whitespace-nowrap">Date range:</span>
          <input
            type="date"
            value={filters.startDate}
            onChange={e => onChange({ ...filters, startDate: e.target.value })}
            className="flex-1 py-1.5 px-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <span className="text-gray-400 text-sm">to</span>
          <input
            type="date"
            value={filters.endDate}
            min={filters.startDate}
            onChange={e => onChange({ ...filters, endDate: e.target.value })}
            className="flex-1 py-1.5 px-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {hasActive && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X size={13} /> Clear filters
            </button>
          )}
          <p className="text-xs text-gray-500">
            {resultCount === totalCount
              ? `${totalCount} expense${totalCount !== 1 ? 's' : ''}`
              : `${resultCount} of ${totalCount}`}
          </p>
        </div>
      </div>
    </div>
  );
}
