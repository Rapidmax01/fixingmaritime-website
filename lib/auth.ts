import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'

// Temporarily disable database imports for initial deployment
// import bcrypt from 'bcryptjs'
// import { PrismaClient } from '@prisma/client'
// import { PrismaAdapter } from '@next-auth/prisma-adapter'

// const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export const authOptions: NextAuthOptions = {
  // Temporarily disable database adapter for initial deployment
  // ...(prisma && { adapter: PrismaAdapter(prisma) }),
  providers: [
    // Only add OAuth providers if credentials are available
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [
      GithubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      })
    ] : []),
    // Temporarily disable credentials provider (requires database)
    // CredentialsProvider({
    //   name: 'credentials',
    //   credentials: {
    //     email: { label: 'Email', type: 'email' },
    //     password: { label: 'Password', type: 'password' }
    //   },
    //   async authorize(credentials) {
    //     // Disabled for initial deployment
    //     return null
    //   }
    // })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user && token?.id) {
        (session.user as any).id = token.id as string
      }
      return session
    },
  },
}