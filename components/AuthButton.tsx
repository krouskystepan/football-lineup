'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from './ui/button'

export default function SignOutButton() {
  const { data: session } = useSession()

  return (
    <div>
      {session ? (
        <Button onClick={() => signOut()} variant={'destructive'}>
          Odhlásit se
        </Button>
      ) : (
        <Button onClick={() => signIn()}>Přihlásit se</Button>
      )}
    </div>
  )
}
