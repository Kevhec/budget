import { Reducer } from 'react';
import { z } from 'zod';
import { budgetSchema } from '@/schemas/creation';
import { PaginatedApiResponse } from './api';
import { LoadingAction, SimplifiedConcurrence } from './common';
import { PaginatedParams } from './transaction';

export interface Budget {
  id: string
  name: string
  totalAmount: string
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  userId: string
  hidden?: boolean
  concurrence?: SimplifiedConcurrence
  balance: {
    totalExpense: number
    totalIncome: number
  }
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
