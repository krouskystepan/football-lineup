'use client'
import React from 'react'
import { Button } from './ui/button'
import { deleteMatch } from '@/actions/match.action'
import { toast } from 'sonner'
import { revalidatePath } from 'next/cache'

export default function DeleteButton({ id }: { id: string }) {
  const handleDelete = async (matchId: string) => {
    try {
      await deleteMatch(matchId)
      toast.success('Zápas byl smazán')
      revalidatePath('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Button variant={'destructive'} onClick={() => handleDelete(id)}>
      Smazat
    </Button>
  )
}
