import { Player } from '@/types' // Ensure Player type is imported correctly
import { Schema, model, models, Document } from 'mongoose'

export interface IMatch extends Document {
  matchName: string
  lines: Array<{
    line: number
    players: Player[]
  }>
  total: Array<{
    playerName: string
    totalScore: number
  }>
  createdAt: Date
}

const MatchSchema = new Schema({
  matchName: {
    type: String,
    required: true,
  },
  lines: [
    {
      line: {
        type: Number,
        required: true,
      },
      players: [
        {
          _id: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          score: {
            type: Number,
            required: false,
          },
          defaultLine: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
  total: [
    {
      playerName: {
        type: String,
        required: true,
      },
      totalScore: {
        type: Number,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Match = models.Match || model<IMatch>('Match', MatchSchema)

export default Match
