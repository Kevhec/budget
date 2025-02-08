import React, { useEffect, useState } from 'react';
import { Transaction } from '@/types';
import TransactionResumeCard from '@/components/TransactionResumeCard';
import Typography from '@/components/Typography';
import useTransactions from '@/hooks/useTransactions';
import { Separator } from '@/components/ui/separator';
import { NavLink } from 'react-router';

export default function RecentTransactions() {
  const { state: { recentTransactions } } = useTransactions();
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
    <section className="rounded-md mb-2 md:mb-0 bg-white p-4 md:flex-1 md:col-span-10 md:row-start-2">
      <div className="flex justify-between items-center pb-4">
        <Typography variant="h2">
          Últimas transacciones
        </Typography>
        <NavLink to="#" className="text-sm text-blueishGray">
          Ver más
        </NavLink>
      </div>
      <div className="relative">
        {transactionsWithPlaceholder.map((transaction, i) => {
          const {
            description, date, amount, type, category, hidden,
          } = transaction;
          let fallbackId;
          if (!transaction.id) {
            fallbackId = crypto.randomUUID();
          }
          return (
            <React.Fragment key={transaction.id || fallbackId}>
              <TransactionResumeCard
                description={description}
                date={date}
                amount={amount}
                type={type}
                category={category}
                hidden={hidden}
              />
              {
                (
                  recentTransactions.length !== 0
                  && transactionsWithPlaceholder.length - 1 !== i
                ) && (
                  <Separator decorative />
                )
              }
            </React.Fragment>
          );
        })}
        {
          recentTransactions.length === 0 && (
            <div className="w-full h-full absolute top-0 right-0 grid place-items-center">
              <Typography className="text-sm text-slate-600">
                Sin Datos
              </Typography>
            </div>
          )
        }
      </div>
    </section>
  );
}
