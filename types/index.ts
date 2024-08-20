export type Player = {
  id: number
  name: string
  defaultLine: number
  score?: number
}

export type MatchType = {
  matchName: string
  lines: Array<{
    line: number
    players: Player[]
  }>
}
