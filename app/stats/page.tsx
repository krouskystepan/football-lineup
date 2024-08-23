import { getAllTimeStats, getMatchStats } from '@/actions/match.action'
import { columns } from './columns'
import { DataTable } from './data-table'
import { MatchChart } from '@/components/MatchChart'
import { Separator } from '@/components/ui/separator'

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

  return (
    <div className="max-w-4xl mx-auto p-4 my-4 space-y-4">
      <div>
        <h2 className="mb-4 text-3xl font-semibold text-center">
          Celkové statistiky
        </h2>
        <DataTable columns={columns} data={parsedAllTimePlayerStats} />
      </div>
      <Separator />
      <div>
        <h2 className="mb-4 text-3xl font-semibold text-center">
          Statistiky zápasů
        </h2>
        <MatchChart matches={parsedMatchesStats} />
      </div>
    </div>
  )
}
