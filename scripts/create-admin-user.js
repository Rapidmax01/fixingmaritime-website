#!/usr/bin/env node

// Create a real admin user in Google Cloud SQL
const bcrypt = require('bcryptjs')
const { Pool } = require('pg')

// Database connection
const pool = new Pool({
  connectionString: "postgresql://maritime_user:DOAZgMJpJcJ%2Fbj18oKSTTYeviaZZ6VLsPe%2FeCH33z0M%3D@35.192.22.45:5432/maritime?sslmode=require"
})

async function createAdminUser() {
  console.log('🔐 Creating admin user in Google Cloud SQL...')
  
  try {
    // Admin user details
    const adminUser = {
      email: 'admin@fixingmaritime.com',
      name: 'System Administrator', 
      password: 'admin123', // You can change this
      company: 'Fixing Maritime',
      role: 'super_admin',
      emailVerified: true,
      phone: '+1 (555) 123-4567',
      city: 'New York',
      country: 'United States'
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminUser.password, 12)
    console.log('🔒 Password hashed successfully')
    
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM app_users WHERE email = $1',
      [adminUser.email]
    )
    
    if (existingUser.rows.length > 0) {
      console.log('ℹ️  Admin user already exists, updating...')
      
      // Update existing user
      await pool.query(`
        UPDATE app_users SET 
          name = $2,
          password = $3,
          company = $4,
          role = $5,
          "emailVerified" = $6,
          phone = $7,
          city = $8,
          country = $9,
          "updatedAt" = NOW()
        WHERE email = $1
      `, [
        adminUser.email,
        adminUser.name,
        hashedPassword,
        adminUser.company,
        adminUser.role,
        adminUser.emailVerified,
        adminUser.phone,
        adminUser.city,
        adminUser.country
      ])
      
      console.log('✅ Admin user updated successfully!')
    } else {
      console.log('➕ Creating new admin user...')
      
      // Create new user
      await pool.query(`
        INSERT INTO app_users (
          email, name, password, company, role, 
          "emailVerified", phone, city, country,
          "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()
        )
      `, [
        adminUser.email,
        adminUser.name,
        hashedPassword,
        adminUser.company,
        adminUser.role,
        adminUser.emailVerified,
        adminUser.phone,
        adminUser.city,
        adminUser.country
      ])
      
      console.log('✅ Admin user created successfully!')
    }
    
    console.log('')
    console.log('🎉 Admin User Ready!')
    console.log('📧 Email:', adminUser.email)
    console.log('🔑 Password:', adminUser.password)
    console.log('👑 Role:', adminUser.role)
    console.log('')
    console.log('🌐 Login at: https://www.fixingmaritime.com/admin/login')
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

createAdminUser()