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

const tabsDefaultValue = 'income';

export default function CategoryBalanceGraph() {
  const { state: { monthBalance } } = useCategories();
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

  const onTabChange = (value: string) => {
    setCurrentTab(value);
  };

  return (
    <section>
      <Tabs defaultValue={tabsDefaultValue} onValueChange={onTabChange} value={currentTab} className="w-full bg-white rounded-lg">
        <TabsList className="w-full justify-start gap-2">
          <TabsTrigger value="income">Ingresos</TabsTrigger>
          <TabsTrigger value="expense">Gastos</TabsTrigger>
        </TabsList>
        {
          ['income', 'expense'].map((type) => (
            <TabsContent key={crypto.randomUUID()} value={type} className="mt-0 relative">
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
