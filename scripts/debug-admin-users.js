#!/usr/bin/env node

// Debug existing admin users in Google Cloud SQL
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: "postgresql://maritime_user:DOAZgMJpJcJ%2Fbj18oKSTTYeviaZZ6VLsPe%2FeCH33z0M%3D@35.192.22.45:5432/maritime?sslmode=require"
})

async function debugAdminUsers() {
  console.log('🔍 Checking existing admin users in Google Cloud SQL...')
  
  try {
    // Check all users with admin roles
    const result = await pool.query(`
      SELECT 
        id,
        email, 
        name, 
        role, 
        "emailVerified",
        password IS NOT NULL as has_password,
        "createdAt"
      FROM app_users 
      WHERE role IN ('admin', 'super_admin')
      ORDER BY "createdAt" DESC
    `)
    
    console.log(`\n📊 Found ${result.rows.length} admin user(s):`)
    console.log('═'.repeat(80))
    
    if (result.rows.length === 0) {
      console.log('❌ No admin users found in database!')
      console.log('💡 This explains why your credentials don\'t work.')
      console.log('')
      console.log('🔧 Solutions:')
      console.log('   1. Use demo account: admin@fixingmaritime.com / admin123')
      console.log('   2. Create your admin account in the database')
      console.log('   3. Check if migration missed your admin user')
    } else {
      result.rows.forEach((user, index) => {
        console.log(`\n👤 Admin User ${index + 1}:`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Name: ${user.name || 'Not set'}`)
        console.log(`   Role: ${user.role}`)
        console.log(`   Email Verified: ${user.emailVerified ? '✅' : '❌'}`)
        console.log(`   Has Password: ${user.has_password ? '✅' : '❌'}`)
        console.log(`   Created: ${user.createdAt}`)
      })
      
      console.log('\n💡 If your email isn\'t listed above, your account wasn\'t migrated.')
    }
    
    // Also check all users (in case role is wrong)
    const allUsers = await pool.query(`
      SELECT email, role, "emailVerified" 
      FROM app_users 
      ORDER BY "createdAt" DESC 
      LIMIT 10
    `)
    
    console.log(`\n📋 All users in database (showing last 10):`)
    console.log('─'.repeat(60))
    allUsers.rows.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.role}) ${user.emailVerified ? '✅' : '❌'}`)
    })
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message)
    console.log('\n💡 This means Vercel can connect but your local machine cannot.')
    console.log('   The demo account working proves the system works!')
  } finally {
    await pool.end()
  }
}

debugAdminUsers()