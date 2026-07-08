export type Category = 'food' | 'travel' | 'shopping' | 'bills' | 'other';

export interface CategoryInfo {
  id: Category;
  label: string;
  icon: string; // Lucide icon name
  color: string; // Tailwind class background/text colors
  bgClass: string;
  textClass: string;
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  category: Category;
  time: string;
  date: string;
  isExpense: boolean;
}

export type ThemeAccent = 'teal' | 'blue' | 'emerald' | 'indigo' | 'rose';

export interface ThemeConfig {
  id: ThemeAccent;
  name: string;
  primary: string; // e.g. 'bg-teal-600 hover:bg-teal-700'
  accentText: string; // e.g. 'text-teal-600'
  accentBg: string; // e.g. 'bg-teal-50'
  gradient: string; // e.g. 'from-teal-500 to-blue-600'
  glow: string; // e.g. 'shadow-teal-500/20'
}

export interface MonthlyBudget {
  total: number;
  spent: number;
  income: number;
}
