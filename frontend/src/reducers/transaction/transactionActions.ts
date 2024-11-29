import { Dispatch } from 'react';
import { getPaginatedTransactions } from '@/lib/transaction';
import {
  ApiTransaction,
  CreateTransactionParams,
  PaginatedParams, Transaction, TransactionAction, TransactionActionType,
  TransactionState,
  TransactionType,
} from '@/types';
import axiosClient from '@/config/axios';
import getBalance from '@/lib/balance/getBalance';
import formatConcurrence from '@/lib/formatConcurrence';
import { extractConcurrenceData } from '@/lib/utils';
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
      include: 'budget,category',
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

  const concurrencyFormData = extractConcurrenceData(transaction);
  const parsedConcurrency = formatConcurrence(concurrencyFormData, transaction.date);

  const formattedTransaction: ApiTransaction = {
    description: transaction.description,
    amount: transaction.amount,
    date: transaction.date.toString(),
    type: transaction.type as TransactionType,
    budgetId: transaction.budgetId,
    categoryId: transaction.categoryId,
    recurrence: parsedConcurrency || undefined,
  };

  try {
    const { data } = await axiosClient.post('/transaction', {
      ...formattedTransaction,
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
        include: 'budget,category',
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

async function getHistoricalBalance(
  dispatch: Dispatch<TransactionAction>,
  from?: string,
  to?: string,
) {
  dispatch({
    type: TransactionActionType.SET_LOADING,
    payload: true,
  });

  try {
    const balance = await getBalance(from, to);

    dispatch({
      type: TransactionActionType.GET_BALANCE,
      payload: balance || {},
    });
  } catch (error) {
    dispatch({
      type: TransactionActionType.GET_BALANCE,
      payload: {},
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
  getHistoricalBalance,
};
