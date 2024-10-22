import { useEffect, useState } from 'react';
import { Budget } from '@/types';
import Typography from '@/components/Typography';
import useBudgets from '@/hooks/useBudgets';
import BudgetResumeCard from '@/components/BudgetResumeCard';
import { CircleDollarSign } from 'lucide-react';
import { getMonthFromDate } from '@/lib/utils';
import { NavLink } from 'react-router-dom';

export default function RecentBudgets() {
  const { state: { recentBudgets } } = useBudgets();
  const [
    budgetsWithPlaceholder,
    setBudgetsWithPlaceholders,
  ] = useState<Budget[]>([]);

  useEffect(() => {
    const getPlaceholders = () => new Array(1 - recentBudgets.length).fill({
      name: '',
      startDate: new Date(),
      endDate: new Date(),
      totalAmount: 0,
      hidden: true,
    });

    const newPlaceholders = getPlaceholders();

    const newBudgetsWithPlaceholders: Budget[] = [
      ...recentBudgets,
      ...newPlaceholders,
    ];
    setBudgetsWithPlaceholders(newBudgetsWithPlaceholders);
  }, [recentBudgets]);

  return (
    <section className="relative">
      <div className="bg-white rounded-lg flex justify-between items-center px-4 py-2 mb-2">
        <div className="flex gap-2 md:gap-4 items-center">
          <CircleDollarSign />
          <div>
            <Typography variant="h2" className="text-lg font-medium font-inter">
              Presupuestos del mes
            </Typography>
            <Typography variant="span" className="capitalize">
              {getMonthFromDate(new Date())}
            </Typography>
          </div>
        </div>
        <NavLink to="#" className="text-sm text-blueishGray">
          Ver más
        </NavLink>
      </div>
      <div className="relative flex flex-col gap-2">
        {budgetsWithPlaceholder.map((budget) => {
          const {
            name, startDate, endDate, totalAmount, hidden,
          } = budget;

          const startDateObj = new Date(startDate);
          const endDateObj = new Date(endDate);
          const numericAmount = parseInt(totalAmount, 10);

          let fallbackId;

          if (!budget.id) {
            fallbackId = crypto.randomUUID();
          }

          return (
            <BudgetResumeCard
              key={budget.id || fallbackId}
              name={name}
              startDate={startDateObj}
              endDate={endDateObj}
              amount={numericAmount}
              hidden={hidden}
            />
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
