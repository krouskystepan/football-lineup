import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getAdmin } from '@/actions/admin.action'

const options = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) return null

        const admin = await getAdmin({ username: credentials.username })

        if (!admin) return null

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          admin.password
        )

        if (!isPasswordValid) return null

        return { id: admin.id.toString(), name: admin.username }
      },
    }),
  ],
}

const handler = NextAuth(options)

export { handler as GET, handler as POST }
