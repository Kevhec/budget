import { Reducer } from 'react';
import { LoadingAction } from './common';

export interface Category {
  id: string;
  name: string;
  color: string;
  key: string;
  userId: string;
  updatedAt: string;
  createdAt: string;
}

export interface CategoriesMonthlyBalance {
  month: number;
  balance: Balance[];
}

export interface Balance {
  totalIncome: number;
  totalExpense: number;
  category: Category;
}

export enum CategoryActionType {
  SYNC_CATEGORIES = 'SYNC_CATEGORIES',
  SET_LOADING = 'SET_LOADING',
  GET_BALANCE = 'GET_BALANCE',
}

export interface SyncCategoriesAction {
  type: CategoryActionType.SYNC_CATEGORIES,
  payload: Category[],
}

export interface GetBalanceAction {
  type: CategoryActionType.GET_BALANCE,
  payload: CategoriesMonthlyBalance | null
}

export type CategoryAction =
  | SyncCategoriesAction
  | GetBalanceAction
  | LoadingAction<CategoryActionType.SET_LOADING>;

export interface CategoryState {
  categories: Category[]
  monthBalance: CategoriesMonthlyBalance | null
  loading: boolean
}

export type CategoryReducer = Reducer<CategoryState, CategoryAction>;

export interface CategoriesContextType {
  state: CategoryState
  updateBalance: () => void
}
