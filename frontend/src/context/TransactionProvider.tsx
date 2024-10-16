import {
  createContext, useCallback, useEffect, useMemo, useReducer, type PropsWithChildren,
} from 'react';
import { CreateTransactionParams, TransactionReducer, TransactionsContextType } from '@/types';
import { initialTransactionState, transactionReducer } from '@/reducers/transaction/transactionReducer';
import {
  createTransaction as createTransactionAction,
  syncRecentTransactions as syncRecentTransactionsAction,
  syncPaginatedTransactions as syncPaginatedTransactionsAction,
} from '@/reducers/transaction/transactionActions';
import { defaultPaginatedOptions } from '@/lib/constants';

export const TransactionsContext = createContext<TransactionsContextType | null>(null);

function TransactionsProvider({ children }: PropsWithChildren) {
  const [
    state,
    dispatch,
  ] = useReducer<TransactionReducer>(transactionReducer, initialTransactionState);

  const createTransaction = useCallback((data: CreateTransactionParams) => {
    createTransactionAction(dispatch, data, state);
  }, [state]);

  useEffect(() => {
    syncRecentTransactionsAction(dispatch);
    syncPaginatedTransactionsAction(dispatch, defaultPaginatedOptions);
  }, []);

  const contextValue = useMemo<TransactionsContextType>(() => ({
    state,
    createTransaction,
  }), [state, createTransaction]);

  return (
    <TransactionsContext.Provider value={contextValue}>
      {children}
    </TransactionsContext.Provider>
  );
}

export default TransactionsProvider;
