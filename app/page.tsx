import { getMatches } from '@/actions/match.action'
import { buttonVariants } from '@/components/ui/button'
import { MatchType } from '@/types'
import Link from 'next/link'
import { DeleteDialog } from '@/components/DeleteDialog'
import AuthButton from '@/components/AuthButton'
import { getServerSession } from 'next-auth'

export const revalidate = 3600

export default async function Home() {
  const session = await getServerSession()
  const matches = await getMatches()

  if (!matches) {
    return <div>loading...</div>
  }

  const parsedMatches: MatchType[] = JSON.parse(matches)

  parsedMatches.sort(
    (a, b) =>
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  )

  return (
    <main>
      <div className="border-b p-2 flex justify-between flex-col sm:flex-row gap-2">
        <Link
          href={'/stats'}
          className={buttonVariants({ variant: 'outline' })}
        >
          Celkové statistiky
        </Link>
        <div className="flex flex-col gap-2 sm:flex-row items-center justify-end">
          {session?.user && (
            <div className="flex-col sm:flex-row flex gap-2 w-full sm:w-fit">
              <Link
                href={'/create-match'}
                className={buttonVariants({ className: 'w-full md:w-fit' })}
              >
                Vytvořit zápas
              </Link>
              <Link
                href={'/edit-lineup'}
                className={buttonVariants({
                  variant: 'edit',
                  className: 'w-full md:w-fit',
                })}
              >
                Upravit sestavu
              </Link>
            </div>
          )}
          <AuthButton />
        </div>
      </div>

      {matches?.length === 0 && (
        <p className="text-2xl font-bold">Žádné zápasy</p>
      )}

      <div className="grid-cols-1 md:grid-cols-5 gap-4 grid p-4">
        {parsedMatches.map((match) => {
          const splitedName = match.matchName.match(/^(.*)\s\((.*)\)$/)

          if (!splitedName) return

          const name = splitedName[1]
          const country = splitedName[2]

          return (
            <div key={match._id} className="border p-4 min-w-full sm:min-w-80">
              <div className="flex gap-2 sm:gap-4 justify-between flex-col">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-center line-clamp-1 mb-1">
                    {name}
                  </h2>
                  <h2 className="text-lg sm:text-xl font-semibold text-center line-clamp-1">
                    {`(${country})`}
                  </h2>
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
                      matchName={match.matchName}
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
    </main>
  )
}
