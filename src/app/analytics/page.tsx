'use client';
import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3, DollarSign, Receipt } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import MonthlyTrend from '@/components/analytics/MonthlyTrend';
import CategoryBreakdown from '@/components/analytics/CategoryBreakdown';
import CategoryChart from '@/components/dashboard/CategoryChart';
import { useExpenses } from '@/hooks/useExpenses';
import {
  formatCurrency,
  getMonthlyData,
  getCategoryData,
  getCurrentMonthExpenses,
} from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  highlight?: 'up' | 'down' | 'neutral';
}

function StatCard({ label, value, sub, icon, highlight }: StatCardProps) {
  const TrendIcon = highlight === 'up' ? TrendingUp : highlight === 'down' ? TrendingDown : Minus;
  const trendColor = highlight === 'up' ? 'text-green-500' : highlight === 'down' ? 'text-red-500' : 'text-gray-400';
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && (
        <div className={`flex items-center gap-1 mt-1 text-xs ${trendColor}`}>
          {highlight && <TrendIcon size={12} />}
          <span className="text-gray-500">{sub}</span>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const { expenses, isLoaded } = useExpenses();

  const monthlyData12 = useMemo(() => getMonthlyData(expenses, 12), [expenses]);
  const currentMonthExpenses = useMemo(() => getCurrentMonthExpenses(expenses), [expenses]);
  const allCategoryData = useMemo(() => getCategoryData(expenses), [expenses]);
  const monthCategoryData = useMemo(() => getCategoryData(currentMonthExpenses), [currentMonthExpenses]);

  const totalAllTime = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const totalThisMonth = useMemo(() => currentMonthExpenses.reduce((s, e) => s + e.amount, 0), [currentMonthExpenses]);

  const validMonths = monthlyData12.filter(m => m.total > 0);
  const avgMonthlySpend = validMonths.length
    ? validMonths.reduce((s, m) => s + m.total, 0) / validMonths.length
    : 0;

  const maxMonth = monthlyData12.reduce((max, m) => (m.total > max.total ? m : max), monthlyData12[0]);
  const minNonZeroMonth = monthlyData12
    .filter(m => m.total > 0)
    .reduce((min, m) => (m.total < min.total ? m : min), monthlyData12.filter(m => m.total > 0)[0] ?? monthlyData12[0]);

  const prevMonth = monthlyData12[monthlyData12.length - 2];
  const currMonth = monthlyData12[monthlyData12.length - 1];
  const monthChange = prevMonth?.total > 0
    ? ((currMonth.total - prevMonth.total) / prevMonth.total) * 100
    : 0;

  if (!isLoaded) {
    return (
      <AppShell title="Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Analytics">
      <div className="space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="All-time total"
            value={formatCurrency(totalAllTime)}
            sub={`${expenses.length} expenses`}
            icon={<DollarSign size={18} />}
          />
          <StatCard
            label="This month"
            value={formatCurrency(totalThisMonth)}
            sub={monthChange !== 0 ? `${monthChange > 0 ? '+' : ''}${monthChange.toFixed(1)}% vs last month` : 'No comparison data'}
            icon={<Receipt size={18} />}
            highlight={monthChange > 5 ? 'up' : monthChange < -5 ? 'down' : 'neutral'}
          />
          <StatCard
            label="Avg monthly spend"
            value={formatCurrency(avgMonthlySpend)}
            sub="Based on active months"
            icon={<BarChart3 size={18} />}
          />
          <StatCard
            label="Peak month"
            value={maxMonth?.total ? formatCurrency(maxMonth.total) : '—'}
            sub={maxMonth?.month ?? ''}
            icon={<TrendingUp size={18} />}
            highlight={maxMonth?.total ? 'up' : 'neutral'}
          />
        </div>

        {/* Trend + category pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <MonthlyTrend data={monthlyData12} />
          </div>
          <div>
            <CategoryChart data={monthCategoryData} title="This Month" />
          </div>
        </div>

        {/* Category breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CategoryBreakdown data={allCategoryData} totalAmount={totalAllTime} />

          {/* Monthly top expenses */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Month-over-Month</h3>
            {monthlyData12.length ? (
              <div className="space-y-3">
                {[...monthlyData12].reverse().slice(0, 6).map(m => {
                  const maxTotal = Math.max(...monthlyData12.map(x => x.total), 1);
                  return (
                    <div key={m.month} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-12 shrink-0">{m.shortMonth}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${(m.total / maxTotal) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-800 w-20 text-right shrink-0">
                        {formatCurrency(m.total)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No data available</p>
            )}

            {minNonZeroMonth && maxMonth && minNonZeroMonth.month !== maxMonth.month && (
              <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-xs text-green-600 font-medium mb-1">Best month</p>
                  <p className="text-sm font-bold text-green-700">{minNonZeroMonth.shortMonth}</p>
                  <p className="text-xs text-green-600">{formatCurrency(minNonZeroMonth.total)}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3">
                  <p className="text-xs text-red-600 font-medium mb-1">Highest spend</p>
                  <p className="text-sm font-bold text-red-700">{maxMonth.shortMonth}</p>
                  <p className="text-xs text-red-600">{formatCurrency(maxMonth.total)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
