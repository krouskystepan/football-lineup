'use server'

import Admin from '@/database/admin.model copy'
import { connectToDatabase } from '@/lib/db'
import { isLoggedIn } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
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

export async function createAdmin({
  username,
  password,
}: {
  username: string
  password: string
}) {
  try {
    // await isLoggedIn()
    await connectToDatabase()

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = new Admin({ username, password: hashedPassword })

    await admin.save()

    revalidatePath('/')
  } catch (error) {
    console.error('Error creating admin:', error)
  }
}
