'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn, convertToNumber } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import React from 'react'
import { cs } from 'date-fns/locale'
import { Input } from '@/components/ui/input'
import { createSeason } from '@/actions/season.action'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const FormSchema = z.object({
  seasonName: z.string(),
  date: z.object({
    from: z.date(),
    to: z.date(),
  }),
  badScore: z.string().min(1, { message: 'Povinné' }),
  mediumScore: z.string().min(1, { message: 'Povinné' }),
  goodScore: z.string().min(1, { message: 'Povinné' }),
})

export default function CreateSeason() {
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      seasonName: '',
      date: {
        from: new Date(),
        to: addDays(new Date(), 30),
      },
      badScore: '',
      mediumScore: '',
      goodScore: '',
    },
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      const preparedValues = {
        seasonName: values.seasonName,
        date: {
          from: values.date.from,
          to: values.date.to,
        },
        badScore: convertToNumber(values.badScore),
        mediumScore: convertToNumber(values.mediumScore),
        goodScore: convertToNumber(values.goodScore),
      }

      await createSeason(preparedValues)

      toast.success('Sezóna byla úspěšně vytvořena')
      router.push('/seasons')
    } catch (error) {}
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 mx-auto max-w-lg"
      >
        <h2 className="font-bold text-2xl text-center">
          Vytvořit novou sezónu
        </h2>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="seasonName"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Jméno sezóny</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Např. Sezóna 8</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Datum sezóny</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, 'LLL dd, y', {
                                locale: cs,
                              })}{' '}
                              -{' '}
                              {format(field.value.to, 'LLL dd, y', {
                                locale: cs,
                              })}
                            </>
                          ) : (
                            format(field.value.from, 'LLL dd, y', {
                              locale: cs,
                            })
                          )
                        ) : (
                          <span>Vyber datum</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={field.value.from}
                      selected={{
                        from: field.value.from!,
                        to: field.value.to,
                      }}
                      onSelect={field.onChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Začátek a konec sezóny.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <FormField
            control={form.control}
            name="badScore"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="badScore font-semibold">Špatné</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mediumScore"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="mediumScore font-semibold">
                  Průměrné
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="goodScore"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="goodScore font-semibold">Dobré</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full mt-3">
          Odeslat
        </Button>
      </form>
    </Form>
  )
}
