import { cn } from '@/lib/utils';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '../ui/card';

interface Props {
  children: React.ReactNode
  title: string
  month: string
  hidden?: boolean
}

export default function ChartCard({
  title,
  month,
  hidden,
  children,
}: Props) {
  const containerClasses = cn({
    invisible: hidden,
  }, 'flex flex-col border-none pb-4');

  return (
    <Card className={containerClasses}>
      <CardHeader className="items-center p-4">
        <CardTitle className="font-openSans text-xl">{title}</CardTitle>
        <CardDescription className="font-inter capitalize">{month}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {children}
      </CardContent>
    </Card>
  );
}
