import { Player } from '@/types'
import { Schema, model, models, Document } from 'mongoose'

export interface IMatch extends Document {
  matchName: string
  lines: Array<{
    line: number
    players: Player[]
  }>
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
          id: {
            type: Number,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          score: {
            type: Number,
            required: true,
          },
          defaultLine: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
})

const Match = models.Match || model('Match', MatchSchema)

export default Match
