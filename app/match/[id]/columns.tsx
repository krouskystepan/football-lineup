'use client'

import { Button } from '@/components/ui/button'
import { formatNumberToReadableString } from '@/lib/utils'
import { MatchType, Player } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

export const MatchTableColumns: ColumnDef<MatchType>[] = [
  {
    id: 'playerName',
    accessorKey: 'total',
    header: 'Jméno',
    cell: ({ row }) => {
      const total = row.getValue('total') as {
        playerName: string
        totalScore: number
      }[]
      return (
        <div>
          {total.map((player, index) => (
            <p key={`${player.playerName}_${index}`}>{player.playerName}</p>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'lines[0].players',
    header: 'L 1',
    cell: ({ row }) =>
      row.original.lines[0]?.players.map((player: Player) => (
        <p key={player.id}>
          {formatNumberToReadableString(Number(player.score))}
        </p>
      )),
  },
  {
    accessorKey: 'lines[1].players',
    header: 'L 2',
    cell: ({ row }) =>
      row.original.lines[1]?.players.map((player: Player) => (
        <p key={player.id}>
          {formatNumberToReadableString(Number(player.score))}
        </p>
      )),
  },
  {
    accessorKey: 'lines[2].players',
    header: 'L 3',
    cell: ({ row }) =>
      row.original.lines[2]?.players.map((player: Player) => (
        <p key={player.id}>
          {formatNumberToReadableString(Number(player.score))}
        </p>
      )),
  },
  {
    accessorKey: 'lines[3].players',
    header: 'L 4',
    cell: ({ row }) =>
      row.original.lines[3]?.players.map((player: Player) => (
        <p key={player.id}>
          {formatNumberToReadableString(Number(player.score))}
        </p>
      )),
  },
  {
    accessorKey: 'lines[4].players',
    header: 'L 5',
    cell: ({ row }) =>
      row.original.lines[4]?.players.map((player: Player) => (
        <p key={player.id}>
          {formatNumberToReadableString(Number(player.score))}
        </p>
      )),
  },
  {
    accessorKey: 'lines[5].players',
    header: 'L 6',
    cell: ({ row }) =>
      row.original.lines[5]?.players.map((player: Player) => (
        <p key={player.id}>
          {formatNumberToReadableString(Number(player.score))}
        </p>
      )),
  },
  {
    accessorKey: 'lines[6].players',
    header: 'L 7',
    cell: ({ row }) =>
      row.original.lines[6]?.players.map((player: Player) => (
        <p key={player.id}>
          {formatNumberToReadableString(Number(player.score))}
        </p>
      )),
  },
  {
    accessorKey: 'lines[7].players',
    header: 'L 8',
    cell: ({ row }) =>
      row.original.lines[7]?.players.map((player: Player) => (
        <p key={player.id}>
          {formatNumberToReadableString(Number(player.score))}
        </p>
      )),
  },
  {
    accessorKey: 'lines[8].players',
    header: 'L 9',
    cell: ({ row }) =>
      row.original.lines[8]?.players.map((player: Player) => (
        <p key={player.id}>
          {formatNumberToReadableString(Number(player.score))}
        </p>
      )),
  },
  {
    accessorKey: 'lines[9].players',
    header: 'L 10',
    cell: ({ row }) =>
      row.original.lines[9]?.players.map((player: Player) => (
        <p key={player.id}>
          {formatNumberToReadableString(Number(player.score))}
        </p>
      )),
  },
  {
    accessorKey: 'lines[10].players',
    header: 'L 11',
    cell: ({ row }) =>
      row.original.lines[10]?.players.map((player: Player) => (
        <p key={player.id}>
          {formatNumberToReadableString(Number(player.score))}
        </p>
      )),
  },
  {
    accessorKey: 'total',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Celkem
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const total = row.getValue('total') as {
        playerName: string
        totalScore: number
      }[]
      return (
        <div>
          {total.map((player, index) => (
            <p key={`${player.totalScore}_${index}`}>
              {formatNumberToReadableString(player.totalScore)}
            </p>
          ))}
        </div>
      )
    },
  },
]
