import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    errorFormat: 'pretty',
  })
}

// Connection retry logic for production
const connectWithRetry = async (client: PrismaClient): Promise<PrismaClient> => {
  const maxRetries = 5
  let retries = 0
  
  while (retries < maxRetries) {
    try {
      await client.$connect()
      console.log('✅ Database connected successfully')
      return client
    } catch (error) {
      retries++
      console.error(`❌ Database connection attempt ${retries} failed:`, error)
      
      if (retries === maxRetries) {
        console.error('❌ Max retries reached. Database connection failed.')
        throw error
      }
      
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      const delay = Math.pow(2, retries) * 1000
      console.log(`⏳ Retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  return client
}

// Database health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    if (!global.prisma) {
      return false
    }
    
    // Simple query to check connection
    await global.prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

// Initialize Prisma client with connection management
const initializePrisma = async (): Promise<PrismaClient | null> => {
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL not found. Database operations will be unavailable.')
    return null
  }

  try {
    if (!global.prisma) {
      console.log('🔄 Initializing new Prisma client...')
      const client = createPrismaClient()
      
      // Only attempt connection in production or when explicitly needed
      if (process.env.NODE_ENV === 'production') {
        global.prisma = await connectWithRetry(client)
      } else {
        global.prisma = client
        // Test connection without retries in development
        try {
          await client.$connect()
          console.log('✅ Database connected (development)')
        } catch (error) {
          console.warn('⚠️ Database connection failed in development. Operations will fail until connection is restored.')
          console.warn('Error:', error)
        }
      }
    }
    
    return global.prisma
  } catch (error) {
    console.error('❌ Failed to initialize Prisma client:', error)
    return null
  }
}

// Get or create the shared Prisma client
const getSharedPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL not found. Database operations will be unavailable.')
    return null
  }

  if (!global.prisma) {
    console.log('🔄 Creating shared Prisma client...')
    global.prisma = createPrismaClient()
  }

  return global.prisma
}

// Export the shared client
const prisma = getSharedPrismaClient()

// Graceful shutdown
if (process.env.NODE_ENV !== 'test') {
  process.on('beforeExit', async () => {
    if (global.prisma) {
      await global.prisma.$disconnect()
      console.log('🔌 Database connection closed.')
    }
  })
}

// Export utilities
export { PrismaClient }
export default prisma