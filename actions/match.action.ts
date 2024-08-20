'use server'

import Match from '@/database/match.model'
import { connectToDatabase } from '@/lib/db'
import { MatchType } from '@/types'
import { revalidatePath } from 'next/cache'

export async function createMatch(match: MatchType) {
  try {
    await connectToDatabase()

    Match.create(match)
    revalidatePath('/')
  } catch (error) {
    console.error(error)
  }
}

export async function getMatches() {
  try {
    await connectToDatabase()

    const matches = await Match.find({})

    return matches
  } catch (error) {
    console.error('Error fetching matches:', error)
  }
}
