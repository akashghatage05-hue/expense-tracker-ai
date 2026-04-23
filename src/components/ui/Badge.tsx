import { Category } from '@/lib/types';
import { CATEGORY_BG, CATEGORY_ICONS } from '@/lib/constants';

interface BadgeProps {
  category: Category;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export default function Badge({ category, showIcon = true, size = 'md' }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClass} ${CATEGORY_BG[category]}`}>
      {showIcon && <span>{CATEGORY_ICONS[category]}</span>}
      {category}
    </span>
  );
}
