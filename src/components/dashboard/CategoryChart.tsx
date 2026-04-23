'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CategoryData } from '@/lib/types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

interface CategoryChartProps {
  data: CategoryData[];
  title?: string;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: CategoryData }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3">
      <p className="text-xs font-medium text-gray-500 mb-1">
        {CATEGORY_ICONS[d.name]} {d.name}
      </p>
      <p className="text-base font-bold text-gray-900">{formatCurrency(d.value)}</p>
      <p className="text-xs text-gray-400">{d.percentage.toFixed(1)}% of total</p>
    </div>
  );
}

export default function CategoryChart({ data, title = 'Spending by Category' }: CategoryChartProps) {
  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-6">{title}</h3>
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={68} strokeWidth={2} stroke="#fff">
                {data.map(entry => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 w-full space-y-2">
          {data.map(item => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[item.name] }}
              />
              <span className="text-xs text-gray-600 flex-1 truncate">
                {CATEGORY_ICONS[item.name]} {item.name}
              </span>
              <span className="text-xs font-semibold text-gray-900 shrink-0">
                {formatCurrency(item.value)}
              </span>
              <span className="text-xs text-gray-400 shrink-0 w-10 text-right">
                {item.percentage.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
