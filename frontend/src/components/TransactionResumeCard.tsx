import { format } from '@formkit/tempo';
import { cn } from '@/lib/utils';
import { Category } from '@/types';
import { formatMoney } from '@/lib/formatNumber';
import Typography from './Typography';
import {
  Card, CardContent,
} from './ui/card';
import { Badge } from './ui/badge';

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
  }, 'flex-1 text-end font-openSans');

  const containerClasses = cn({
    invisible: hidden,
  }, 'py-2 border-none shadow-none');

  return (
    <Card tabIndex={hidden ? 0 : 1} className={containerClasses}>
      <CardContent className="p-0 gap-y-4">
        <div className="flex-1 font-inter flex justify-between mb-2">
          <Typography className="capitalize font-medium truncate max-w-32" title={description}>{description || 'Placeholder'}</Typography>
          <Badge
            style={{
              backgroundColor: category?.color,
            }}
          >
            {category?.name ?? 'Sin categoría'}
          </Badge>
        </div>
        <div className="flex justify-between">
          <Typography className="text-blueishGray text-sm">{format(date || new Date(), 'medium')}</Typography>
          <Typography className={amountClasses}>
            {formatMoney(amount || 0)}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
