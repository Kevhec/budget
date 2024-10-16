import axiosClient from '@/config/axios';
import { BalanceData } from '@types';
import { dateStringRegex } from '../constants';

async function getBalance(from?: string, to?: string) {
  const badParams = [];

  if (from && !dateStringRegex.test(from)) badParams.push('from');
  if (to && !dateStringRegex.test(to)) badParams.push('to');

  try {
    const { data } = await axiosClient.get(`${import.meta.env.VITE_API_BASEURL}/transaction/balance`);

    return data.data as BalanceData;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default getBalance;
