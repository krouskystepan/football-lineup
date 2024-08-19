'use client'

import * as React from 'react'
import { useState } from 'react'
import { Player } from '@/types'
import { initialPlayers } from '@/constants'
import { groupPlayersByLine } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import PlayerSelect from '@/components/SelectPlayer'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

const formSchema = z.object({
  playersByLine: z.array(
    z.object({
      playerId: z.string(),
      line: z.number(),
      name: z.string(),
      score: z.coerce.number(),
    })
  ),
})

type FormValues = z.infer<typeof formSchema>

export default function Match() {
  const [players, setPlayers] = useState<[number, Player[]][]>(
    groupPlayersByLine(initialPlayers).reverse()
  )
  const [availablePlayers, setAvailablePlayers] = useState(initialPlayers)

  const handleAddPlayer = (playerId: number, currentLine: number) => {
    const playerToAdd = availablePlayers.find((p) => p.id === playerId)
    if (!playerToAdd) return

    setPlayers((prev) => {
      const newPlayers = prev.map(([line, linePlayers]) =>
        line === currentLine
          ? [line, [...linePlayers, { ...playerToAdd, line: currentLine }]]
          : [line, linePlayers]
      ) as [number, Player[]][]

      return newPlayers.sort(([a], [b]) => a - b)
    })

    setAvailablePlayers((prev) => prev.filter((p) => p.id !== playerId))
  }

  const handleRemovePlayer = (playerId: number, line: number) => {
    setPlayers((prev) => {
      const updatedPlayers = prev.map(([currentLine, linePlayers]) =>
        currentLine === line
          ? [currentLine, linePlayers.filter((p) => p.id !== playerId)]
          : [currentLine, linePlayers]
      ) as [number, Player[]][]

      return updatedPlayers.sort(([a], [b]) => a - b)
    })

    setAvailablePlayers((prev) => {
      const playerToAddBack = initialPlayers.find((p) => p.id === playerId)
      if (playerToAddBack && !prev.some((p) => p.id === playerId)) {
        return [...prev, playerToAddBack]
      }
      return prev
    })
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playersByLine: players.flatMap(([line, linePlayers]) =>
        linePlayers.map((player) => ({
          playerId: String(player.id),
          line,
          name: player.name,
          score: 0,
        }))
      ),
    },
  })

  function onSubmit(values: FormValues) {
    console.log(values)
  }

  return (
    <main className="max-w-7xl mx-auto my-4">
      <h1 className="text-center text-5xl font-bold mb-3">Match</h1>
      <Button onClick={() => console.log('score', players)}>
        Display score
      </Button>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {players.map(([line, linePlayers]) => (
            <div key={line} className="border p-4 rounded-md flex-auto">
              <h2 className="text-2xl font-bold">Line {line}</h2>
              <ul className="space-y-2">
                {linePlayers.map((player, index) => (
                  <li
                    key={`${player.id}-${line}`}
                    className="flex gap-2 items-center"
                  >
                    <FormField
                      control={form.control}
                      name={`playersByLine.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="min-w-52">
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              readOnly
                              disabled
                              value={player.name}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`playersByLine.${index}.score`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleRemovePlayer(player.id, line)}
                    >
                      <X />
                    </Button>
                  </li>
                ))}
              </ul>
              <Separator className="my-2 h-px rounded-md" />
              <PlayerSelect
                players={availablePlayers}
                onSelectPlayer={(playerId) => handleAddPlayer(playerId, line)}
              />
            </div>
          ))}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  )
}
