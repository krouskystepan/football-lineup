import { getAllTimeStats } from '@/actions/match.action'
import { columns } from './columns'
import { DataTable } from './data-table'
import { getSeasons } from '@/actions/season.action'
import { SeasonType } from '@/types'
import SeasonDropdown from '@/components/SeasonDropdown'

export default async function StatsPage({
  searchParams,
}: {
  searchParams: { seasonId?: string }
}) {
  const { seasonId } = searchParams

  const seasons = await getSeasons()
  const parsedSeasons: SeasonType[] =
    typeof seasons === 'string' ? JSON.parse(seasons) : seasons

  if (!parsedSeasons || parsedSeasons.length === 0) {
    return <div>Žádné sezóny nenalezeny</div>
  }

  const allTimePlayerStats = await getAllTimeStats(seasonId)

  if (!allTimePlayerStats) {
    return <div>loading...</div>
  }

  const parsedAllTimePlayerStats = JSON.parse(allTimePlayerStats)

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex gap-2 justify-center">
        <h2 className="text-3xl font-semibold text-center">
          Celkové statistiky -
        </h2>
        <SeasonDropdown seasons={parsedSeasons} selectedSeasonId={seasonId} />
      </div>
      <div className="border p-4 w-full rounded-sm">
        <DataTable columns={columns} data={parsedAllTimePlayerStats} />
      </div>
    </div>
  )
}
