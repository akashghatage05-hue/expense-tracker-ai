import { Expense, Category, MonthlyData, CategoryData } from './types';
import { CATEGORIES } from './constants';

export function generateId(): string {
  return `exp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function isoYearMonth(dateStr: string): string {
  return dateStr.slice(0, 7);
}

function addMonths(dateStr: string, n: number): string {
  const [year, month] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(ym: string): { month: string; shortMonth: string } {
  const [year, month] = ym.split('-').map(Number);
  const d = new Date(year, month - 1, 1);
  return {
    month: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    shortMonth: d.toLocaleDateString('en-US', { month: 'short' }),
  };
}

export function getMonthlyData(expenses: Expense[], months = 6): MonthlyData[] {
  const today = todayISO();
  const currentYM = today.slice(0, 7);

  return Array.from({ length: months }, (_, i) => {
    const ym = addMonths(currentYM, -(months - 1 - i));
    const { month, shortMonth } = monthLabel(ym);
    const matching = expenses.filter(e => isoYearMonth(e.date) === ym);
    return {
      month,
      shortMonth,
      total: matching.reduce((s, e) => s + e.amount, 0),
      count: matching.length,
    };
  });
}

export function getCurrentMonthExpenses(expenses: Expense[]): Expense[] {
  const ym = todayISO().slice(0, 7);
  return expenses.filter(e => isoYearMonth(e.date) === ym);
}

export function getCategoryBreakdown(expenses: Expense[]): Record<Category, number> {
  const result = Object.fromEntries(CATEGORIES.map(c => [c, 0])) as Record<Category, number>;
  for (const e of expenses) result[e.category] += e.amount;
  return result;
}

export function getCategoryData(expenses: Expense[]): CategoryData[] {
  const breakdown = getCategoryBreakdown(expenses);
  const total = Object.values(breakdown).reduce((s, v) => s + v, 0);
  return CATEGORIES.map(c => ({
    name: c,
    value: breakdown[c],
    percentage: total > 0 ? (breakdown[c] / total) * 100 : 0,
  })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);
}

export function getTopCategory(expenses: Expense[]): Category | null {
  if (!expenses.length) return null;
  const breakdown = getCategoryBreakdown(expenses);
  const sorted = (Object.entries(breakdown) as [Category, number][]).sort((a, b) => b[1] - a[1]);
  return sorted[0][1] > 0 ? sorted[0][0] : null;
}

export function exportToCSV(expenses: Expense[]): void {
  const headers = ['Date', 'Description', 'Category', 'Amount'];
  const rows = expenses.map(e => [
    e.date,
    `"${e.description.replace(/"/g, '""')}"`,
    e.category,
    e.amount.toFixed(2),
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `expenses_${todayISO()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function getSampleExpenses(): Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>[] {
  const today = todayISO();
  const [year, month] = today.split('-').map(Number);

  const d = (daysAgo: number) => {
    const date = new Date(year, month - 1, new Date(year, month - 1, parseInt(today.split('-')[2])).getDate() - daysAgo);
    if (date.getMonth() !== month - 1) return today;
    return date.toISOString().split('T')[0];
  };

  return [
    { date: d(1), amount: 45.50, category: 'Food', description: 'Grocery shopping at Whole Foods' },
    { date: d(2), amount: 12.99, category: 'Entertainment', description: 'Netflix monthly subscription' },
    { date: d(3), amount: 35.00, category: 'Transportation', description: 'Uber ride to airport' },
    { date: d(4), amount: 89.99, category: 'Shopping', description: 'Running shoes at Nike' },
    { date: d(5), amount: 120.00, category: 'Bills', description: 'Monthly electricity bill' },
    { date: d(6), amount: 18.50, category: 'Food', description: 'Lunch at Chipotle' },
    { date: d(7), amount: 55.00, category: 'Bills', description: 'Internet service' },
    { date: d(8), amount: 22.00, category: 'Food', description: 'Coffee and snacks' },
    { date: d(10), amount: 15.00, category: 'Transportation', description: 'Monthly bus pass' },
    { date: d(12), amount: 200.00, category: 'Shopping', description: 'New winter jacket' },
    { date: d(14), amount: 9.99, category: 'Entertainment', description: 'Spotify premium' },
    { date: d(15), amount: 65.00, category: 'Food', description: 'Dinner with friends' },
    { date: d(20), amount: 30.00, category: 'Other', description: 'Birthday gift for colleague' },
    { date: d(25), amount: 85.00, category: 'Bills', description: 'Phone bill' },
    { date: d(28), amount: 42.00, category: 'Food', description: 'Weekly grocery run' },
  ];
}
