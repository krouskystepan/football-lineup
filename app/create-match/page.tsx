'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { createMatch } from '@/actions/match.action'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn, convertToNumber } from '@/lib/utils'
import { LineupType, MatchType } from '@/types'
import { getLineups } from '@/actions/lineup.action'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { useLeavePageConfirm } from '@/hooks/useLeavePageConfirm'

const formSchema = z.object({
  matchName: z.string().min(1, { message: 'Jméno zápasu je povinné' }),
  lines: z.array(
    z.object({
      players: z.array(
        z.object({
          _id: z.string(),
          name: z.string(),
          score: z.string().min(1, { message: 'Povinné' }),
          defaultLine: z.coerce.number(),
        })
      ),
      line: z.coerce.number(),
    })
  ),
  createdAt: z.date({
    required_error: 'Datum zápasu je povinný',
  }),
})

export default function CreateMatch() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [lineups, setLineups] = useState<LineupType[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matchName: '',
      lines: Array.from({ length: 11 }, (_, index) => ({
        line: index + 1,
        players: [],
        createdAt: new Date().toISOString(),
      })),
    },
  })

  useLeavePageConfirm(form.formState.isDirty)

  useEffect(() => {
    setLoading(true)
    async function fetchLineups() {
      try {
        const fetchedLineups = await getLineups()

        if (!fetchedLineups) return

        const parsedLineups: LineupType[] = JSON.parse(fetchedLineups)

        setLineups(parsedLineups)

        form.reset({
          matchName: '',
          lines: Array.from({ length: 11 }, (_, index) => ({
            line: index + 1,
            players: parsedLineups
              .map((lineup) => ({
                _id: lineup._id,
                name: lineup.name,
                score: '0',
                defaultLine: lineup.defaultLine,
              }))
              .sort((a, b) => a.defaultLine - b.defaultLine)
              .reverse(),
          })),
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching matches:', error)
      }
    }

    fetchLineups()
  }, [form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const playerScores: Record<string, number> = {}

      values.lines.forEach((line) => {
        line.players.forEach((player) => {
          const playerId = player._id
          const score = convertToNumber(player.score || '0')
          playerScores[playerId] = (playerScores[playerId] || 0) + score
        })
      })

      const total: Array<{ playerName: string; totalScore: number }> =
        Object.entries(playerScores).map(([id, totalScore]) => {
          const player = lineups.find((p) => p._id === id)
          return {
            playerName: player ? player.name : 'Unknown',
            totalScore: totalScore,
          }
        })

      const formattedValues: MatchType = {
        ...values,
        total,
        lines: values.lines.map((line) => ({
          ...line,
          players: line.players.map((player) => ({
            ...player,
            score: convertToNumber(player.score),
          })),
        })),
      }

      await createMatch(formattedValues)
      toast.success('Zápas byl úspěšně vytvořen')
      router.push('/')
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <main className="max-w-7xl mx-auto my-8 px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-center items-start mb-6 gap-4 flex-col sm:flex-row max-w-2xl mx-auto">
            <FormField
              control={form.control}
              name="matchName"
              render={({ field }) => (
                <FormItem className="w-full sm:w-2/3">
                  <FormLabel className="text-2xl font-bold">
                    Jméno zápasu
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Zadej jméno zápasu" {...field} />
                  </FormControl>
                  <FormDescription>
                    Zadávej jméno zápasu ve formátu: "Jméno zápasu (Země)"
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full sm:w-1/3">
                  <FormLabel className="text-2xl font-bold">
                    Datum zápasu
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: cs })
                          ) : (
                            <span>Vyber datum</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Datum konání zápasu</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {form
            .watch('lines')
            .map((line, lineIndex) => (
              <div
                key={lineIndex}
                className="space-y-2 border p-4 rounded-md my-2"
              >
                <h3 className="text-2xl font-semibold">Line {lineIndex + 1}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 xl:grid-cols-11 gap-4">
                  {line.players.map((player, playerIndex) => (
                    <FormField
                      key={playerIndex}
                      control={form.control}
                      name={`lines.${lineIndex}.players.${playerIndex}.score`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{player.name}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Skóre"
                              {...field}
                              className={`${
                                lineIndex === player.defaultLine - 1
                                  ? 'border-primary/80'
                                  : ''
                              }`}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            ))
            .reverse()}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            Odeslat
          </Button>
        </form>
      </Form>
    </main>
  )
}
