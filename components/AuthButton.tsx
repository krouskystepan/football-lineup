'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from './ui/button'

export default function SignOutButton() {
  const { data: session } = useSession()

  return (
    <>
      {session ? (
        <Button
          onClick={() => signOut()}
          variant={'destructive'}
          className="w-full sm:w-fit"
        >
          Odhlásit se
        </Button>
      ) : (
        <Button onClick={() => signIn()} className="w-full sm:w-fit">
          Přihlásit se
        </Button>
      )}
    </>
  )
}
