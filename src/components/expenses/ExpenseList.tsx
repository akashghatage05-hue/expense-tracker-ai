'use client';
import { useState } from 'react';
import { Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Expense, SortConfig, SortField } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

function SortIcon({ field, sort }: { field: SortField; sort: SortConfig }) {
  if (sort.field !== field) return <ChevronsUpDown size={14} className="text-gray-300" />;
  return sort.direction === 'asc'
    ? <ChevronUp size={14} className="text-indigo-500" />
    : <ChevronDown size={14} className="text-indigo-500" />;
}

export default function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const [sort, setSort] = useState<SortConfig>({ field: 'date', direction: 'desc' });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  function toggleSort(field: SortField) {
    setSort(prev =>
      prev.field === field
        ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: 'desc' }
    );
    setPage(1);
  }

  const sorted = [...expenses].sort((a, b) => {
    let cmp = 0;
    if (sort.field === 'date') cmp = a.date.localeCompare(b.date);
    else if (sort.field === 'amount') cmp = a.amount - b.amount;
    else if (sort.field === 'category') cmp = a.category.localeCompare(b.category);
    else if (sort.field === 'description') cmp = a.description.localeCompare(b.description);
    return sort.direction === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const headerCell = (label: string, field: SortField) => (
    <th
      onClick={() => toggleSort(field)}
      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-800 select-none"
    >
      <div className="flex items-center gap-1.5">
        {label}
        <SortIcon field={field} sort={sort} />
      </div>
    </th>
  );

  const deleteTarget = expenses.find(e => e.id === deleteId);

  if (!expenses.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-gray-500 font-medium">No expenses found</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {headerCell('Date', 'date')}
                {headerCell('Description', 'description')}
                {headerCell('Category', 'category')}
                {headerCell('Amount', 'amount')}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map(exp => (
                <tr key={exp.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{formatDate(exp.date)}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900 font-medium line-clamp-1">{exp.description}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge category={exp.category} />
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(exp)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteId(exp.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-gray-100">
          {paginated.map(exp => (
            <div key={exp.id} className="px-4 py-3 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{exp.description}</p>
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(exp.date)}</p>
                <div className="mt-1">
                  <Badge category={exp.category} size="sm" />
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1">
                <span className="text-sm font-bold text-gray-900">{formatCurrency(exp.amount)}</span>
                <div className="flex gap-1">
                  <button onClick={() => onEdit(exp)} className="p-1 rounded text-gray-400 hover:text-indigo-600">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteId(exp.id)} className="p-1 rounded text-gray-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Page {page} of {totalPages} · {sorted.length} results
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                Previous
              </Button>
              <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Expense" maxWidth="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900">
              &quot;{deleteTarget?.description}&quot;
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteId(null)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (deleteId) { onDelete(deleteId); setDeleteId(null); }
              }}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
