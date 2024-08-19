import { Player } from '@/types'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function groupPlayersByLine(players: Player[]): [number, Player[]][] {
  const lineMap = new Map<number, Player[]>()

  players.forEach((player) => {
    const lineNumber = player.defaultLine
    if (!lineMap.has(lineNumber)) {
      lineMap.set(lineNumber, [])
    }
    lineMap.get(lineNumber)!.push(player)
  })

  return Array.from(lineMap.entries()).sort(([a], [b]) => a - b)
}
