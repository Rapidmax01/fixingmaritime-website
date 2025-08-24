#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const { execSync } = require('child_process')

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres.myrmiimwgdwjldqvyfou:SHD66auLsg!P%26Pv@aws-1-us-east-2.pooler.supabase.com:5432/postgres?pgbouncer=true"

console.log('🚀 Setting up database...')

async function wakeDatabase() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
  })

  console.log('⏳ Attempting to wake database...')
  
  const maxAttempts = 10
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      attempts++
      console.log(`   Attempt ${attempts}/${maxAttempts}...`)
      
      await prisma.$queryRaw`SELECT 1 as wake_check`
      
      console.log('✅ Database is awake!')
      await prisma.$disconnect()
      return true
    } catch (error) {
      console.log(`   ❌ Attempt ${attempts} failed`)
      
      if (attempts === maxAttempts) {
        console.error('❌ Failed to wake database after maximum attempts')
        console.error('Error details:', error.message)
        await prisma.$disconnect()
        return false
      }
      
      const delay = 3000 + (attempts * 2000) // 3s, 5s, 7s, 9s...
      console.log(`   ⏳ Waiting ${delay/1000}s before retry...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  await prisma.$disconnect()
  return false
}

async function runMigration() {
  console.log('🔄 Running database migration...')
  
  try {
    // Use db push for immediate schema sync without creating migration files
    console.log('   Using Prisma db push for immediate sync...')
    execSync(`DATABASE_URL="${DATABASE_URL}" npx prisma db push`, {
      stdio: 'inherit',
      cwd: process.cwd()
    })
    console.log('✅ Database schema updated successfully!')
    return true
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    
    // Try generating and applying migration instead
    try {
      console.log('   Falling back to migration generation...')
      execSync(`DATABASE_URL="${DATABASE_URL}" npx prisma migrate dev --name add-enhanced-profile-fields`, {
        stdio: 'inherit',
        cwd: process.cwd()
      })
      console.log('✅ Migration completed successfully!')
      return true
    } catch (migrationError) {
      console.error('❌ Migration also failed:', migrationError.message)
      return false
    }
  }
}

async function main() {
  console.log('Database URL:', DATABASE_URL.replace(/:[^@]*@/, ':***@'))
  
  // Step 1: Wake database
  const isAwake = await wakeDatabase()
  if (!isAwake) {
    console.error('❌ Cannot proceed with migration - database is unreachable')
    process.exit(1)
  }
  
  // Step 2: Run migration
  const migrationSuccess = await runMigration()
  if (!migrationSuccess) {
    console.error('❌ Migration failed')
    process.exit(1)
  }
  
  console.log('🎉 Database setup completed successfully!')
  console.log('')
  console.log('✅ Database is awake and ready')
  console.log('✅ Enhanced profile fields have been added')
  console.log('✅ Application can now use multiple phone numbers and addresses')
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Database setup interrupted')
  process.exit(0)
})

main().catch(console.error)