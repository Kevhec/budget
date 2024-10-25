import { TrendingUp } from 'lucide-react';
import {
  CartesianGrid, Line, LineChart, XAxis,
  YAxis,
} from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import ChartCard from '@/components/charts/ChartCard';
import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { format } from '@formkit/tempo';
import useTransactions from '@/hooks/useTransactions';
import { SPANISH_MONTHS } from '@/lib/constants';
import { formatMoney, suffixNumberFormatter } from '@/lib/formatNumber';

export const description = 'A linear line chart';

const chartConfig = {
  totalBalance: {
    label: 'Balance',
    color: 'hsl(var(--chart-1))',
  },
  income: {
    label: 'Ingresos',
    color: 'hsl(var(--chart-2))',
  },
  expense: {
    label: 'Gastos',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export default function MonthlyBalanceGraph() {
  const {
    state: {
      user: { createdAt },
    },
  } = useAuth();
  const { getBalance, state: { balance, recentTransactions } } = useTransactions();
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      const todayDate = new Date();
      /* const userCreationDate = new Date(createdAt); */
      const januaryDate = new Date(todayDate.getFullYear(), 0, 1);

      /* const wasUserCreatedThisYear = userCreationDate >= januaryDate;

      const balanceFromDate = wasUserCreatedThisYear
        ? userCreationDate
        : januaryDate; */

      getBalance(
        format(januaryDate, 'YYYY-MM'),
      );
    };

    getData();
  }, [createdAt, getBalance, recentTransactions]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();

    const currentYearBalanceHistory = balance[currentYear];

    if (!currentYearBalanceHistory) return;

    const months = Object.keys(currentYearBalanceHistory);

    const newChartData: any[] = [];

    months.forEach((month) => {
      const monthName = SPANISH_MONTHS[parseInt(month, 10) - 1];

      const {
        balance: totalBalance,
        totalExpense,
        totalIncome,
      } = currentYearBalanceHistory[month];

      const dataPiece = {
        month: monthName,
        totalBalance,
        expense: totalExpense,
        income: totalIncome,
      };

      newChartData.push(dataPiece);
    });

    setChartData(newChartData);
  }, [balance]);

  return (
    <section className="md:col-span-10 xl:col-span-10">
      <ChartCard
        title="Así va tu dinero"
        titleIcon={<TrendingUp />}
        titleLeft
        titleClassName="font-inter text-lg font-medium"
        headerClassName="px-4 py-4 border-b border-b-slate-200"
        contentClassName="px-4 pt-4"
        containerClassName="h-full"
      >
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="capitalize"
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              type="number"
              tickFormatter={(value) => `$${suffixNumberFormatter.format(value)}`}
              tickMargin={8}
              axisLine={false}
              width={35}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent customValueFormatter={formatMoney} hideLabel />}
            />
            <Line
              dataKey="totalBalance"
              type="linear"
              stroke="#1B1B1B"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="income"
              type="linear"
              stroke="hsl(var(--safe))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="expense"
              type="linear"
              stroke="hsl(var(--danger))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </ChartCard>
    </section>
  );
}
