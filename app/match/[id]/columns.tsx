'use client'

import { Button } from '@/components/ui/button'
import { formatNumberToReadableString } from '@/lib/utils'
import { MatchTable } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

export const MatchTableColumns: ColumnDef<MatchTable>[] = [
  {
    accessorKey: 'playerName',
    enableHiding: false,
    header: 'Jméno',
    cell: ({ row }) => <div>{row.getValue('playerName')}</div>,
  },
  ...Array.from({ length: 11 }, (_, i) => ({
    accessorKey: `line${i + 1}`,
    header: `${i + 1}`,
    cell: ({ row }: { row: any }) => {
      const lineScore = row.getValue(`line${i + 1}`)
      return (
        <div>
          {lineScore !== 0
            ? formatNumberToReadableString(Number(lineScore))
            : '-'}
        </div>
      )
    },
  })),
  {
    accessorKey: 'total',
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="font-semibold"
        >
          Celkem
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const playerTotal = Number(row.getValue('total'))

      return (
        <div className={`ml-4 font-semibold ${row.original.totalClass}`}>
          {formatNumberToReadableString(playerTotal)}
        </div>
      )
    },
  },
]
