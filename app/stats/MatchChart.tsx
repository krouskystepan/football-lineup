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
  matches: { createdAt: Date; matchName: string; totalScore: number }[]
}) {
  const maxScore = Math.max(...matches.map((match) => match.totalScore))
  const adjustedMaxScore = Math.ceil(maxScore * 1.1)

  const magnitude = Math.pow(10, Math.floor(Math.log10(adjustedMaxScore)))

  const roundedMaxScore = Math.ceil(adjustedMaxScore / magnitude) * magnitude

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
            tickFormatter={(value: string) => {
              const matchDate = matches.find(
                (match) => match.matchName === value
              )

              const date = matchDate
                ? new Date(matchDate.createdAt)
                : new Date()
              const day = String(date.getDate()).padStart(2, '0')
              const month = String(date.getMonth() + 1).padStart(2, '0')
              return `${day}.${month}`
            }}
          />
          <YAxis
            dataKey="totalScore"
            tickLine={true}
            tickMargin={10}
            axisLine={true}
            domain={[0, roundedMaxScore]}
            tickFormatter={(value) => formatNumberToReadableString(value)}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="px-2"
                labelFormatter={(value) => (
                  <p className="text-center">{value}</p>
                )}
                formatter={(value) => (
                  <>
                    <div className="size-2.5 bg-primary" />
                    <p className="text-muted-foreground font-medium ">
                      Celkové skóre:{' '}
                      <span className="text-foreground">
                        {value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                      </span>
                    </p>
                  </>
                )}
              />
            }
          />
          <Bar dataKey="totalScore" fill="var(--color-totalScore)" radius={5} />
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  )
}
