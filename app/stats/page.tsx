import { getAllTimeStats, getMatchStats } from '@/actions/match.action'
import { columns } from './columns'
import { DataTable } from './data-table'
import { MatchChart } from '@/components/MatchChart'
import { Separator } from '@/components/ui/separator'
import { formatNumberToReadableString } from '@/lib/utils'

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
      <div className="hidden min-[320px]:block">
        <h2 className="mb-4 text-3xl font-semibold text-center">
          Statistiky zápasů
        </h2>
        <MatchChart matches={parsedMatchesStats} />
      </div>
      <div className="block min-[320px]:hidden">
        <h2 className="mb-4 text-xl font-semibold text-center">
          Statistiky zápasů json zobrazeny jen na širší obrazovce
        </h2>
      </div>
    </div>
  )
}
