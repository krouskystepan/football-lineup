'use client'

import { getLineupById } from '@/actions/lineup.action'
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

const formSchema = z.object({
  name: z.string().min(2).max(50),
  defaultLine: z.coerce.number(),
})

export default function LineupForm({ _id, name, defaultLine }: LineupType) {
  const [loading, setLoading] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      defaultLine: 0,
    },
  })

  useEffect(() => {
    setLoading(true)
    async function fetchLineups() {
      try {
        const fetchedLineup = await getLineupById(_id!)

        if (!fetchedLineup) return

        const parsedMatch: LineupType = JSON.parse(fetchedLineup)

        form.reset({
          name: parsedMatch.name,
          defaultLine: parsedMatch.defaultLine,
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching matches:', error)
      }
    }

    fetchLineups()
  }, [_id, form])

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border p-4 rounded-md space-y-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jméno</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="defaultLine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Line</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Potvrdit
        </Button>
      </form>
    </Form>
  )
}
