'use client'

import { getLineups, updateLineup } from '@/actions/lineup.action'
import { LineupType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useLeavePageConfirm } from '@/hooks/useLeavePageConfirm'

const formSchema = z.object({
  players: z.array(
    z.object({
      _id: z.string(),
      name: z.string(),
      level: z.coerce.number().positive(),
      defaultLine: z.coerce.number().positive(),
    })
  ),
})

type FormValues = z.infer<typeof formSchema>

export default function Lineup() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      players: [],
    },
  })

  useLeavePageConfirm(form.formState.isDirty)

  useEffect(() => {
    async function fetchLineups() {
      try {
        setLoading(true)
        const fetchedLineups = await getLineups()
        if (!fetchedLineups) return

        const parsedLineups: LineupType[] = JSON.parse(fetchedLineups)

        const processedLineups = parsedLineups.map((lineup) => ({
          _id: lineup._id,
          name: lineup.name,
          level: lineup.level,
          defaultLine: lineup.defaultLine,
        }))

        const sortedLineups = processedLineups
          .sort((a, b) => a.level - b.level)
          .reverse()

        form.reset({
          players: sortedLineups,
        })

        setLoading(false)
      } catch (error) {
        console.error('Error fetching lineups:', error)
      }
    }

    fetchLineups()
  }, [form])

  async function onSubmit(values: FormValues) {
    try {
      await updateLineup(values.players)
      toast.success('Sestava byla úspěšně uložena')
      router.push('/')
    } catch (error) {
      console.error('Error saving lineup:', error)
      toast.error('Sestavu se nepodařilo uložit')
    }
  }

  const autoSortLines = () => {
    const sortedPlayers = [...form.getValues('players')].sort(
      (a, b) => b.level - a.level
    )
    const totalLines = Math.ceil(sortedPlayers.length / 2)

    sortedPlayers.forEach((player, index) => {
      player.defaultLine = totalLines - Math.floor(index / 2)
    })

    form.setValue('players', sortedPlayers)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="py-4 px-4 w-full">
        <div className="grid grid-cols-1 min-[460px]:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <FormField
            control={form.control}
            name="players"
            render={({ field }) => (
              <>
                {field.value.map((player, index) => (
                  <div
                    key={player._id || index}
                    className="border p-4 rounded-md grow space-y-2 lg:[&:nth-last-child(2)]:col-start-2 xl:[&:nth-last-child(2)]:col-auto xl:[&:nth-last-child(4)]:col-start-2"
                  >
                    <FormItem>
                      <FormLabel>Jméno</FormLabel>
                      <FormControl>
                        <Input {...form.register(`players.${index}.name`)} />
                      </FormControl>
                    </FormItem>
                    <div className="flex gap-2">
                      <FormItem>
                        <FormLabel>Line</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...form.register(`players.${index}.defaultLine`)}
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...form.register(`players.${index}.level`)}
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                  </div>
                ))}
              </>
            )}
          />
        </div>
        <div className="mt-3 flex gap-2 flex-col md:flex-row">
          <Button
            type="button"
            className="w-full md:w-1/4"
            onClick={autoSortLines}
            variant={'outline'}
          >
            Seřadit lajny podle lvlu
          </Button>
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            Odeslat
          </Button>
        </div>
      </form>
    </Form>
  )
}
