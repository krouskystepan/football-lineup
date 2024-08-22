'use server'

import Lineup from '@/database/lineup.model'
import { connectToDatabase } from '@/lib/db'
import { LineupType } from '@/types'
import { revalidatePath } from 'next/cache'

// export async function createLineup(name: string, defaultLine: number) {
//   try {
//     await connectToDatabase()
//     await Lineup.create({ name, defaultLine })
//     revalidatePath('/')
//   } catch (error) {
//     console.error('Error creating lineup:', error)
//   }
// }

export async function updateLineup(players: LineupType[]) {
  try {
    await connectToDatabase()
    await Lineup.deleteMany({})
    await Lineup.create(players)
    revalidatePath('/')
  } catch (error) {
    console.error('Error updating lineup:', error)
  }
}

export async function getLineups() {
  try {
    await connectToDatabase()
    const lineups = await Lineup.find({})
    return JSON.stringify(lineups)
  } catch (error) {
    console.error('Error getting lineups:', error)
  }
}
