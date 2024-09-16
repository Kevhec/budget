import {
  createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren,
} from 'react';
import { Transaction } from '@/types';
import { PaginatedApiResponse } from '../types/index';
import useTransactions from '@/hooks/useTransactions';

export interface ContextType {
  recentTransactions: Transaction[]
  paginatedTransactions: PaginatedApiResponse<Transaction[]> | null
  addTransaction: (transaction: Transaction) => void
}

export const TransactionsContext = createContext<ContextType>({
  recentTransactions: [],
  paginatedTransactions: {
    status: 200,
    data: [],
    meta: {
      currentPage: 0,
      itemCount: 0,
      itemsPerPage: 0,
      totalItems: 0,
      totalPages: 0,
    },
    links: {},
  },
  addTransaction: () => null,
});

function TransactionsProvider({ children }: PropsWithChildren) {
  const {
    transactions, setDate, setLimit, setPage,
  } = useTransactions({
    initialPage: 1,
    initialLimit: 30,
    initialDate: new Date(),
  });

  const [
    recentTransactions,
    setRecentTransactions,
  ] = useState<Transaction[]>([]);

  const [
    paginatedTransactions,
    setPaginatedTransactions,
  ] = useState<PaginatedApiResponse<Transaction[]> | null>(null);

  useEffect(() => {
    if (transactions) {
      setPaginatedTransactions(transactions);

      if (transactions.meta?.currentPage === 1) {
        const newRecentTransactions = transactions?.data?.slice(0, 4) || [];
        setRecentTransactions(newRecentTransactions);
      }
    }
  }, [transactions]);

  const addTransaction = useCallback((transaction: Transaction) => {
    const newRecent = [transaction, ...recentTransactions]
      .slice(0, 4);

    const prevPaginatedTransactions = { ...paginatedTransactions };
    const prevPaginatedData = prevPaginatedTransactions?.data;

    if (prevPaginatedData) {
      const newPaginatedData = [transaction, ...prevPaginatedData]
        .splice(-1);

      const newPaginatedTransactions: PaginatedApiResponse<Transaction[]> = {
        ...prevPaginatedTransactions,
        data: newPaginatedData,
      };

      setPaginatedTransactions(newPaginatedTransactions);
    }

    setRecentTransactions(newRecent);
  }, [paginatedTransactions, recentTransactions]);

  const contextValue = useMemo<ContextType>(() => ({
    recentTransactions,
    paginatedTransactions,
    addTransaction,
  }), [recentTransactions, paginatedTransactions, addTransaction]);

  return (
    <TransactionsContext.Provider value={contextValue}>
      {children}
    </TransactionsContext.Provider>
  );
}

export default TransactionsProvider;
