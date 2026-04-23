'use client';
import { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Calendar, Tag, Plus, Download } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import SummaryCard from '@/components/dashboard/SummaryCard';
import MonthlyChart from '@/components/dashboard/MonthlyChart';
import CategoryChart from '@/components/dashboard/CategoryChart';
import RecentExpenses from '@/components/dashboard/RecentExpenses';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import ToastContainer from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import { useExpenses } from '@/hooks/useExpenses';
import { useToast } from '@/hooks/useToast';
import {
  formatCurrency,
  getCurrentMonthExpenses,
  getMonthlyData,
  getCategoryData,
  getTopCategory,
  exportToCSV,
} from '@/lib/utils';
import { CATEGORY_ICONS } from '@/lib/constants';

export default function DashboardPage() {
  const { expenses, isLoaded, addExpense } = useExpenses();
  const { toasts, show, dismiss } = useToast();
  const [formOpen, setFormOpen] = useState(false);

  const currentMonth = useMemo(() => getCurrentMonthExpenses(expenses), [expenses]);
  const monthlyData = useMemo(() => getMonthlyData(expenses, 6), [expenses]);
  const categoryData = useMemo(() => getCategoryData(currentMonth), [currentMonth]);
  const topCategory = useMemo(() => getTopCategory(currentMonth), [currentMonth]);

  const totalAllTime = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const totalThisMonth = useMemo(() => currentMonth.reduce((s, e) => s + e.amount, 0), [currentMonth]);
  const avgPerDay = useMemo(() => {
    if (!currentMonth.length) return 0;
    const today = new Date();
    const dayOfMonth = today.getDate();
    return totalThisMonth / dayOfMonth;
  }, [currentMonth, totalThisMonth]);

  const prevMonthData = monthlyData[monthlyData.length - 2];
  const currMonthData = monthlyData[monthlyData.length - 1];
  const monthTrend = prevMonthData?.total > 0
    ? ((currMonthData.total - prevMonthData.total) / prevMonthData.total) * 100
    : undefined;

  if (!isLoaded) {
    return (
      <AppShell title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500">Loading your data...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Dashboard"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => exportToCSV(expenses)}>
            <Download size={15} /> Export
          </Button>
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus size={15} /> Add Expense
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="This Month"
            value={formatCurrency(totalThisMonth)}
            subtitle={`${currentMonth.length} transaction${currentMonth.length !== 1 ? 's' : ''}`}
            icon={<Calendar size={18} />}
            color="indigo"
            trend={monthTrend !== undefined ? { value: monthTrend, label: 'vs last month' } : undefined}
          />
          <SummaryCard
            title="All Time"
            value={formatCurrency(totalAllTime)}
            subtitle={`${expenses.length} total expenses`}
            icon={<DollarSign size={18} />}
            color="green"
          />
          <SummaryCard
            title="Daily Average"
            value={formatCurrency(avgPerDay)}
            subtitle="This month so far"
            icon={<TrendingUp size={18} />}
            color="purple"
          />
          <SummaryCard
            title="Top Category"
            value={topCategory ? `${CATEGORY_ICONS[topCategory]} ${topCategory}` : '—'}
            subtitle="Highest spending this month"
            icon={<Tag size={18} />}
            color="amber"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <MonthlyChart data={monthlyData} />
          </div>
          <div className="lg:col-span-2">
            <CategoryChart data={categoryData} title="This Month by Category" />
          </div>
        </div>

        {/* Recent Expenses */}
        <RecentExpenses expenses={expenses} />
      </div>

      <ExpenseForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={data => {
          addExpense(data);
          show('Expense added successfully!');
        }}
      />

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </AppShell>
  );
}
