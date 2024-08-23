'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formatNumberToReadableString } from '@/lib/utils'

const chartConfig = {
  totalScore: {
    label: 'Celkové skóre',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

export function MatchChart({
  matches,
}: {
  matches: { matchName: string; totalScore: number }[]
}) {
  const maxScore = Math.max(...matches.map((match) => match.totalScore))
  const adjustedMaxScore = maxScore * 1.1

  const calculateBarchartWidth = (numberOfItem: number) => {
    if (numberOfItem > 9) return numberOfItem * 100
    return '100%'
  }

  return (
    <ResponsiveContainer
      height={440}
      width="100%"
      className="border p-4 rounded-md overflow-x-scroll min-w-96"
    >
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={matches}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="matchName"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value: string) => value.split(' ')[0].toUpperCase()}
          />
          <YAxis
            dataKey="totalScore"
            tickLine={true}
            tickMargin={10}
            axisLine={true}
            domain={[0, adjustedMaxScore]}
            tickFormatter={(value) => formatNumberToReadableString(value, true)}
          />
          <ChartTooltip
            content={<ChartTooltipContent className="px-2" hideIndicator />}
          />
          <Bar dataKey="totalScore" fill="var(--color-totalScore)" radius={5} />
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  )
}