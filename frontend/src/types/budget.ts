import { Reducer } from 'react';
import { z } from 'zod';
import { budgetSchema } from '@/schemas/creation';
import { PaginatedApiResponse } from './api';
import { LoadingAction, SimplifiedConcurrence } from './common';
import { PaginatedParams } from './transaction';

export interface Budget {
  id: string
  name: string
  totalAmount: number
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  userId: string
  balance: {
    totalExpense: number
    totalIncome: number
  }
  transactionsCount: number
  hidden?: boolean
  concurrence?: SimplifiedConcurrence
}

export type CreateBudgetParams = z.infer<typeof budgetSchema>;

export enum BudgetActionType {
  SYNC_RECENT = 'SYNC_RECENT',
  SYNC_PAGINATED = 'SYNC_PAGINATED',
  CREATE_BUDGET = 'CREATE_BUDGET',
  SET_BUDGETS = 'SET_BUDGETS',
  SET_LOADING = 'SET_LOADING',
}

export interface SetBudgetsAction {
  type: BudgetActionType.SET_BUDGETS,
  payload: Budget[]
}

export interface SyncRecentAction {
  type: BudgetActionType.SYNC_RECENT
  payload: Budget[]
}

export interface SyncPaginatedAction {
  type: BudgetActionType.SYNC_PAGINATED
  payload: PaginatedApiResponse<Budget[]>
}

export interface CreateBudgetAction {
  type: BudgetActionType.CREATE_BUDGET
  payload: Budget | null
}

export type BudgetAction =
  | SyncRecentAction
  | SyncPaginatedAction
  | CreateBudgetAction
  | SetBudgetsAction
  | LoadingAction<BudgetActionType.SET_LOADING>;

export interface BudgetState {
  recentBudgets: Budget[]
  budgets: Budget[]
  paginatedBudgets: PaginatedApiResponse<Budget[]>
  loading: boolean
}

export type BudgetReducer = Reducer<BudgetState, BudgetAction>;

export interface BudgetContextType {
  state: BudgetState
  createBudget: (data: CreateBudgetParams) => void
  getBudgets: () => void
  getPaginatedBudgets: (options: PaginatedParams) => void
  updateRecentBudgets: () => void
}

export type BudgetBalanceChartData = {
  date: string,
  balance: number,
  amount?: number,
  description?: string
};

export interface BudgetAmountData {
  totalAmount: number;
  netAmount: number;
  amountBounds: {
    safe: {
      y1: number;
    };
    warn: {
      y1: number;
      y2: number;
    };
    danger: {
      y2: number;
    };
  };
}

export type BudgetAmountDataNullable = BudgetAmountData | null;
