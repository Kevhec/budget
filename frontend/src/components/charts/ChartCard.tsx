import { cn } from '@/lib/utils';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '../ui/card';

interface Props {
  children: React.ReactNode
  title: string
  titleIcon?: React.ReactNode
  titleLeft?: boolean
  titleClassName?: string
  containerClassName?: string
  headerClassName?: string
  contentClassName?: string
  month?: string
  hidden?: boolean
}

export default function ChartCard({
  title,
  titleIcon,
  titleLeft,
  titleClassName,
  headerClassName,
  containerClassName,
  contentClassName,
  month,
  hidden,
  children,
}: Props) {
  const containerClasses = cn({
    invisible: hidden,
  }, 'flex flex-col border-none pb-4 rounded-md shadow-none', containerClassName);

  const titleClasses = cn({
    'flex gap-2 items-center': titleIcon,
    'w-full': titleLeft,
  }, 'font-openSans text-xl', titleClassName);

  const headerClasses = cn('items-center p-4', headerClassName);

  const contentClasses = cn('flex-1 pb-0', contentClassName);

  return (
    <Card className={containerClasses}>
      <CardHeader className={headerClasses}>
        <CardTitle className={titleClasses}>
          {titleIcon}
          {title}
        </CardTitle>
        {
          month && (
            <CardDescription className="font-inter capitalize">{month}</CardDescription>
          )
        }
      </CardHeader>
      <CardContent className={contentClasses}>
        {children}
      </CardContent>
    </Card>
  );
}
