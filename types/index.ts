export type Player = {
  id: number
  name: string
  defaultLine: number
  score?: string
}

export type MatchType = {
  _id?: string
  matchName: string
  lines: Array<{
    line: number
    players: Player[]
  }>
}
