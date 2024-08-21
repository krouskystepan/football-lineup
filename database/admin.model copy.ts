import { Schema, model, models, Document } from 'mongoose'

export interface IAdmin extends Document {
  username: string
  password: string
}

const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

const Admin = models.Admin || model<IAdmin>('Admin', AdminSchema)

export default Admin
