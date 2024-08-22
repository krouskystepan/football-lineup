import { Schema, model, models, Document } from 'mongoose'

export interface ILineup extends Document {
  name: string
  defaultLine: number
  level: number
}

const LineupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  defaultLine: {
    type: Number,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
})

const Lineup = models.Lineup || model<ILineup>('Lineup', LineupSchema)

export default Lineup
