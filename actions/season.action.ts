'use server'

import Season from '@/database/season.model'
import { connectToDatabase } from '@/lib/db'
import { isLoggedIn } from '@/lib/utils'
import { SeasonType } from '@/types'
import { revalidatePath } from 'next/cache'

export async function createSeason(season: SeasonType) {
  try {
    await isLoggedIn()
    await connectToDatabase()

    const overlappingSeason = await Season.findOne({
      $or: [
        {
          'date.from': { $lt: season.date.to },
          'date.to': { $gt: season.date.from },
        },
      ],
    })

    if (overlappingSeason) {
      throw new Error('A season with overlapping dates already exists.')
    }

    await Season.create(season)

    revalidatePath('/seasons')
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to create season: ${error}`)
  }
}

export async function getSeasons() {
  try {
    await connectToDatabase()
    const seasons = await Season.find({})

    revalidatePath('/')
    return JSON.stringify(seasons)
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to get season: ${error}`)
  }
}

export async function getSeasonById(id: string) {
  try {
    await connectToDatabase()
    const season = await Season.findById(id)

    return JSON.stringify(season)
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to get season: ${error}`)
  }
}

export async function updateSeason(id: string, season: SeasonType) {
  try {
    await isLoggedIn()
    await connectToDatabase()

    const overlappingSeason = await Season.findOne({
      $or: [
        {
          'date.from': { $lt: season.date.to },
          'date.to': { $gt: season.date.from },
        },
      ],
    })

    if (overlappingSeason) {
      throw new Error('A season with overlapping dates already exists.')
    }

    await Season.updateOne({ id }, season)

    revalidatePath('/seasons')
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to update season: ${error}`)
  }
}

export async function deleteSeason(id: string) {
  try {
    await isLoggedIn()
    await connectToDatabase()

    await Season.findByIdAndDelete(id)

    revalidatePath('/seasons')
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to delete season: ${error}`)
  }
}
