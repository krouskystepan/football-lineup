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
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  players: z.array(
    z.object({
      _id: z.string(),
      name: z.string(),
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
          defaultLine: lineup.defaultLine,
        }))

        const sortedLineups = processedLineups
          .sort((a, b) => a.defaultLine - b.defaultLine)
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

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="py-4 flex flex-wrap flex-auto gap-4 w-full"
      >
        <FormField
          control={form.control}
          name="players"
          render={({ field }) => (
            <>
              {field.value.map((player, index) => (
                <div
                  key={player._id || index}
                  className="border p-4 rounded-md grow space-y-2"
                >
                  <FormItem>
                    <FormLabel>Jméno</FormLabel>
                    <FormControl>
                      <Input {...form.register(`players.${index}.name`)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Default Line</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...form.register(`players.${index}.defaultLine`)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              ))}
            </>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          Odeslat
        </Button>
      </form>
    </Form>
  )
}
