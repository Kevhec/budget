import { Reducer } from 'react';
import { z } from 'zod';
import { transactionSchema } from '@/schemas/creation';
import { Category } from './category';
import { PaginatedApiResponse } from './api';
import { LoadingAction, SimplifiedConcurrence } from './common';
import { BalanceData } from './balance';
import { type Budget } from './budget';

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
  budgetId?: string;
  categoryId?: string
  budget?: Budget | null;
  category?: Category | null;
  hidden?: boolean
  concurrence?: SimplifiedConcurrence
}

export interface PaginatedParams {
  page?: number
  limit?: number
  date?: Date
  presetUrl?: string
  include?: string
}

export type CreateTransactionParams = z.infer<typeof transactionSchema>;

export enum TransactionActionType {
  SYNC_RECENT = 'SYNC_RECENT',
  SYNC_PAGINATED = 'SYNC_PAGINATED',
  CREATE_TRANSACTION = 'CREATE_TRANSACTION',
  GET_BALANCE = 'GET_BALANCE',
  UPDATE_TRANSACTION = 'UPDATE_TRANSACTION',
  SET_LOADING = 'SET_LOADING',
}

export interface SyncRecentAction {
  type: TransactionActionType.SYNC_RECENT
  payload: Transaction[]
}

export interface GetBalanceAction {
  type: TransactionActionType.GET_BALANCE
  payload: BalanceData
}

export interface SyncPaginatedAction {
  type: TransactionActionType.SYNC_PAGINATED
  payload: PaginatedApiResponse<Transaction[]>
}

export interface CreateTransactionAction {
  type: TransactionActionType.CREATE_TRANSACTION
  payload: Transaction | null
}

export interface UpdateTransactionAction {
  type: TransactionActionType.UPDATE_TRANSACTION
  payload: Transaction | null
}

export type TransactionAction =
  | SyncRecentAction
  | SyncPaginatedAction
  | CreateTransactionAction
  | GetBalanceAction
  | UpdateTransactionAction
  | LoadingAction<TransactionActionType.SET_LOADING>;

export interface TransactionState {
  recentTransactions: Transaction[],
  balance: BalanceData
  paginatedTransactions: PaginatedApiResponse<Transaction[]>,
  loading: boolean
}

export type TransactionReducer = Reducer<TransactionState, TransactionAction>;

export interface TransactionsContextType {
  state: TransactionState,
  createTransaction: (data: CreateTransactionParams) => void;
  getBalance: (from?: string, to?: string) => void;
  changePage: (params: PaginatedParams) => void;
  updateTransaction: (id: string, data: CreateTransactionParams) => void;
}
