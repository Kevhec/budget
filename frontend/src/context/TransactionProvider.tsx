import {
  createContext, useCallback, useEffect, useMemo, useReducer, type PropsWithChildren,
} from 'react';
import { CreateTransactionParams, TransactionReducer, TransactionsContextType } from '@/types';
import { initialTransactionState, transactionReducer } from '@/reducers/transaction/transactionReducer';
import {
  createTransaction as createTransactionAction,
  syncRecentTransactions as syncRecentTransactionsAction,
  syncPaginatedTransactions as syncPaginatedTransactionsAction,
  getHistoricalBalance as getHistoricalBalanceAction,
  updateTransaction as updateTransactionAction,
} from '@/reducers/transaction/transactionActions';
import { defaultPaginatedOptions } from '@/lib/constants';
import { PaginatedParams } from '../types/transaction';

export const TransactionsContext = createContext<TransactionsContextType | null>(null);

function TransactionsProvider({ children }: PropsWithChildren) {
  const [
    state,
    dispatch,
  ] = useReducer<TransactionReducer>(transactionReducer, initialTransactionState);

  const createTransaction = useCallback((data: CreateTransactionParams) => {
    createTransactionAction(dispatch, data, state);
  }, [state]);

  const getBalance = useCallback((from?: string, to?: string) => {
    getHistoricalBalanceAction(dispatch, from, to);
  }, []);

  const changePage = useCallback((params: PaginatedParams) => {
    syncPaginatedTransactionsAction(dispatch, params);
  }, []);

  const updateTransaction = useCallback((id: string, data: CreateTransactionParams) => {
    updateTransactionAction(dispatch, data, id);
  }, []);

  const contextValue = useMemo<TransactionsContextType>(() => ({
    state,
    createTransaction,
    getBalance,
    changePage,
    updateTransaction,
  }), [state, createTransaction, getBalance, changePage, updateTransaction]);

  useEffect(() => {
    syncRecentTransactionsAction(dispatch);
    syncPaginatedTransactionsAction(dispatch, defaultPaginatedOptions);
  }, []);

  return (
    <TransactionsContext.Provider value={contextValue}>
      {children}
    </TransactionsContext.Provider>
  );
}

export default TransactionsProvider;
