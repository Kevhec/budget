import { format } from '@formkit/tempo';
import axiosClient from '@/config/axios';
import { Budget, PaginatedApiResponse, PaginatedParams } from '@/types';

async function getPaginatedBudgets({ page, limit, date }: PaginatedParams) {
  try {
    const [year, month] = format(date, 'YYYY-MM').split('-');
    const offset = (page - 1) * limit;

    const { data } = await axiosClient
      .get<PaginatedApiResponse<Budget[]>>(`/budget/?offset=${offset}&limit=${limit}&month=${year}-${month}`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default getPaginatedBudgets;
