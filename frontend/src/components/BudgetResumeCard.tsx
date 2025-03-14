import { CalendarClock } from 'lucide-react';
import { format } from '@formkit/tempo';
import { formatMoney } from '@/lib/formatNumber';
import { cn } from '@/lib/utils';
import { PureBalance } from '@/types';
import { useTranslation } from 'react-i18next';
import {
  Card, CardContent, CardHeader, CardTitle,
} from './ui/card';
import Typography from './Typography';
import { Separator } from './ui/separator';

interface Props {
  name: string
  startDate: Date
  endDate: Date
  initialAmount: number
  hidden?: boolean
  balance: PureBalance
}

function percentageChange(initialValue: number, finalValue: number) {
  return (finalValue / initialValue) * 100;
}

const defaultBalance = {
  totalExpense: 0,
  totalIncome: 0,
};

export default function BudgetResumeCard({
  name,
  startDate,
  endDate,
  initialAmount,
  balance = defaultBalance,
  hidden,
}: Props) {
  const { t, i18n } = useTranslation();
  const currentLangue = i18n.language;

  const { totalExpense, totalIncome } = balance;
  const netAmount = initialAmount + totalIncome - totalExpense;

  const remainingAmountPercentage = percentageChange(initialAmount, netAmount);

  const containerClasses = cn({
    invisible: hidden,
  }, 'border-none shadow-none grid grid-cols-2 px-4 py-2 gap-4 relative md:pl-6 md:gap-6 md:grow md:items-center relative');

  const indicatorClasses = cn({
    'bg-safe': remainingAmountPercentage > 50,
    'bg-caution': remainingAmountPercentage <= 50 && remainingAmountPercentage > 25,
    'bg-danger': remainingAmountPercentage <= 25,
  }, 'w-2.5 h-full absolute left-0 rounded-r-xl top-1/2 -translate-y-1/2');

  return (
    <Card tabIndex={hidden ? 0 : 1} className={containerClasses}>
      <div className={indicatorClasses} />
      <CardHeader className="font-inter p-0">
        <CardTitle className="capitalize font-medium text-lg truncate" title={name}>{name}</CardTitle>
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4" />
          <div className="text-sm flex flex-col md:flex-row md:gap-1 ">
            <div className="flex gap-2 justify-between md:flex-col md:gap-0">
              <Typography className="text-sm md:hidden">
                {t('common.starts')}
              </Typography>
              <Typography className="text-sm">
                {format(startDate, 'short', currentLangue)}
              </Typography>
            </div>
            <Typography variant="span" className="hidden md:inline">{' - '}</Typography>
            <div className="flex gap-2 justify-between md:flex-col md:gap-0">
              <Typography className="text-sm md:hidden">
                {t('common.ends')}
              </Typography>
              <Typography className="text-sm">
                {format(endDate, 'short', currentLangue)}
              </Typography>
            </div>
          </div>
        </div>
      </CardHeader>
      <Separator orientation="vertical" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5/6 md:hidden" />
      <CardContent className="grid grid-rows-2 p-0 items-center">
        <Typography className="font-openSans font-bold text-xl">
          {
            formatMoney(
              balance ? initialAmount + balance.totalIncome - balance.totalExpense : initialAmount,
            )
          }
        </Typography>
        <Typography className="text-sm">
          {t('budgetResumeCard.valueDescription')}
          {' '}
          <Typography variant="span" className="block">{formatMoney(initialAmount)}</Typography>
        </Typography>
      </CardContent>
    </Card>
  );
}
