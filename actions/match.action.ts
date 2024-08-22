'use server'

import Lineup from '@/database/lineup.model'
import Match from '@/database/match.model'
import { connectToDatabase } from '@/lib/db'
import { isLoggedIn } from '@/lib/utils'
import { MatchType, Player, PlayerStats } from '@/types'
import { revalidatePath } from 'next/cache'

export async function createMatch(match: MatchType) {
  try {
    await isLoggedIn()
    await connectToDatabase()

    await Match.create(match)
    revalidatePath('/')
  } catch (error) {
    console.error(error)
  }
}

export async function updateMatch(id: string, match: MatchType) {
  try {
    await isLoggedIn()
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
    await isLoggedIn()
    await connectToDatabase()

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

export async function getAllTimeStats() {
  try {
    await connectToDatabase()

    const [matches, lineups] = await Promise.all([
      Match.find({}),
      Lineup.find({}),
    ])

    const activeLineups = new Set(lineups.map((lineup) => lineup.name))

    const playerStatsMap = new Map<string, PlayerStats>()

    matches.forEach((match) => {
      if (!match.total || !Array.isArray(match.total)) {
        return
      }

      match.total.forEach(
        (player: { playerName: string; totalScore: string }) => {
          if (!player.playerName || player.totalScore === undefined) {
            return
          }

          if (player.playerName.includes('Junior')) {
            return
          }

          const score = parseFloat(player.totalScore)
          const isActive = activeLineups.has(player.playerName)

          if (!playerStatsMap.has(player.playerName)) {
            playerStatsMap.set(player.playerName, {
              playerName: player.playerName,
              totalScore: '0',
              numberOfMatches: 0,
              isActive: isActive,
            })
          }

          const playerStats = playerStatsMap.get(player.playerName)!
          playerStats.totalScore = (
            parseFloat(playerStats.totalScore) + score
          ).toFixed(2)
          playerStats.numberOfMatches += 1
        }
      )
    })

    const allTimeStats = Array.from(playerStatsMap.values()).filter(
      (playerStats) => !playerStats.playerName.includes('Junior')
    )

    const finalStats = allTimeStats.map((playerStats) => ({
      ...playerStats,
      averageScore: playerStats.numberOfMatches
        ? (
            parseFloat(playerStats.totalScore) / playerStats.numberOfMatches
          ).toFixed(2)
        : '0',
    }))

    revalidatePath('/')
    return JSON.stringify(finalStats)
  } catch (error) {
    console.error('Error fetching all time stats:', error)
  }
}
