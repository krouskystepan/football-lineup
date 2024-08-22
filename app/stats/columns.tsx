'use client'

import { Button } from '@/components/ui/button'
import { formatNumberToReadableString } from '@/lib/utils'
import { PlayerStats } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

export const columns: ColumnDef<PlayerStats>[] = [
  {
    accessorKey: 'playerName',
    enableHiding: false,
    header: 'Jméno',
    cell: ({ row }) => {
      return (
        <div className={!row.original.isActive ? 'text-destructive' : ''}>
          {row.getValue('playerName')}
        </div>
      )
    },
  },
  {
    accessorKey: 'numberOfMatches',
    enableHiding: false,
    header: 'Počet zápasů',
    cell: ({ row }) => (
      <div className="ml-4">{row.getValue('numberOfMatches')}</div>
    ),
  },
  {
    accessorKey: 'averageScore',
    enableHiding: false,
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
    accessorKey: 'logWeightedAverage',
    id: 'Log. vážený průměr',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Log. vážený průměr
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const logWeightedAverage = Number(row.getValue('Log. vážený průměr'))

      return (
        <div className={`ml-6`}>
          {logWeightedAverage
            ? formatNumberToReadableString(logWeightedAverage)
            : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'totalScore',
    enableHiding: false,
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
