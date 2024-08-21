import { getMatchById } from '@/actions/match.action'
import { MatchType } from '@/types'
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

  return (
    <div className="max-w-5xl mx-auto my-4 border p-4">
      <DataTable columns={MatchTableColumns} data={[parsedMatch]} />
    </div>
  )
}
