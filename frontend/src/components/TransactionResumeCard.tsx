import { format } from '@formkit/tempo';
import { cn } from '@/lib/utils';
import Typography from './Typography';
import {
  Card, CardContent,
} from './ui/card';
import { Badge } from './ui/badge';
import { Category } from '@/types';
import formatMoney from '@/lib/formatNumber';

type Props = {
  description?: string
  date?: Date
  amount?: number
  type?: 'expense' | 'income'
  category?: Category | null
  hidden?: boolean
};

export default function TransactionResumeCard({
  description, date, amount, type, category, hidden,
}: Props) {
  const amountClasses = cn({
    'text-secondaryGreen': type === 'income',
    'text-secondaryYellow': type === 'expense',
  }, 'flex-1 text-center font-openSans');

  const containerClasses = cn({
    invisible: hidden,
  }, 'py-2 border-none');

  return (
    <Card tabIndex={hidden ? 0 : 1} className={containerClasses}>
      <CardContent className="flex items-center p-0 gap-y-4">
        <div className="flex-1 font-inter">
          <Typography className="capitalize font-medium">{description || 'Placeholder'}</Typography>
          <Typography className="text-blueishGray text-sm">{format(date || new Date(), 'medium')}</Typography>
        </div>
        <Typography className={amountClasses}>
          {formatMoney(amount || 0)}
        </Typography>
        <Badge>{category?.name ?? 'Sin categoría'}</Badge>
      </CardContent>
    </Card>
  );
}
