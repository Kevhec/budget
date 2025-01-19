import { ApiTransaction, CreateTransactionParams, TransactionType } from '@/types';
import { extractConcurrenceData } from '../utils';

function formatTransactionData(transaction: CreateTransactionParams) {
  const concurrencyFormData = extractConcurrenceData(transaction);

  const formattedTransaction: ApiTransaction = {
    description: transaction.description,
    amount: transaction.amount,
    date: transaction.date,
    type: transaction.type as TransactionType,
    budgetId: transaction.budgetId,
    categoryId: transaction.categoryId,
    concurrence: concurrencyFormData,
  };

  return formattedTransaction;
}

export default formatTransactionData;
