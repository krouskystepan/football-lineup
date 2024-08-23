'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formatNumberToReadableString } from '@/lib/utils'

const chartConfig = {
  totalScore: {
    label: 'Zápas',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

export function MatchChart({
  matches,
}: {
  matches: { matchName: string; totalScore: number }[]
}) {
  return (
    <div className="border p-4 rounded-md">
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={matches}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="matchName"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis
            dataKey="totalScore"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => formatNumberToReadableString(value)}
          />
          <ChartTooltip
            content={<ChartTooltipContent className="px-2" hideIndicator />}
          />
          <Bar
            dataKey="totalScore"
            fill="var(--color-totalScore)"
            radius={10}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
