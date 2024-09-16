import { z } from 'zod';
import axiosClient from '@/config/axios';
import transactionSchema from '@/schemas/creation';
import { Transaction } from '@/types';

type Params = z.infer<typeof transactionSchema>;

async function createTransaction(transaction: Params): Promise<Transaction | null> {
  try {
    const { data } = await axiosClient.post(`${import.meta.env.VITE_API_BASEURL}/transaction`, {
      ...transaction,
    });

    const newTransaction: Transaction = data.data.transaction;

    return newTransaction;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default createTransaction;
