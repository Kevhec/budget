import { format } from '@formkit/tempo';
import axiosClient from '@/config/axios';
import { PaginatedApiResponse, PaginatedParams, Transaction } from '@/types';

async function getPaginatedTransactions({ page, limit, date }: PaginatedParams) {
  try {
    let queryYear = '';
    let queryMonth = '';

    if (date) {
      const [dateYear, dateMonth] = format(date, 'YYYY-MM').split('-');

      queryYear = dateYear;
      queryMonth = dateMonth;
    }
    const offset = (page - 1) * limit;

    const { data } = await axiosClient
      .get<PaginatedApiResponse<Transaction[]>>(`/transaction/?offset=${offset}&limit=${limit}&month=${date ? `${queryYear}-${queryMonth}` : ''}`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default getPaginatedTransactions;
