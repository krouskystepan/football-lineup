'use server'

import Lineup from '@/database/lineup.model'
import Match from '@/database/match.model'
import { connectToDatabase } from '@/lib/db'
import { getScoreClass, isLoggedIn } from '@/lib/utils'
import { MatchType, PlayerStats, SeasonType } from '@/types'
import { revalidatePath } from 'next/cache'
import { getSeasons } from './season.action'

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

export async function getAllTimeStats(seasonId?: string) {
  try {
    await connectToDatabase()

    const seasons = await getSeasons()
    const parsedSeasons =
      typeof seasons === 'string' ? JSON.parse(seasons) : seasons

    if (!Array.isArray(parsedSeasons) || parsedSeasons.length === 0) {
      throw new Error('No seasons found')
    }

    let selectedSeason: SeasonType | null = null

    if (seasonId) {
      selectedSeason = parsedSeasons.find(
        (season: SeasonType) => season._id === seasonId
      )
      if (!selectedSeason) {
        throw new Error(`Season with ID ${seasonId} not found`)
      }
    }

    let matches

    if (selectedSeason) {
      matches = await Match.find({
        createdAt: {
          $gte: new Date(selectedSeason.date.from),
          $lte: new Date(selectedSeason.date.to),
        },
      })
    } else {
      matches = await Match.find({})
    }

    const lineups = await Lineup.find({})
    const activeLineups = new Set(lineups.map((lineup) => lineup.name))
    const activeLineupMap = new Map<string, number>(
      lineups.map((lineup) => [lineup.name, lineup.level])
    )

    const playerStatsMap = new Map<string, PlayerStats>()

    matches.forEach((match) => {
      if (!match.total || !Array.isArray(match.total)) return

      let motmPlayer: string | null = null
      let highestScore = -Infinity

      match.total.forEach((player: PlayerStats) => {
        if (!player.playerName || player.totalScore === undefined) return

        if (player.playerName.includes('Junior')) return

        const score = parseFloat(player.totalScore)
        if (score > highestScore) {
          highestScore = score
          motmPlayer = player.playerName
        }

        const isActive = activeLineups.has(player.playerName)
        const level = activeLineupMap.get(player.playerName) || 0

        if (!playerStatsMap.has(player.playerName)) {
          playerStatsMap.set(player.playerName, {
            playerName: player.playerName,
            level: level,
            totalScore: '0',
            numberOfMatches: 0,
            isActive: isActive,
            motmCount: 0,
          })
        }

        const playerStats = playerStatsMap.get(player.playerName)!
        playerStats.totalScore = (
          parseFloat(playerStats.totalScore) + score
        ).toFixed(2)
        playerStats.numberOfMatches += 1
      })

      if (motmPlayer && playerStatsMap.has(motmPlayer)) {
        const playerStats = playerStatsMap.get(motmPlayer)!
        playerStats.motmCount! += 1
      }
    })

    const allTimeStats = Array.from(playerStatsMap.values()).filter(
      (playerStats) => !playerStats.playerName.includes('Junior')
    )

    const averageBadScore = selectedSeason?.badScore || 0
    const averageMediumScore = selectedSeason?.mediumScore || 0
    const averageGoodScore = selectedSeason?.goodScore || Infinity

    const finalStats = allTimeStats.map((playerStats) => {
      const averageScore = playerStats.numberOfMatches
        ? parseFloat(playerStats.totalScore) / playerStats.numberOfMatches
        : 0

      const scorePerLevel =
        playerStats.level > 0 ? averageScore / playerStats.level : 0

      const scoreClass = getScoreClass(
        averageScore,
        averageBadScore,
        averageMediumScore,
        averageGoodScore
      )

      return {
        ...playerStats,
        averageScore: averageScore.toFixed(2),
        scorePerLevel: scorePerLevel.toFixed(2),
        averageScoreClass: scoreClass,
      }
    })

    revalidatePath('/')
    return JSON.stringify(finalStats)
  } catch (error) {
    console.error('Error fetching all time stats:', error)
  }
}
