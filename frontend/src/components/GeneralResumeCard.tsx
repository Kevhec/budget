import { cn } from '@/lib/utils';
import {
  Card, CardContent, CardHeader, CardTitle,
} from './ui/card';
import formatMoney from '@/lib/formatNumber';
import Typography from './Typography';
import { Months } from '@/types';

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
  const currentMonth = date.toLocaleString('default', { month: 'long' });

  return (
    <Card className={resumeCardClasses}>
      <CardHeader className="p-0 mb-6">
        <CardTitle className="font-openSans font-semibold text-lg">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Typography className="font-bold text-3xl">
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
