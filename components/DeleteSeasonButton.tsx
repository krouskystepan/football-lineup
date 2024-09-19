'use client'

import React from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { deleteSeason } from '@/actions/season.action'

export default function DeleteMatchButton({ id }: { id: string }) {
  const handleDelete = async (seasonId: string) => {
    try {
      await deleteSeason(seasonId)
      toast.success('Sezóna byla smazána')
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
