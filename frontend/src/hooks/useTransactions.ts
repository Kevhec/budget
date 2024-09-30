import { format } from '@formkit/tempo';
import { useEffect, useState } from 'react';
import axiosClient from '@/config/axios';
import { Transaction } from '@/types';
import { PaginatedApiResponse } from '../types/index';

interface Params {
  initialPage: number
  initialLimit: number
  initialDate: Date
}

function useTransactions({ initialPage, initialLimit, initialDate }: Params) {
  const [
    transactions,
    setTransactions,
  ] = useState<PaginatedApiResponse<Transaction[]> | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [date, setDate] = useState(initialDate);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const [year, month] = format(date, 'YYYY-MM').split('-');
        const offset = (page - 1) * limit;

        const { data } = await axiosClient.get(`http://localhost:3000/api/transaction/?offset=${offset}&limit=${limit}&month=${year}-${month}`);

        if (data) {
          const newTransactions: PaginatedApiResponse<Transaction[]> = data;
          setTransactions(newTransactions);
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    getTransactions();
  }, [page, limit, date]);

  return {
    transactions,
    setPage,
    setLimit,
    setDate,
  };
}

export default useTransactions;
