// Script to make a user an admin
// Usage: node scripts/make-admin.js email@example.com

const { PrismaClient } = require('@prisma/client')

async function makeAdmin(email) {
  if (!email) {
    console.error('❌ Please provide an email address')
    console.log('Usage: node scripts/make-admin.js email@example.com')
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

    // Update role to admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'admin' }
    })

    console.log(`✅ Successfully updated user to admin:`)
    console.log(`   Email: ${updatedUser.email}`)
    console.log(`   Name: ${updatedUser.name}`)
    console.log(`   Role: ${updatedUser.role}`)
    console.log(`\n🔐 User can now login at: /admin/login`)

  } catch (error) {
    console.error('❌ Error updating user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Get email from command line argument
const email = process.argv[2]
makeAdmin(email)