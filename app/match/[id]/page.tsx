import { getMatchById } from '@/actions/match.action'
import { MatchType, MatchTable, SeasonType } from '@/types'
import { MatchTableColumns } from './columns'
import { DataTable } from './data-table'
import { getScoreClass } from '@/lib/utils'
import { getSeasons } from '@/actions/season.action'

const getCurrentSeason = async (matchDate: Date) => {
  const seasons = await getSeasons()

  const parsedSeasons: SeasonType[] = JSON.parse(seasons)

  return parsedSeasons.find(
    (season) =>
      new Date(season.date.from) <= matchDate &&
      new Date(season.date.to) >= matchDate
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

  let currentSeason = await getCurrentSeason(matchDate)

  if (!currentSeason) {
    currentSeason = {
      seasonName: '',
      date: { from: new Date(), to: new Date() },
      badScore: 0,
      mediumScore: 0,
      goodScore: 0,
    }
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
