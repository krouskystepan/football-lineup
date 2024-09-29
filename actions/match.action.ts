'use server'

import Lineup from '@/database/lineup.model'
import Match from '@/database/match.model'
import { connectToDatabase } from '@/lib/db'
import { isLoggedIn } from '@/lib/utils'
import { MatchType, PlayerStats } from '@/types'
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

export async function getMatchStats() {
  try {
    await connectToDatabase()

    const matches: MatchType[] = await Match.find({})

    const matchStats = matches
      .map((match) => {
        if (!match.total || !Array.isArray(match.total)) {
          return
        }

        const totalScore = match.total.reduce((acc: number, playerStats) => {
          const score =
            typeof playerStats.totalScore === 'number'
              ? playerStats.totalScore
              : 0
          return acc + score
        }, 0)

        return {
          matchName: match.matchName,
          totalScore: totalScore.toFixed(0),
          createdAt: match.createdAt,
        }
      })
      .filter(
        (
          stat
        ): stat is { matchName: string; totalScore: string; createdAt: Date } =>
          stat !== undefined
      )

    revalidatePath('/')
    return JSON.stringify(matchStats)
  } catch (error) {
    console.error('Error fetching match stats:', error)
  }
}

export async function getAllTimeStats() {
  try {
    await connectToDatabase()

    const [matches, lineups] = await Promise.all([
      Match.find({}),
      Lineup.find({}),
    ])

    const activeLineups = new Set(lineups.map((lineup) => lineup.name.trim())) // Trim lineup names

    const activeLineupMap = new Map<string, number>(
      lineups.map((lineup) => [lineup.name.trim(), lineup.level]) // Trim lineup names
    )

    const playerStatsMap = new Map<string, PlayerStats>()

    matches.forEach((match) => {
      if (!match.total || !Array.isArray(match.total)) {
        return
      }

      let motmPlayer: string | null = null
      let highestScore = -Infinity

      match.total.forEach(
        (player: { playerName: string; totalScore: string }) => {
          if (!player.playerName || player.totalScore === undefined) {
            return
          }

          const playerName = player.playerName.trim() // Trim player names

          if (playerName.includes('Junior')) {
            return
          }

          const score = parseFloat(player.totalScore)
          if (score > highestScore) {
            highestScore = score
            motmPlayer = playerName
          }

          const isActive = activeLineups.has(playerName)
          const level = activeLineupMap.get(playerName) || 0

          if (!playerStatsMap.has(playerName)) {
            playerStatsMap.set(playerName, {
              playerName: playerName,
              level: level,
              totalScore: '0',
              numberOfMatches: 0,
              isActive: isActive,
              motmCount: 0, // Initialize MOTM count
            })
          }

          const playerStats = playerStatsMap.get(playerName)!
          playerStats.totalScore = (
            parseFloat(playerStats.totalScore) + score
          ).toFixed(2)
          playerStats.numberOfMatches += 1
        }
      )

      // Increment MOTM count for the player with the highest score
      if (motmPlayer && playerStatsMap.has(motmPlayer)) {
        const playerStats = playerStatsMap.get(motmPlayer)!
        playerStats.motmCount! += 1
      }
    })

    const allTimeStats = Array.from(playerStatsMap.values()).filter(
      (playerStats) => !playerStats.playerName.includes('Junior')
    )

    const finalStats = allTimeStats.map((playerStats) => {
      const averageScore = playerStats.numberOfMatches
        ? parseFloat(playerStats.totalScore) / playerStats.numberOfMatches
        : 0

      const scorePerLevel =
        playerStats.level > 0 ? averageScore / playerStats.level : 0

      return {
        ...playerStats,
        averageScore: averageScore.toFixed(2),
        scorePerLevel: scorePerLevel.toFixed(2),
      }
    })

    revalidatePath('/')
    return JSON.stringify(finalStats)
  } catch (error) {
    console.error('Error fetching all time stats:', error)
  }
}
