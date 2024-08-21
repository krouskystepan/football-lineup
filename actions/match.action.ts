'use server'

import Match from '@/database/match.model'
import { connectToDatabase } from '@/lib/db'
import { MatchType } from '@/types'
import { revalidatePath } from 'next/cache'

export async function createMatch(match: MatchType) {
  try {
    await connectToDatabase()

    await Match.create(match)
    revalidatePath('/')
  } catch (error) {
    console.error(error)
  }
}

export async function updateMatch(id: string, match: MatchType) {
  try {
    await connectToDatabase()

    await Match.findByIdAndUpdate(id, match, { new: true })
    revalidatePath('/')
  } catch (error) {
    console.error(error)
  }
}

export async function getMatchById(id: string) {
  try {
    await connectToDatabase()

    const match = await Match.findById(id)

    revalidatePath('/')
    return JSON.stringify(match)
  } catch (error) {
    console.error(error)
  }
}

export async function deleteMatch(id: string) {
  try {
    await connectToDatabase()

    console.log('Deleting match with id:', id)

    await Match.findByIdAndDelete(id)
    revalidatePath('/')
  } catch (error) {
    console.error(error)
  }
}

export async function getMatches() {
  try {
    await connectToDatabase()

    const matches = await Match.find({})

    revalidatePath('/')
    return JSON.stringify(matches)
  } catch (error) {
    console.error('Error fetching matches:', error)
  }
}
