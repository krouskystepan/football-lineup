import { getAllTimeStats, getMatchStats } from '@/actions/match.action'
import { columns } from './columns'
import { DataTable } from './data-table'
import { MatchChart } from './MatchChart'

export default async function StatsPage() {
  const allTimePlayerStats = await getAllTimeStats()
  const matchesStats = await getMatchStats()

  if (!allTimePlayerStats || !matchesStats) {
    return <div>loading...</div>
  }

  const parsedAllTimePlayerStats = JSON.parse(allTimePlayerStats)
  const parsedMatchesStats = JSON.parse(matchesStats)

  parsedMatchesStats.sort(
    (a: any, b: any) =>
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  )

  console.log(parsedAllTimePlayerStats)

  return (
    <div className="max-w-4xl mx-auto p-4 mb-2 space-y-4">
      <div>
        <h2 className="mb-4 text-3xl font-semibold text-center">
          Celkové statistiky
        </h2>
        <div className="border p-4 w-full rounded-sm">
          <DataTable columns={columns} data={parsedAllTimePlayerStats} />
        </div>
      </div>
      <div className="hidden min-[320px]:block">
        <h2 className="mb-4 text-3xl font-semibold text-center">
          Statistiky zápasů
        </h2>
        <MatchChart matches={parsedMatchesStats} />
      </div>
      <div className="block min-[320px]:hidden">
        <h2 className="mb-4 text-xl font-semibold text-center">
          Statistiky zápasů jsou zobrazeny jen na širší obrazovce
        </h2>
      </div>
    </div>
  )
}
