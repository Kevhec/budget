import { Category } from './category';

export enum TransactionType {
  Income = 'income',
  Expense = 'expense',
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: TransactionType;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  budgetId: number;
  category: Category | null;
  hidden?: boolean
}
