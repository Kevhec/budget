import { Reducer } from 'react';
import { z } from 'zod';
import { budgetSchema } from '@/schemas/creation';
import { PaginatedApiResponse } from './api';
import { LoadingAction } from './common';

export interface Budget {
  id: string
  name: string
  totalAmount: string
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  userId: string
}

export type CreateBudgetParams = z.infer<typeof budgetSchema>;

export enum BudgetActionType {
  SYNC_BUDGETS = 'SYNC_BUDGETS',
  CREATE_BUDGET = 'CREATE_BUDGET',
  SET_LOADING = 'SET_LOADING',
}

export interface SyncBudgetsAction {
  type: BudgetActionType.SYNC_BUDGETS
  payload: PaginatedApiResponse<Budget[]>
}

export interface CreateBudgetAction {
  type: BudgetActionType.CREATE_BUDGET
  payload: Budget | null
}

export type BudgetAction =
  | SyncBudgetsAction
  | CreateBudgetAction
  | LoadingAction<BudgetActionType.SET_LOADING>;

export interface BudgetState {
  budgets: PaginatedApiResponse<Budget[]>
  loading: boolean
}

export type BudgetReducer = Reducer<BudgetState, BudgetAction>;

export interface BudgetContextType {
  state: BudgetState
  createBudget: (data: CreateBudgetParams) => void
}
