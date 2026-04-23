import { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  color?: 'indigo' | 'green' | 'amber' | 'rose' | 'purple';
}

const colorMap = {
  indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100 text-indigo-600', trend: 'text-indigo-600' },
  green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-600', trend: 'text-green-600' },
  amber: { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', trend: 'text-amber-600' },
  rose: { bg: 'bg-rose-50', icon: 'bg-rose-100 text-rose-600', trend: 'text-rose-600' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', trend: 'text-purple-600' },
};

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'indigo',
}: SummaryCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${c.trend}`}>
          <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value).toFixed(0)}%</span>
          <span className="text-gray-400 font-normal">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
