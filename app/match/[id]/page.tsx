import { getMatchById } from '@/actions/match.action'
import { MatchType, MatchTable } from '@/types'
import { MatchTableColumns } from './columns'
import { DataTable } from './data-table'

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

  const tableData: MatchTable[] = []

  // Extract lines and total once
  const lines = parsedMatch.lines
  const total = parsedMatch.total

  // Initialize table data with player names and scores for 11 lines
  total.forEach((player) => {
    const playerLines = lines.filter((line) =>
      line.players.some(
        (p) => p.name === player.playerName && Number(p.score) > 0
      )
    )

    // Create an object with player data
    const playerData: MatchTable = {
      playerName: player.playerName,
      total: player.totalScore,
    }

    // Add scores for each line (up to 11 lines)
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
    <section className="mx-auto max-w-7xl min-h-dvh flex items-center justify-center p-2">
      <div className="border p-4 w-full rounded-sm">
        <DataTable columns={MatchTableColumns} data={tableData} />
      </div>
    </section>
  )
}
