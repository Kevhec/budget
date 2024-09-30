export interface Category {
  id: number;
  name: string;
  color: string;
  userId: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface CategoriesMonthlyBalance {
  month: Month;
}

export interface Month {
  '8': CategoryBalance[];
}

export interface CategoryBalance {
  totalIncome: number;
  totalExpense: number;
  category: Category;
}
