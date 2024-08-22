'use server'

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

    const matches = await Match.find({})

    // This will store the player stats including total score, number of matches, and average score
    const allTimeStats = matches.reduce((acc: PlayerStats[], match) => {
      if (!match.total || !Array.isArray(match.total)) {
        return acc
      }

      match.total.forEach(
        (player: { playerName: string; totalScore: string }) => {
          if (!player.playerName || player.totalScore === undefined) {
            return
          }

          const score = parseFloat(player.totalScore) // Convert to number

          // Find the player stats in the accumulator
          const playerStats = acc.find(
            (p) => p.playerName === player.playerName
          )

          if (playerStats) {
            // Update total score and increment number of matches
            playerStats.totalScore = (
              parseFloat(playerStats.totalScore) + score
            ).toFixed(2) // Convert to string with 2 decimal places
            playerStats.numberOfMatches += 1
          } else {
            acc.push({
              playerName: player.playerName,
              totalScore: score.toFixed(2), // Initialize totalScore as string
              numberOfMatches: 1, // Initialize number of matches
            })
          }
        }
      )

      return acc
    }, [])

    // Aggregate the stats to ensure we have the final totals
    const aggregatedStats = allTimeStats.reduce(
      (acc: PlayerStats[], playerStats) => {
        const existingPlayer = acc.find(
          (p) => p.playerName === playerStats.playerName
        )

        if (existingPlayer) {
          // Aggregate total score and number of matches
          existingPlayer.totalScore = (
            parseFloat(existingPlayer.totalScore) +
            parseFloat(playerStats.totalScore)
          ).toFixed(2) // Convert to string with 2 decimal places
          existingPlayer.numberOfMatches += playerStats.numberOfMatches
        } else {
          acc.push(playerStats)
        }

        return acc
      },
      []
    )

    // Calculate average score per match for each player
    const finalStats = aggregatedStats.map((playerStats) => ({
      ...playerStats,
      averageScore: playerStats.numberOfMatches
        ? (
            parseFloat(playerStats.totalScore) / playerStats.numberOfMatches
          ).toFixed(2) // Calculate average and convert to string
        : '0',
    }))

    revalidatePath('/')
    return JSON.stringify(finalStats)
  } catch (error) {
    console.error('Error fetching all time stats:', error)
  }
}
