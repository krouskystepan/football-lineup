import { getMatches } from '@/actions/match.action'
import { MatchType } from '@/types'
import React from 'react'
import { MatchTableColumns } from './columns'
import { DataTable } from './data-table'

export default async function MatchDetail() {
  const matches = await getMatches()

  if (!matches) {
    return <div>loading...</div>
  }

  const parsedMatches: MatchType[] = JSON.parse(matches)

  return (
    <div className="max-w-5xl mx-auto my-4 border p-4">
      <DataTable columns={MatchTableColumns} data={parsedMatches} />
    </div>
  )
}
