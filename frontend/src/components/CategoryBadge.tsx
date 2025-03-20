import { Category } from '@/types'
import { Badge } from './ui/badge'
import { useTranslation } from 'react-i18next'

interface Props {
  category?: Category | null
}

export default function CategoryBadge({ category }: Props) {
  const { t } = useTranslation();

  return (
    <Badge
      style={{
        backgroundColor: category?.color,
      }}
    >
      {t(`${category?.key}`) ?? t('category.none')}
    </Badge>
  )
}