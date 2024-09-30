import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import React from ,'react'
import { ChartContainer, ChartTooltip } from '../ui/chart'
import { Pie, PieChart } from 'recharts'

type Props = {}

export default function ChartPie({}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer>
          <PieChart>
            <ChartTooltip />
            <Pie data={chartData} dataKey={dataKey} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}