import { useContext } from 'react';
import { TransactionsContext } from '@/context/TransactionContext';

function useGetTransactions() {
  const transactionContext = useContext(TransactionsContext);
  if (transactionContext === undefined || transactionContext === null) {
    throw new Error('useGetTransactions must be used within an TransactionsProvider');
  }
  return transactionContext;
}

export default useGetTransactions;
