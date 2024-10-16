import { format } from '@formkit/tempo';
import axiosClient from '@/config/axios';
import { PaginatedApiResponse, PaginatedParams, Transaction } from '@/types';

async function getPaginatedTransactions({ page, limit, date }: PaginatedParams) {
  try {
    const [year, month] = format(date, 'YYYY-MM').split('-');
    const offset = (page - 1) * limit;

    const { data } = await axiosClient
      .get<PaginatedApiResponse<Transaction[]>>(`/transaction/?offset=${offset}&limit=${limit}&month=${year}-${month}`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default getPaginatedTransactions;
