import { getMatches } from '@/actions/match.action'
import { buttonVariants } from '@/components/ui/button'
import { MatchType, SeasonType } from '@/types'
import Link from 'next/link'
import { DeleteDialog } from '@/components/DeleteDialog'
import { getServerSession } from 'next-auth'
import { Badge } from '@/components/ui/badge'
import { getSeasons } from '@/actions/season.action'

export const revalidate = 3600

export default async function Home() {
  const session = await getServerSession()
  const matches = await getMatches()
  const seasons = await getSeasons()

  if (!matches || !seasons) {
    return <div>loading...</div>
  }

  const parsedMatches: MatchType[] = JSON.parse(matches)
  const parsedSeasons: SeasonType[] = JSON.parse(seasons).map(
    (season: SeasonType) => ({
      ...season,
      date: {
        from: new Date(season.date.from),
        to: new Date(season.date.to),
      },
    })
  )

  parsedSeasons.sort((a, b) => a.date.from.getTime() - b.date.from.getTime())

  parsedMatches.sort(
    (a, b) =>
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  )

  const groupedMatchesBySeason = parsedSeasons.map((season) => {
    const seasonStart = new Date(season.date.from)
    const seasonEnd = new Date(season.date.to)

    const seasonMatches = parsedMatches.filter((match) => {
      const matchDate = new Date(match.createdAt!)
      return matchDate >= seasonStart && matchDate <= seasonEnd
    })

    return {
      seasonName: season.seasonName,
      matches: seasonMatches,
    }
  })

  const matchesInSeasons = groupedMatchesBySeason.flatMap(
    (group) => group.matches
  )

  const restMatches = parsedMatches.filter(
    (match) => !matchesInSeasons.includes(match)
  )

  if (restMatches.length > 0) {
    groupedMatchesBySeason.unshift({
      seasonName: 'Ostatní',
      matches: restMatches,
    })
  }

  return (
    <main className="mt-2">
      {groupedMatchesBySeason
        .map(({ seasonName, matches }) => (
          <div key={seasonName}>
            <h2 className="text-3xl font-bold px-4">{seasonName}</h2>

            {matches.length === 0 ? (
              <p className="text-xl font-semibold mb-2 p-4">Žádné zápasy</p>
            ) : (
              <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 grid p-4">
                {matches.map((match) => {
                  const splitedName = match.matchName.match(/^(.*)\s\((.*)\)$/)

                  const name = splitedName ? splitedName[1] : match.matchName
                  const country = splitedName ? splitedName[2] : ''

                  const matchDate = new Date(
                    match.createdAt!
                  ).toLocaleDateString('cs')

                  return (
                    <div
                      key={match._id}
                      className="relative border p-4 min-w-full sm:min-w-80"
                    >
                      <Badge
                        className="bg-background absolute top-[-12.5px] right-1/2 translate-x-1/2"
                        variant={'outline'}
                      >
                        {matchDate}
                      </Badge>
                      <div className="flex gap-2 sm:gap-4 justify-between flex-col">
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-bold text-center line-clamp-1 mb-1">
                            {name}
                          </h2>
                          {country && (
                            <h2 className="text-lg sm:text-xl font-semibold text-center line-clamp-1">
                              {`(${country})`}
                            </h2>
                          )}
                        </div>
                        <Link
                          href={`/match/${match._id}`}
                          className={buttonVariants({ variant: 'outline' })}
                        >
                          Detail Zápasu
                        </Link>
                        {session?.user && (
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full justify-around">
                            <DeleteDialog
                              id={match._id!}
                              className="w-full"
                              objectName={match.matchName}
                              type="match"
                            />
                            <Link
                              href={`/update-match/${match._id}`}
                              className={buttonVariants({
                                variant: 'secondary',
                                className: 'w-full',
                              })}
                            >
                              Aktualizovat
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))
        .reverse()}
    </main>
  )
}
