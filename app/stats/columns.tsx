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
      const name = row.getValue('playerName')

      return (
        <div className={!row.original.isActive ? 'text-destructive' : ''}>
          {`${name} ${row.original.level ? `(${row.original.level})` : ''}`}
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
    accessorKey: 'scorePerLevel',
    id: 'Síla',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Síla
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const scorePerLevel = Number(row.getValue('Síla'))

      return (
        <div className={`ml-6`}>
          {scorePerLevel ? formatNumberToReadableString(scorePerLevel) : '-'}
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
