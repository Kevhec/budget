import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '../ui/card';

interface Props {
  children: React.ReactNode
  title: string
  month: string
}

export default function ChartCard({
  title,
  month,
  children,
}: Props) {
  return (
    <Card className="flex flex-col border-none pb-4">
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
