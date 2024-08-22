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
    <div className="max-w-3xl mx-auto py-10">
      <DataTable columns={columns} data={parsedStats} />
    </div>
  )
}
