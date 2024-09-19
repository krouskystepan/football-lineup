'use server'

import Admin from '@/database/admin.model'
import { connectToDatabase } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { isLoggedIn } from '@/lib/utils'
import bcrypt from 'bcrypt'

export async function getAdmin({ username }: { username: string }) {
  try {
    await connectToDatabase()

    const admin = await Admin.findOne({ username })

    revalidatePath('/')
    return admin
  } catch (error) {
    console.error(error)
  }
}

// export async function createAdmin({
//   username,
//   password,
// }: {
//   username: string
//   password: string
// }) {
//   try {
//     await isLoggedIn()
//     await connectToDatabase()

//     const hashedPassword = await bcrypt.hash(password, 10)

//     await Admin.create({ username, password: hashedPassword })

//     revalidatePath('/')
//   } catch (error) {
//     console.error('Error creating admin:', error)
//   }
// }
