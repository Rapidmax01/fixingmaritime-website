// Script to make a user an admin or super admin
// Usage: node scripts/make-admin.js email@example.com [admin|super_admin]

const { PrismaClient } = require('@prisma/client')

async function makeAdmin(email, role = 'admin') {
  if (!email) {
    console.error('❌ Please provide an email address')
    console.log('Usage: node scripts/make-admin.js email@example.com [admin|super_admin]')
    process.exit(1)
  }

  const validRoles = ['admin', 'super_admin']
  if (!validRoles.includes(role)) {
    console.error(`❌ Invalid role: ${role}`)
    console.log('Valid roles: admin, super_admin')
    process.exit(1)
  }

  const prisma = new PrismaClient()

  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.error(`❌ User with email ${email} not found`)
      process.exit(1)
    }

    // Update role
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role }
    })

    console.log(`✅ Successfully updated user to ${role}:`)
    console.log(`   Email: ${updatedUser.email}`)
    console.log(`   Name: ${updatedUser.name}`)
    console.log(`   Role: ${updatedUser.role}`)
    console.log(`\n🔐 User can now login at: /admin/login`)
    
    if (role === 'super_admin') {
      console.log(`\n👑 Super Admin capabilities:`)
      console.log(`   - Create and remove other admins`)
      console.log(`   - Access all admin features`)
      console.log(`   - Protected from role changes`)
    }

  } catch (error) {
    console.error('❌ Error updating user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Get arguments from command line
const email = process.argv[2]
const role = process.argv[3] || 'admin'
makeAdmin(email, role)