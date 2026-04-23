'use client';
import { useState, useEffect } from 'react';
import { Expense, Category } from '@/lib/types';
import { CATEGORIES, CATEGORY_ICONS } from '@/lib/constants';
import { todayISO } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface FormData {
  date: string;
  amount: string;
  category: Category;
  description: string;
}

interface FormErrors {
  date?: string;
  amount?: string;
  description?: string;
}

const defaultForm: FormData = {
  date: todayISO(),
  amount: '',
  category: 'Food',
  description: '',
};

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editExpense?: Expense | null;
}

export default function ExpenseForm({ isOpen, onClose, onSubmit, editExpense }: ExpenseFormProps) {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editExpense) {
      setForm({
        date: editExpense.date,
        amount: editExpense.amount.toString(),
        category: editExpense.category,
        description: editExpense.description,
      });
    } else {
      setForm({ ...defaultForm, date: todayISO() });
    }
    setErrors({});
  }, [editExpense, isOpen]);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.date) e.date = 'Date is required';
    else if (form.date > todayISO()) e.date = 'Date cannot be in the future';

    const amt = parseFloat(form.amount);
    if (!form.amount) e.amount = 'Amount is required';
    else if (isNaN(amt) || amt <= 0) e.amount = 'Enter a valid positive amount';
    else if (amt > 1_000_000) e.amount = 'Amount seems too large';

    if (!form.description.trim()) e.description = 'Description is required';
    else if (form.description.trim().length < 3) e.description = 'At least 3 characters required';
    else if (form.description.trim().length > 200) e.description = 'Max 200 characters';

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      onSubmit({
        date: form.date,
        amount: parseFloat(parseFloat(form.amount).toFixed(2)),
        category: form.category,
        description: form.description.trim(),
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editExpense ? 'Edit Expense' : 'Add Expense'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            required
            max={todayISO()}
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            error={errors.date}
          />
          <Input
            label="Amount"
            type="number"
            required
            placeholder="0.00"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            error={errors.amount}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setForm(f => ({ ...f, category: cat }))}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                  form.category === cat
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                <span className="truncate">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            placeholder="What was this expense for?"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              errors.description ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={submitting} className="flex-1">
            {editExpense ? 'Save Changes' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
