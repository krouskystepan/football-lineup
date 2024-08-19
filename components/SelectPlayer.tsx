import React, { useMemo } from 'react'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from '@/components/ui/select'
import { Player } from '@/types'

interface PlayerSelectProps {
  players: Player[]
  onSelectPlayer: (playerId: number) => void
}

export default function PlayerSelect({
  players,
  onSelectPlayer,
}: PlayerSelectProps) {
  const playerOptions = useMemo(
    () =>
      players.map((player) => (
        <SelectItem key={player.id} value={player.id.toString()}>
          {player.name}
        </SelectItem>
      )),
    [players]
  )

  return (
    <Select onValueChange={(value) => onSelectPlayer(Number(value))}>
      <SelectTrigger className="w-full">
        <p className="text-muted-foreground">add new player</p>
      </SelectTrigger>
      <SelectContent>{playerOptions}</SelectContent>
    </Select>
  )
}
