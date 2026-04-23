'use client';
import { useState, useMemo } from 'react';
import { Plus, Download } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import ExpenseFiltersBar from '@/components/expenses/ExpenseFilters';
import ExpenseList from '@/components/expenses/ExpenseList';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import ToastContainer from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import { useExpenses } from '@/hooks/useExpenses';
import { useToast } from '@/hooks/useToast';
import { Expense, ExpenseFilters } from '@/lib/types';
import { exportToCSV } from '@/lib/utils';

const defaultFilters: ExpenseFilters = {
  searchQuery: '',
  category: 'All',
  startDate: '',
  endDate: '',
};

export default function ExpensesPage() {
  const { expenses, isLoaded, addExpense, updateExpense, deleteExpense } = useExpenses();
  const { toasts, show, dismiss } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [filters, setFilters] = useState<ExpenseFilters>(defaultFilters);

  const filtered = useMemo(() => {
    return expenses.filter(e => {
      if (filters.category !== 'All' && e.category !== filters.category) return false;
      if (filters.startDate && e.date < filters.startDate) return false;
      if (filters.endDate && e.date > filters.endDate) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (!e.description.toLowerCase().includes(q) && !e.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [expenses, filters]);

  function openEdit(expense: Expense) {
    setEditExpense(expense);
    setFormOpen(true);
  }

  function handleClose() {
    setFormOpen(false);
    setEditExpense(null);
  }

  function handleSubmit(data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) {
    if (editExpense) {
      updateExpense(editExpense.id, data);
      show('Expense updated successfully!');
    } else {
      addExpense(data);
      show('Expense added successfully!');
    }
  }

  function handleDelete(id: string) {
    deleteExpense(id);
    show('Expense deleted', 'info');
  }

  if (!isLoaded) {
    return (
      <AppShell title="Expenses">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Expenses"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => exportToCSV(filtered)}>
            <Download size={15} /> Export CSV
          </Button>
          <Button size="sm" onClick={() => { setEditExpense(null); setFormOpen(true); }}>
            <Plus size={15} /> Add Expense
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <ExpenseFiltersBar
          filters={filters}
          onChange={f => { setFilters(f); }}
          resultCount={filtered.length}
          totalCount={expenses.length}
        />
        <ExpenseList expenses={filtered} onEdit={openEdit} onDelete={handleDelete} />
      </div>

      <ExpenseForm
        isOpen={formOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        editExpense={editExpense}
      />

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </AppShell>
  );
}
