'use client';
import { CategoryData } from '@/lib/types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

interface CategoryBreakdownProps {
  data: CategoryData[];
  totalAmount: number;
}

export default function CategoryBreakdown({ data, totalAmount }: CategoryBreakdownProps) {
  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Category Breakdown</h3>
        <div className="py-10 text-center text-gray-400 text-sm">No data available</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-700">Category Breakdown</h3>
        <span className="text-xs font-medium text-gray-500">Total: {formatCurrency(totalAmount)}</span>
      </div>
      <div className="space-y-4">
        {data.map(item => (
          <div key={item.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span>{CATEGORY_ICONS[item.name]}</span>
                <span className="font-medium text-gray-800">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{item.percentage.toFixed(1)}%</span>
                <span className="font-semibold text-gray-900">{formatCurrency(item.value)}</span>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: CATEGORY_COLORS[item.name],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
