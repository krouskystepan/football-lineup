import { getSeasons } from '@/actions/season.action'
import { DeleteDialog } from '@/components/DeleteDialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { formatNumberToReadableString } from '@/lib/utils'
import { SeasonType } from '@/types'
import { Pencil, Plus, Settings } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default async function Seasons() {
  const session = await getServerSession()
  const seasons = await getSeasons()

  if (!seasons) return <div>Loading...</div>

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

  return (
    <div className="mx-auto max-w-3xl mt-4 px-4">
      <div className="mb-2 flex gap-2 justify-center items-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-center">
          Detailní popis sezón
        </h2>
        {session?.user?.name && (
          <Link
            className={buttonVariants({
              className: 'p-1 cursor-pointer',
              size: 'icon',
            })}
            href={'/create-season'}
          >
            <Plus />
          </Link>
        )}
      </div>
      <div className="mt-3 grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {parsedSeasons
          .map((season) => (
            <div key={season._id} className="border p-2 space-y-0.5">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-xl md:text-2xl">
                  {season.seasonName}
                </h2>
                {session?.user?.name && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size={'sm'} variant={'secondary'}>
                        <Settings />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="space-y-0.5">
                      <DropdownMenuItem className="!p-0">
                        <Link
                          className={buttonVariants({
                            className: 'cursor-pointer w-full',
                            variant: 'edit',
                          })}
                          href={`/update-season/${season._id}`}
                        >
                          Upravit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <DeleteDialog
                          id={season._id!}
                          objectName={season.seasonName}
                          className="w-full"
                          type="season"
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <p>
                <strong>Start:</strong>{' '}
                {season.date.from.toLocaleDateString('cs')}
              </p>
              <p>
                <strong>Konec:</strong>{' '}
                {season.date.to.toLocaleDateString('cs')}
              </p>
              <p className="badScore pt-1">
                <strong>Špatné skóre:</strong>{' '}
                {formatNumberToReadableString(season.badScore)}
              </p>
              <p className="mediumScore">
                <strong>Průměrné skóre:</strong>{' '}
                {formatNumberToReadableString(season.mediumScore)}
              </p>
              <p className="goodScore">
                <strong>Dobré skóre:</strong>{' '}
                {formatNumberToReadableString(season.goodScore)}
              </p>
            </div>
          ))
          .reverse()}
      </div>
    </div>
  )
}
