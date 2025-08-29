import prisma from './database'

export async function wakeDatabase(): Promise<boolean> {
  console.log('🔄 Attempting to wake database...')
  
  if (!prisma) {
    console.error('❌ Prisma client not available')
    return false
  }

  const maxAttempts = 10
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      attempts++
      console.log(`Attempt ${attempts}/${maxAttempts}...`)
      
      // Simple query to wake the database
      await prisma.$queryRaw`SELECT 1 as wake_check`
      
      console.log('✅ Database is now awake!')
      return true
    } catch (error) {
      console.log(`⏳ Attempt ${attempts} failed, retrying...`)
      
      if (attempts === maxAttempts) {
        console.error('❌ Failed to wake database after maximum attempts')
        console.error('Error:', error)
        return false
      }
      
      // Progressive delay: 2s, 4s, 6s, 8s, 10s...
      const delay = 2000 + (attempts * 2000)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  return false
}

export async function ensureDatabaseConnection(): Promise<boolean> {
  try {
    if (!prisma) {
      console.error('❌ Database client not available')
      return false
    }

    // First, try a simple health check
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection verified')
    return true
  } catch (error) {
    console.log('⚠️ Database appears to be sleeping, attempting to wake...')
    return await wakeDatabase()
  }
}