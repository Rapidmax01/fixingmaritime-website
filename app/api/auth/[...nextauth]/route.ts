import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Handle NextAuth initialization more safely
const handler = NextAuth({
  ...authOptions,
  // Add fallback secret if not provided
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
})

export { handler as GET, handler as POST }