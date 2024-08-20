import mongoose from 'mongoose'

let isConnected: boolean = false

export async function connectToDatabase() {
  mongoose.set('strictQuery', true)

  if (!process.env.MONGODB_URL) return console.log('MISSING MONGODB_URL')
  if (isConnected) return console.log('MongoDB is already connected')

  try {
    await mongoose.connect(process.env.MONGODB_URL, { socketTimeoutMS: 30000 })

    isConnected = true
    console.log('MongoDB is connected')
  } catch (error) {
    console.log('MongoDB connection failed:', error)
  }
}
