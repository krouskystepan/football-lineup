'use client'

import { initialPlayers, NUMBER_OF_LINES } from '@/constants'
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
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { convertToNumber, formatScore } from '@/lib/utils'
import { MatchType } from '@/types'
import { getMatchById, updateMatch } from '@/actions/match.action'

const formSchema = z.object({
  matchName: z.string().min(1, { message: 'Jméno zápasu je povinné' }),
  lines: z.array(
    z.object({
      players: z.array(
        z.object({
          id: z.coerce.number(),
          name: z.string(),
          score: z.string().min(1, { message: 'Povinné' }),
          defaultLine: z.coerce.number(),
        })
      ),
      line: z.coerce.number(),
    })
  ),
})

export default function UpdateMatch({
  params: { id },
}: {
  params: { id: string }
}) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matchName: '',
      lines: Array.from({ length: NUMBER_OF_LINES }, (_, index) => ({
        line: index + 1,
        players: initialPlayers.map((player) => ({
          id: player.id,
          name: player.name,
          score: player.score?.toString() ?? '0',
          defaultLine: player.defaultLine,
        })),
      })),
    },
  })

  useEffect(() => {
    setLoading(true)
    async function fetchMatches() {
      try {
        const fetchedMatch = await getMatchById(id)
        if (!fetchedMatch) return

        const parsedMatch: MatchType = JSON.parse(fetchedMatch)

        form.reset({
          matchName: parsedMatch.matchName,
          lines: parsedMatch.lines.map((line) => ({
            line: line.line,
            players: line.players.map((player) => ({
              id: player.id,
              name: player.name,
              score: player.score?.toString() ?? '0',
              defaultLine: player.defaultLine,
            })),
          })),
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching matches:', error)
      }
    }

    fetchMatches()
  }, [id, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const playerScores: Record<string, number> = {}

      values.lines.forEach((line) => {
        line.players.forEach((player) => {
          const playerId = player.id
          const score = convertToNumber(player.score || '0')
          playerScores[playerId] = (playerScores[playerId] || 0) + score
        })
      })

      const total: Array<{ playerName: string; totalScore: number }> =
        Object.entries(playerScores).map(([id, totalScore]) => {
          const player = initialPlayers.find((p) => p.id === parseInt(id))
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
            score: formatScore(player.score),
          })),
        })),
      }

      await updateMatch(id, formattedValues)
      toast.success('Zápas byl úspěšně aktualizován')
      router.push('/')
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <main className="max-w-7xl mx-auto my-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-center items-center mb-6 ">
            <FormField
              control={form.control}
              name="matchName"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/3">
                  <FormLabel className="text-2xl font-bold">
                    Jméno zápasu
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Zadej jméno zápasu" {...field} />
                  </FormControl>
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
                              placeholder="Zadej skóre"
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
            disabled={
              form.formState.isSubmitting || form.formState.isSubmitSuccessful
            }
            className="w-full"
          >
            Odeslat
          </Button>
        </form>
      </Form>
    </main>
  )
}
