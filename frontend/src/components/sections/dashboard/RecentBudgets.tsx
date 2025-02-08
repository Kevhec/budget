import React, { useEffect, useState } from 'react';
import { Budget } from '@/types';
import Typography from '@/components/Typography';
import useBudgets from '@/hooks/useBudgets';
import BudgetResumeCard from '@/components/BudgetResumeCard';
import { CircleDollarSign } from 'lucide-react';
import { NavLink } from 'react-router';
import { Separator } from '@/components/ui/separator';
import useTransactions from '@/hooks/useTransactions';

export default function RecentBudgets() {
  const { updateRecentBudgets, state: { recentBudgets } } = useBudgets();
  const { state: { recentTransactions } } = useTransactions();
  const [
    budgetsWithPlaceholder,
    setBudgetsWithPlaceholders,
  ] = useState<Budget[]>([]);

  useEffect(() => {
    const getPlaceholders = () => new Array(4 - recentBudgets.length).fill({
      name: '',
      startDate: new Date(),
      endDate: new Date(),
      totalAmount: 0,
      hidden: true,
      balance: {
        totalIncome: 0,
        totalExpense: 0,
      },
    });

    const newPlaceholders = getPlaceholders();

    const newBudgetsWithPlaceholders: Budget[] = [
      ...recentBudgets,
      ...newPlaceholders,
    ];
    setBudgetsWithPlaceholders(newBudgetsWithPlaceholders);
  }, [recentBudgets]);

  useEffect(() => {
    updateRecentBudgets();
  }, [recentTransactions, updateRecentBudgets]);

  return (
    <section className="relative rounded-md mb-4 md:col-span-10 md:mb-0 md:flex md:flex-col bg-white">
      <div className="flex justify-between items-center px-4 py-4 mb-2">
        <div className="flex gap-2 md:gap-4 items-center">
          <CircleDollarSign />
          <div>
            <Typography variant="h2" className="text-lg font-medium font-inter">
              Presupuestos recientes
            </Typography>
          </div>
        </div>
        <NavLink to="#" className="text-sm text-blueishGray">
          Ver más
        </NavLink>
      </div>
      <div className="relative flex flex-col gap-2 md:grow pb-2">
        {budgetsWithPlaceholder.map((budget, i) => {
          const {
            name, startDate, endDate, totalAmount, hidden, balance,
          } = budget;

          const startDateObj = new Date(startDate);
          const endDateObj = new Date(endDate);
          const numericAmount = parseInt(totalAmount, 10);

          let fallbackId;

          if (!budget.id) {
            fallbackId = crypto.randomUUID();
          }

          return (
            <React.Fragment key={budget.id || fallbackId}>
              <BudgetResumeCard
                name={name}
                startDate={startDateObj}
                endDate={endDateObj}
                initialAmount={numericAmount}
                hidden={hidden}
                balance={balance}
              />
              {
                (
                  recentBudgets.length !== 0
                  && budgetsWithPlaceholder.length - 1 !== i
                ) && (
                  <Separator decorative />
                )
              }
            </React.Fragment>
          );
        })}
        {
        recentBudgets.length === 0 && (
          <div className="w-full h-full absolute grid place-items-center rounded-lg bg-white">
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
