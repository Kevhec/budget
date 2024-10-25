import { format } from '@formkit/tempo';
import axiosClient from '@/config/axios';
import { Budget, PaginatedApiResponse, PaginatedParams } from '@/types';

async function getPaginatedBudgets(options: PaginatedParams | undefined) {
  try {
    let validOffset = 0;
    let validDate = new Date();
    let validLimit: number | string = '';

    if (options) {
      const { date, limit, page } = options;

      validOffset = (page - 1) * limit;
      validDate = date || new Date();
      validLimit = limit;
    }

    const [year, month] = format(validDate || new Date(), 'YYYY-MM').split('-');

    // TODO: Evaluate if budgets should be obtained by month, start date or creation date
    const { data } = await axiosClient
      .get<PaginatedApiResponse<Budget[]>>(`/budget/?offset=${validOffset}&limit=${validLimit}&month=${year}-${month}&balance="true"`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default getPaginatedBudgets;
