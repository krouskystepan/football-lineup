import { getAllTimeStats } from '@/actions/match.action'
import { columns } from './columns'
import { DataTable } from './data-table'

export default async function StatsPage() {
  const stats = await getAllTimeStats()

  if (!stats) {
    return <div>loading...</div>
  }

  const parsedStats = JSON.parse(stats)

  return (
    <div className="max-w-3xl mx-auto p-4 mt-2">
      <h2 className="mb-4 text-3xl font-semibold text-center">
        Celkové statistiky
      </h2>
      <DataTable columns={columns} data={parsedStats} />
    </div>
  )
}
