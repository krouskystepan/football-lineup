'use client'

import { Button } from '@/components/ui/button'
import { formatNumberToReadableString } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

export type Payment = {
  id: string
  name: string
  total: number
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'playerName',
    header: 'Jméno',
    cell: ({ row }) => <div>{row.getValue('playerName')}</div>,
  },
  {
    accessorKey: 'numberOfMatches',
    header: 'Počet zápasů',
    cell: ({ row }) => (
      <div className="ml-4">{row.getValue('numberOfMatches')}</div>
    ),
  },
  {
    accessorKey: 'averageScore',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Průměrné skóre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const averageScore = Number(row.getValue('averageScore'))

      const isBadScore = averageScore <= 50_000 ? 'text-destructive' : ''

      return (
        <div className={`ml-6 ${isBadScore}`}>
          {formatNumberToReadableString(averageScore)}
        </div>
      )
    },
  },
  {
    accessorKey: 'totalScore',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Celkové skóre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="ml-6">
        {formatNumberToReadableString(row.getValue('totalScore'))}
      </div>
    ),
  },
]
