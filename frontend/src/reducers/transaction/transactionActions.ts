import { Dispatch } from 'react';
import { getPaginatedTransactions } from '@/lib/transaction';
import {
  CreateTransactionParams,
  PaginatedParams, Transaction, TransactionAction, TransactionActionType,
  TransactionState,
} from '@/types';
import axiosClient from '@/config/axios';
import { initialRecentTransactionsState, initialTransactionState } from './transactionReducer';

async function syncRecentTransactions(dispatch: Dispatch<TransactionAction>) {
  dispatch({
    type: TransactionActionType.SET_LOADING,
    payload: true,
  });

  try {
    const response = await getPaginatedTransactions({
      page: 1,
      limit: 4,
      date: new Date(),
    });

    const recentTransactions = response.data;

    if (recentTransactions) {
      dispatch({
        type: TransactionActionType.SYNC_RECENT,
        payload: recentTransactions,
      });
    }
  } catch (error) {
    dispatch({
      type: TransactionActionType.SYNC_RECENT,
      payload: initialRecentTransactionsState,
    });
  } finally {
    dispatch({
      type: TransactionActionType.SET_LOADING,
      payload: false,
    });
  }
}

async function syncPaginatedTransactions(
  dispatch: Dispatch<TransactionAction>,
  options: PaginatedParams,
) {
  dispatch({
    type: TransactionActionType.SET_LOADING,
    payload: true,
  });
  try {
    const paginatedTransactions = await getPaginatedTransactions(options);

    dispatch({
      type: TransactionActionType.SYNC_PAGINATED,
      payload: paginatedTransactions,
    });
  } catch (error) {
    dispatch({
      type: TransactionActionType.SYNC_PAGINATED,
      payload: initialTransactionState.paginatedTransactions,
    });
  } finally {
    dispatch({
      type: TransactionActionType.SET_LOADING,
      payload: false,
    });
  }
}

async function createTransaction(
  dispatch: Dispatch<TransactionAction>,
  transaction: CreateTransactionParams,
  state: TransactionState,
) {
  dispatch({
    type: TransactionActionType.SET_LOADING,
    payload: true,
  });

  const currentPaginated = state.paginatedTransactions;
  const currentPage = currentPaginated.meta?.currentPage;
  const currentLimit = currentPaginated.meta?.itemsPerPage;

  try {
    const { data } = await axiosClient.post('/transaction', {
      ...transaction,
    });

    const newTransaction: Transaction = data.data.transaction;

    dispatch({
      type: TransactionActionType.CREATE_TRANSACTION,
      payload: newTransaction,
    });

    if (currentPage !== 1) {
      syncPaginatedTransactions(dispatch, {
        page: currentPage || 1,
        limit: currentLimit || 30,
        date: new Date(),
      });
    }
  } catch (error) {
    dispatch({
      type: TransactionActionType.CREATE_TRANSACTION,
      payload: null,
    });
  } finally {
    dispatch({
      type: TransactionActionType.SET_LOADING,
      payload: false,
    });
  }
}

export {
  syncRecentTransactions,
  syncPaginatedTransactions,
  createTransaction,
};
