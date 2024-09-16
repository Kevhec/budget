import { useEffect, useState } from 'react';
import { Transaction } from '@/types';
import TransactionResumeCard from '@/components/TransactionResumeCard';
import Typography from '@/components/Typography';
import useGetTransactions from '@/hooks/useGetTransactions';

export default function RecentTransactions() {
  const { recentTransactions } = useGetTransactions();
  const [
    transactionsWithPlaceholder,
    setTransactionsWithPlaceholders,
  ] = useState<Transaction[]>([]);

  useEffect(() => {
    const getPlaceholders = () => new Array(4 - recentTransactions.length).fill({
      name: '',
      date: '',
      amount: 0,
      type: 'income',
      hidden: true,
    });

    const newPlaceholders = getPlaceholders();

    const newTransactionsWithPlaceholders: Transaction[] = [
      ...recentTransactions,
      ...newPlaceholders,
    ];
    setTransactionsWithPlaceholders(newTransactionsWithPlaceholders);
  }, [recentTransactions]);

  return (
    <div className="relative">
      {transactionsWithPlaceholder.map((transaction) => {
        const {
          description, date, amount, type, category, hidden,
        } = transaction;

        return (
          <TransactionResumeCard
            key={crypto.randomUUID()}
            description={description}
            date={date}
            amount={amount}
            type={type}
            category={category}
            hidden={hidden}
          />
        );
      })}
      {
        recentTransactions.length === 0 && (
          <div className="w-full h-full absolute top-0 right-0 grid place-items-center">
            <Typography>Sin transacciones</Typography>
          </div>
        )
      }
    </div>
  );
}
