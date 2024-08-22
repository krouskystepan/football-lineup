import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import DeleteButton from './DeleteButton'
import { AlertDialogHeader, AlertDialogFooter } from './ui/alert-dialog'
import { buttonVariants } from './ui/button'

export function DeleteDialog({
  id,
  className,
  matchName,
}: {
  id: string
  className?: string
  matchName: string
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
            Tato akce smaže zápas <span className="font-bold">{matchName}</span>{' '}
            natrvalo z naši databáze. Akce je nevratná.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Zrušit</AlertDialogCancel>
          <AlertDialogAction asChild>
            <DeleteButton id={String(id)} />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
