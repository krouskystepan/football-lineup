'use client'

import Link from 'next/link'
import React from 'react'
import AuthButton from './AuthButton'
import { buttonVariants } from './ui/button'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <div className="border-b p-2 flex flex-col min-[880px]:flex-row gap-2 justify-between">
      <div className="flex items-center gap-2 flex-col sm:flex-row">
        <Link
          href={'/stats'}
          className={buttonVariants({
            variant: 'outline',
            className: `w-full sm:w-1/2  min-[880px]:w-fit ${
              pathname === '/stats' ? 'text-primary' : ''
            }`,
          })}
        >
          Celkové statistiky
        </Link>
        <Link
          href={'/'}
          className={buttonVariants({
            variant: 'outline',
            className: `w-full sm:w-1/2 min-[880px]:w-fit ${
              pathname === '/' ? 'text-primary' : ''
            }`,
          })}
        >
          Všechny zápasy
        </Link>
      </div>

      {pathname === '/' && (
        <div className="flex flex-col gap-2 min-[880px]:flex-row items-center">
          {session?.user && (
            <div className="flex-col sm:flex-row flex gap-2 w-full min-[880px]:w-fit">
              <Link
                href={'/create-match'}
                className={buttonVariants({
                  className: 'w-full sm:w-1/2 min-[880px]:w-fit',
                })}
              >
                Vytvořit zápas
              </Link>
              <Link
                href={'/edit-lineup'}
                className={buttonVariants({
                  variant: 'edit',
                  className: 'w-full sm:w-1/2 min-[880px]:w-fit',
                })}
              >
                Upravit sestavu
              </Link>
            </div>
          )}
          <AuthButton />
        </div>
      )}
    </div>
  )
}
