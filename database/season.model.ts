import { Schema, model, models, Document } from 'mongoose'

export interface ISeason extends Document {
  seasonName: string
  date: {
    from: Date
    to: Date
  }
  badScore: number
  mediumScore: number
  goodScore: number
}

const SeasonSchema = new Schema({
  seasonName: {
    type: String,
    required: true,
  },
  date: {
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
  },
  badScore: {
    type: Number,
    required: true,
  },
  mediumScore: {
    type: Number,
    required: true,
  },
  goodScore: {
    type: Number,
    required: true,
  },
})

const Season = models.Season || model<ISeason>('Season', SeasonSchema)

export default Season
