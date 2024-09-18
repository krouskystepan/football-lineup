import { getMatchById } from '@/actions/match.action'
import { MatchType, MatchTable } from '@/types'
import { MatchTableColumns } from './columns'
import { DataTable } from './data-table'
import { SEASONS } from '@/constants'
import { getScoreClass } from '@/lib/utils'

const getCurrentSeason = (matchDate: Date) => {
  return SEASONS.find(
    (season) =>
      new Date(season.startDate) <= matchDate &&
      new Date(season.endDate) >= matchDate
  )
}

export default async function MatchDetail({
  params: { id },
}: {
  params: { id: string }
}) {
  const match = await getMatchById(id)

  if (!match) {
    return <div>loading...</div>
  }

  const parsedMatch: MatchType = JSON.parse(match)
  const matchDate = new Date(parsedMatch.createdAt || Date.now())

  const currentSeason = getCurrentSeason(matchDate)

  if (!currentSeason) {
    return <div>No season data available for this match</div>
  }

  const tableData: MatchTable[] = []
  const lines = parsedMatch.lines
  const total = parsedMatch.total

  total.forEach((player) => {
    const playerLines = lines.filter((line) =>
      line.players.some(
        (p) => p.name === player.playerName && Number(p.score) > 0
      )
    )

    const playerData: MatchTable = {
      playerName: player.playerName,
      total: player.totalScore,
      totalClass: getScoreClass(
        player.totalScore,
        currentSeason.badScore,
        currentSeason.mediumScore,
        currentSeason.goodScore
      ),
    }

    for (let i = 1; i <= 11; i++) {
      const line = playerLines.find((line) => line.line === i)
      playerData[`line${i}`] = line
        ? Number(
            line.players.find((p) => p.name === player.playerName)?.score || 0
          )
        : 0
    }

    tableData.push(playerData)
  })

  return (
    <section className="mx-auto max-w-fit min-h-dvh flex items-center p-2 flex-col">
      <h2 className="mb-2 text-3xl font-semibold">{parsedMatch.matchName}</h2>
      <div className="border p-4 w-full rounded-sm">
        <DataTable columns={MatchTableColumns} data={tableData} />
      </div>
    </section>
  )
}
