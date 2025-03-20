import { format } from '@formkit/tempo';
import { cn } from '@/lib/utils';
import { Category } from '@/types';
import { formatMoney } from '@/lib/formatNumber';
import { useTranslation } from 'react-i18next';
import Typography from './Typography';
import {
  Card, CardContent,
} from './ui/card';
import { Badge } from './ui/badge';
import CategoryBadge from './CategoryBadge';

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
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

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
          <Typography className="capitalize font-medium truncate max-w-32" title={description}>
            {description || 'Placeholder'}
          </Typography>
          <CategoryBadge category={category} />
        </div>
        <div className="flex justify-between">
          <Typography className="text-blueishGray text-sm">
            {format(date || new Date(), 'medium', currentLanguage)}
          </Typography>
          <Typography className={amountClasses}>
            {/* TODO: Add user preference: Currency. As third param */}
            {formatMoney(amount || 0, currentLanguage)}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
