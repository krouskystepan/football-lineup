import { getMatches } from '@/actions/match.action'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MatchType } from '@/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default async function Home() {
  const matches: MatchType[] | undefined = await getMatches()

  console.log('Matches:', matches)

  return (
    <div className="py-4">
      <div className="flex gap-5  items-center">
        <h1>Football Lineup Manager</h1>
        <Link href={'/match'} className={buttonVariants()}>
          Vytvorit zapas
        </Link>
      </div>
      <div className="grid-cols-1 md:grid-cols-3 gap-4 grid">
        {matches?.map((match) => (
          <div key={match.matchName} className="border p-4">
            <h2 className="text-3xl font-bold text-center">
              {match.matchName}
            </h2>
            {match.lines.map((line, index) => (
              <div key={index} className="group">
                <h3 className="text-xl font-semibold">Line {index + 1}</h3>
                <div className="grid grid-cols-4">
                  {line.players.map((player) => (
                    <div key={player.id}>
                      <p>{player.name}</p>
                      <p>{player.score}</p>
                    </div>
                  ))}
                </div>
                <Separator className="group-last:hidden my-2 h-px w-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
