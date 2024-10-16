import { Reducer } from 'react';
import { z } from 'zod';
import { transactionSchema } from '@/schemas/creation';
import { Category } from './category';
import { PaginatedApiResponse } from './api';
import { LoadingAction } from './common';

export enum TransactionType {
  Income = 'income',
  Expense = 'expense',
}

export interface Transaction {
  id: string;
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

export interface PaginatedParams {
  page: number
  limit: number
  date: Date
}

export type CreateTransactionParams = z.infer<typeof transactionSchema>;

export enum TransactionActionType {
  SYNC_RECENT = 'SYNC_RECENT',
  SYNC_PAGINATED = 'SYNC_PAGINATED',
  CREATE_TRANSACTION = 'CREATE_TRANSACTION',
  SET_LOADING = 'SET_LOADING',
}

export interface SyncRecentAction {
  type: TransactionActionType.SYNC_RECENT
  payload: Transaction[]
}

export interface SyncPaginatedAction {
  type: TransactionActionType.SYNC_PAGINATED
  payload: PaginatedApiResponse<Transaction[]>
}

export interface CreateTransactionAction {
  type: TransactionActionType.CREATE_TRANSACTION
  payload: Transaction | null
}

export type TransactionAction =
  | SyncRecentAction
  | SyncPaginatedAction
  | CreateTransactionAction
  | LoadingAction<TransactionActionType.SET_LOADING>;

export interface TransactionState {
  recentTransactions: Transaction[],
  paginatedTransactions: PaginatedApiResponse<Transaction[]>,
  loading: boolean
}

export type TransactionReducer = Reducer<TransactionState, TransactionAction>;

export interface TransactionsContextType {
  state: TransactionState,
  createTransaction: (data: CreateTransactionParams) => void;
}
