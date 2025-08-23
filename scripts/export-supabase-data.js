#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const SUPABASE_URL = process.env.DATABASE_URL || "postgresql://postgres.myrmiimwgdwjldqvyfou:SHD66auLsg!P%26Pv@aws-1-us-east-2.pooler.supabase.com:5432/postgres?pgbouncer=true"

console.log('📦 Exporting Supabase Data...')

async function exportData() {
  const prisma = new PrismaClient({
    datasources: { db: { url: SUPABASE_URL } }
  })

  try {
    console.log('🔄 Connecting to Supabase...')
    await prisma.$connect()
    
    const exportData = {
      timestamp: new Date().toISOString(),
      source: 'supabase',
      tables: {}
    }

    // Export users
    try {
      console.log('👥 Exporting users...')
      const users = await prisma.user.findMany()
      exportData.tables.users = users
      console.log(`   ✅ Exported ${users.length} users`)
    } catch (error) {
      console.log(`   ⚠️  Users export failed: ${error.message}`)
      exportData.tables.users = []
    }

    // Export services
    try {
      console.log('🛠️  Exporting services...')
      const services = await prisma.service.findMany()
      exportData.tables.services = services
      console.log(`   ✅ Exported ${services.length} services`)
    } catch (error) {
      console.log(`   ⚠️  Services export failed: ${error.message}`)
      exportData.tables.services = []
    }

    // Export orders
    try {
      console.log('📦 Exporting orders...')
      const orders = await prisma.order.findMany({
        include: {
          orderItems: true,
          tracking: true
        }
      })
      exportData.tables.orders = orders
      console.log(`   ✅ Exported ${orders.length} orders`)
    } catch (error) {
      console.log(`   ⚠️  Orders export failed: ${error.message}`)
      exportData.tables.orders = []
    }

    // Export content sections
    try {
      console.log('📄 Exporting content sections...')
      const contentSections = await prisma.contentSection.findMany()
      exportData.tables.contentSections = contentSections
      console.log(`   ✅ Exported ${contentSections.length} content sections`)
    } catch (error) {
      console.log(`   ⚠️  Content sections export failed: ${error.message}`)
      exportData.tables.contentSections = []
    }

    // Export SEO settings
    try {
      console.log('🔍 Exporting SEO settings...')
      const seoSettings = await prisma.seoSettings.findMany()
      exportData.tables.seoSettings = seoSettings
      console.log(`   ✅ Exported ${seoSettings.length} SEO settings`)
    } catch (error) {
      console.log(`   ⚠️  SEO settings export failed: ${error.message}`)
      exportData.tables.seoSettings = []
    }

    // Export media files
    try {
      console.log('🖼️  Exporting media files...')
      const mediaFiles = await prisma.mediaFile.findMany()
      exportData.tables.mediaFiles = mediaFiles
      console.log(`   ✅ Exported ${mediaFiles.length} media files`)
    } catch (error) {
      console.log(`   ⚠️  Media files export failed: ${error.message}`)
      exportData.tables.mediaFiles = []
    }

    // Convert BigInt to string for JSON serialization
    const jsonData = JSON.stringify(exportData, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString()
      }
      return value
    }, 2)
    
    // Save export data
    const exportPath = path.join(process.cwd(), 'supabase-export.json')
    fs.writeFileSync(exportPath, jsonData)
    
    console.log('')
    console.log('✅ Export completed successfully!')
    console.log(`📁 Data saved to: ${exportPath}`)
    console.log('')
    console.log('📊 Export Summary:')
    console.log(`   Users: ${exportData.tables.users.length}`)
    console.log(`   Services: ${exportData.tables.services.length}`)
    console.log(`   Orders: ${exportData.tables.orders.length}`)
    console.log(`   Content Sections: ${exportData.tables.contentSections.length}`)
    console.log(`   SEO Settings: ${exportData.tables.seoSettings.length}`)
    console.log(`   Media Files: ${exportData.tables.mediaFiles.length}`)

    await prisma.$disconnect()

  } catch (error) {
    console.error('❌ Export failed:', error.message)
    
    if (error.message.includes("Can't reach database")) {
      console.log('')
      console.log('💡 The Supabase database appears to be sleeping.')
      console.log('   Please wake it up by:')
      console.log('   1. Login to https://supabase.com/dashboard')
      console.log('   2. Go to SQL Editor')
      console.log('   3. Run: SELECT 1;')
      console.log('   4. Then retry this export')
    }
    
    await prisma.$disconnect()
    process.exit(1)
  }
}

exportData()