import { useEffect, useState } from 'react';
import getBalance from '@/lib/balance/getBalance';
import GeneralResumeCard from '@/components/GeneralResumeCard';
import { MonthData } from '@/types';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/tabs';
import useTransactions from '@/hooks/useTransactions';

export default function GeneralResume() {
  const [balance, setBalance] = useState<MonthData>();
  const { state: { recentTransactions } } = useTransactions();

  useEffect(() => {
    const getData = async () => {
      const data = await getBalance();
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      if (data) {
        const newBalance = data[currentYear][currentMonth];

        setBalance(newBalance);
      }
    };

    getData();
  }, [recentTransactions]);

  return (
    <section className="mb-2">
      <Tabs defaultValue="balance" className="w-full md:hidden">
        <TabsList className="w-full flex gap-1">
          <TabsTrigger className="flex-1" value="balance">Saldo Total</TabsTrigger>
          <TabsTrigger className="flex-1" value="income">Ingresos</TabsTrigger>
          <TabsTrigger className="flex-1" value="expense">Gastos</TabsTrigger>
        </TabsList>
        <TabsContent value="balance">
          <GeneralResumeCard variant="default" title="Saldo total" value={balance?.balance || 0} className="col-span-2" />
        </TabsContent>
        <TabsContent value="income">
          <GeneralResumeCard variant="income" title="Ingresos" value={balance?.totalIncome || 0} className="col-span-1" />
        </TabsContent>
        <TabsContent value="expense">
          <GeneralResumeCard variant="expense" title="Gastos" value={balance?.totalExpense || 0} className="col-span-1" />
        </TabsContent>
      </Tabs>
      <div className="hidden md:grid md:grid-cols-2 md:gap-2">
        <GeneralResumeCard variant="default" title="Saldo total" value={balance?.balance || 0} className="col-span-2" />
        <GeneralResumeCard variant="income" title="Ingresos" value={balance?.totalIncome || 0} className="col-span-1" />
        <GeneralResumeCard variant="expense" title="Gastos" value={balance?.totalExpense || 0} className="col-span-1" />
      </div>
    </section>
  );
}
