import { getMatches } from '@/actions/match.action'
import DeleteButton from '@/components/DeleteButton'
import { Button, buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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

  return (
    <div className="py-4">
      <div className="flex gap-5  items-center">
        <Link href={'/create-match'} className={buttonVariants()}>
          Vytvořit zápas
        </Link>
        <AuthButton />
      </div>

      {matches?.length === 0 && (
        <p className="text-2xl font-bold">Žádné zápasy</p>
      )}

      <div className="grid-cols-1 md:grid-cols-5 gap-4 grid">
        {parsedMatches.map((match) => (
          <div key={match._id} className="border p-4">
            <div className="flex gap-4 justify-between flex-col">
              <h2 className="text-3xl font-bold text-center">
                {match.matchName}
              </h2>
              <Link
                href={`/match/${match._id}`}
                className={buttonVariants({ variant: 'outline' })}
              >
                Detail Zápasu
              </Link>
              {session && (
                <div className="flex gap-4 w-full justify-around">
                  <DeleteDialog id={match._id!} className="w-full" />
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
        ))}
      </div>
    </div>
  )
}
