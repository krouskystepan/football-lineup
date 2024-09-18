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
  level: number
  averageScore?: string
  scorePerLevel?: number
  isActive?: boolean
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
  createdAt?: Date
}

export type MatchTable = {
  playerName: string
  [key: `line${number}`]: number | undefined
  total: number
  totalClass?: string
}

export type LineupType = {
  _id?: string
  name: string
  defaultLine: number
  level: number
}

export type SeasonType = {
  _id?: string
  seasonNumber: number
  startDate: string
  endDate: string
  badScore: number
  mediumScore: number
  goodScore: number
}
