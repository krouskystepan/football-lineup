import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { AlertDialogHeader, AlertDialogFooter } from './ui/alert-dialog'
import { buttonVariants } from './ui/button'
import DeleteMatchButton from './DeleteMatchButton'
import DeleteSeasonButton from './DeleteSeasonButton'

export function DeleteDialog({
  id,
  className,
  objectName,
  type,
}: {
  id: string
  className?: string
  objectName: string
  type: string
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={buttonVariants({
          variant: 'destructive',
          className,
        })}
      >
        Smazat
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Jsi si jistý? </AlertDialogTitle>
          <AlertDialogDescription>
            Tato akce smaže <span className="font-bold">{objectName}</span>{' '}
            natrvalo z naši databáze. Akce je nevratná.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Zrušit</AlertDialogCancel>
          {type === 'match' && (
            <AlertDialogAction asChild>
              <DeleteMatchButton id={id} />
            </AlertDialogAction>
          )}
          {type === 'season' && (
            <AlertDialogAction asChild>
              <DeleteSeasonButton id={id} />
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
