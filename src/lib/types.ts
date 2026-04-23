export type Category = 'Food' | 'Transportation' | 'Entertainment' | 'Shopping' | 'Bills' | 'Other';

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: Category;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFilters {
  startDate: string;
  endDate: string;
  category: Category | 'All';
  searchQuery: string;
}

export type SortField = 'date' | 'amount' | 'category' | 'description';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface MonthlyData {
  month: string;
  shortMonth: string;
  total: number;
  count: number;
}

export interface CategoryData {
  name: Category;
  value: number;
  percentage: number;
}
