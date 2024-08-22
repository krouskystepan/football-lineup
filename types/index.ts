export type Player = {
  _id: string
  name: string
  defaultLine: number
  score?: string
}

export type PlayerStats = {
  playerName: string
  totalScore: string
  numberOfMatches: number
  averageScore?: string
}

export type MatchType = {
  _id?: string
  matchName: string
  lines: Array<{
    line: number
    players: Player[]
  }>
  total: Array<{
    playerName: string
    totalScore: number
  }>
  createdAt: Date
}

export type MatchTable = {
  playerName: string
  [key: `line${number}`]: number | undefined
  total: number
}

export type LineupType = {
  _id?: string
  name: string
  defaultLine: number
}
