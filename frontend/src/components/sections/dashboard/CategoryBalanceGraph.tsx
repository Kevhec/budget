import { useEffect, useState } from 'react';
import useCategories from '@/hooks/useCategories';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/tabs';
import { camelize, getMonthFromDate, removeAccents } from '@/lib/utils';
import ChartPie from '@/components/charts/Pie';
import { ChartConfig } from '@/components/ui/chart';
import ChartCard from '@/components/charts/ChartCard';
import { formatMoney } from '@/lib/formatNumber';
import Typography from '@/components/Typography';
import useTransactions from '@/hooks/useTransactions';

const tabsDefaultValue = 'income';

export default function CategoryBalanceGraph() {
  const { state: { monthBalance }, updateBalance } = useCategories();
  const { state: { recentTransactions } } = useTransactions();
  const [currentTab, setCurrentTab] = useState<string>(tabsDefaultValue);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartConfig, setChartConfig] = useState< Record<string, any>>({
    categories: {
      label: 'Categorías',
    },
  });

  useEffect(() => {
    if (!monthBalance) return;

    const newChartData: any[] = [];
    const newChartConfig: Record<string, any> = {
      categories: {
        label: 'Categorías',
      },
    } satisfies ChartConfig;

    monthBalance?.balance.forEach(({ category, totalExpense, totalIncome }) => {
      const normalizedName = camelize(removeAccents(category.name));

      const skipCondition = (
        currentTab === 'income' && totalIncome === 0
      ) || (
        currentTab === 'expense' && totalExpense === 0
      );

      if (skipCondition) return;

      const dataValue = currentTab === 'income' ? totalIncome : totalExpense;
      const formattedDataValue = formatMoney(dataValue);

      const dataObj = {
        category: normalizedName,
        [currentTab]: dataValue,
        fill: category.color,
        formattedValue: formattedDataValue,
      };

      newChartData.push(dataObj);

      const configObj = {
        label: category.name,
        color: category.color,
      };

      newChartConfig[normalizedName] = configObj;
    });

    setChartData(newChartData);
    setChartConfig(newChartConfig);
  }, [monthBalance, currentTab]);

  useEffect(() => {
    updateBalance();
  }, [recentTransactions, updateBalance]);

  const onTabChange = (value: string) => {
    setCurrentTab(value);
  };

  return (
    <section className="md:col-span-10 xl:row-span-2 xl:col-start-11">
      <Tabs defaultValue={tabsDefaultValue} onValueChange={onTabChange} value={currentTab} className="w-full bg-white rounded-lg md:h-full md:flex md:flex-col">
        <TabsList className="w-full justify-start gap-2">
          <TabsTrigger value="income">Ingresos</TabsTrigger>
          <TabsTrigger value="expense">Gastos</TabsTrigger>
        </TabsList>
        {
          ['income', 'expense'].map((type) => (
            <TabsContent key={crypto.randomUUID()} value={type} className="mt-0 relative md:flex-1 data-[state=active]:flex data-[state=active]:flex-col">
              {
                chartData.length === 0 && (
                  <Typography className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center whitespace-nowrap">
                    Gráfico de transacciones
                    <Typography variant="span" className="block text-sm text-slate-600">
                      Sin Datos
                    </Typography>
                  </Typography>
                )
              }
              <ChartCard
                title={`${type === 'income' ? 'Ingresos' : 'Gastos'} por categoría`}
                hidden={chartData.length === 0}
                month={monthBalance?.month ? getMonthFromDate(new Date(0, monthBalance.month - 1)) : ''}
                containerClassName="md:h-full"
                contentClassName="md:flex"
              >
                <ChartPie
                  chartConfig={chartConfig}
                  chartData={chartData}
                  dataKey={type}
                  nameKey="category"
                />
              </ChartCard>
            </TabsContent>
          ))
        }
      </Tabs>
    </section>
  );
}
