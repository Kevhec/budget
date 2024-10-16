import { cn, getMonthFromDate } from '@/lib/utils';
import { formatMoney } from '@/lib/formatNumber';
import { Months } from '@/types';
import {
  Card, CardContent, CardHeader, CardTitle,
} from './ui/card';
import Typography from './Typography';

interface Props {
  variant?: 'default' | 'income' | 'expense'
  title: string
  month?: Months
  value: number
  className?: string
}

export default function GeneralResumeCard({
  variant, title, value, month, className,
}: Props) {
  const resumeCardClasses = cn('rounded-md p-4 col-span-4', {
    'bg-secondaryGreen text-white': variant === 'income',
    'bg-secondaryYellow': variant === 'expense',
  }, className);

  const formattedMoney = formatMoney(value);

  const date = new Date();
  const currentMonth = getMonthFromDate(date);

  return (
    <Card className={resumeCardClasses}>
      <CardHeader className="p-0 mb-6">
        <CardTitle className="font-openSans font-semibold text-lg">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Typography className="font-bold text-lg md:text-3xl">
          {formattedMoney}
        </Typography>
        <Typography className="text-sm">
          en
          {' '}
          <Typography variant="span" className="capitalize">
            {month || currentMonth}
          </Typography>
        </Typography>
      </CardContent>
    </Card>
  );
}
