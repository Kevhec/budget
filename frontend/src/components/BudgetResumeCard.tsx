import { CalendarClock } from 'lucide-react';
import { format } from '@formkit/tempo';
import { formatMoney } from '@/lib/formatNumber';
import { cn } from '@/lib/utils';
import {
  Card, CardContent, CardHeader, CardTitle,
} from './ui/card';
import Typography from './Typography';
import { Separator } from './ui/separator';

interface Props {
  name: string
  startDate: Date
  endDate: Date
  amount: number
  hidden?: boolean
}

export default function BudgetResumeCard({
  name,
  startDate,
  endDate,
  amount,
  hidden,
}: Props) {
  const containerClasses = cn({
    invisible: hidden,
  }, 'grid grid-cols-2 px-4 py-2 gap-4 relative');

  return (
    <Card tabIndex={hidden ? 0 : 1} className={containerClasses}>
      <CardHeader className="font-inter p-0">
        <CardTitle className="capitalize font-medium text-lg truncate" title={name}>{name}</CardTitle>
        <div className="flex items-center gap-2">
          <CalendarClock />
          <div className="text-sm flex flex-col">
            <Typography variant="span">{format(startDate, 'medium')}</Typography>
            <Typography variant="span" className="hidden md:inline">{' - '}</Typography>
            <Typography variant="span">{format(endDate, 'medium')}</Typography>
          </div>
        </div>
      </CardHeader>
      <Separator orientation="vertical" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5/6" />
      <CardContent className="flex flex-col justify-around p-0">
        <Typography>
          Restante
        </Typography>
        <Typography className="font-openSans font-bold text-xl">
          {formatMoney(amount)}
        </Typography>
      </CardContent>
    </Card>
  );
}
