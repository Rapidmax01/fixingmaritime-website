#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

// Get Google Cloud SQL connection string from command line or environment
const GCLOUD_SQL_URL = process.argv[2] || process.env.GCLOUD_DATABASE_URL

if (!GCLOUD_SQL_URL) {
  console.error('❌ Please provide Google Cloud SQL connection string:')
  console.error('   node scripts/import-to-gcloud-sql.js "postgresql://user:pass@ip:5432/db"')
  console.error('   OR set GCLOUD_DATABASE_URL environment variable')
  process.exit(1)
}

console.log('📥 Importing data to Google Cloud SQL...')

async function importData() {
  // Read export file
  const exportPath = path.join(process.cwd(), 'supabase-export.json')
  
  if (!fs.existsSync(exportPath)) {
    console.error('❌ Export file not found: supabase-export.json')
    console.error('   Please run the export script first: node scripts/export-supabase-data.js')
    process.exit(1)
  }

  const exportData = JSON.parse(fs.readFileSync(exportPath, 'utf8'))
  console.log(`📊 Found export from ${exportData.timestamp}`)

  // Connect to Google Cloud SQL
  const prisma = new PrismaClient({
    datasources: { db: { url: GCLOUD_SQL_URL } }
  })

  try {
    console.log('🔄 Connecting to Google Cloud SQL...')
    await prisma.$connect()
    console.log('✅ Connected successfully!')

    // First, run schema setup
    console.log('🏗️  Setting up database schema...')
    try {
      // Create database schema using our fixed SQL
      const schemaSQL = fs.readFileSync(
        path.join(process.cwd(), 'SUPABASE_FIXED_FINAL.sql'), 
        'utf8'
      )
      
      // Execute schema creation
      const statements = schemaSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await prisma.$executeRawUnsafe(statement)
          } catch (error) {
            // Ignore expected errors like "already exists"
            if (!error.message.includes('already exists') && 
                !error.message.includes('duplicate')) {
              console.warn(`⚠️  SQL Warning: ${error.message.split('\n')[0]}`)
            }
          }
        }
      }
      console.log('✅ Schema setup completed')
    } catch (schemaError) {
      console.warn('⚠️  Schema setup had issues, continuing with import...')
    }

    // Import users
    console.log('👥 Importing users...')
    let importedUsers = 0
    for (const user of exportData.tables.users) {
      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: user,
          create: user
        })
        importedUsers++
      } catch (error) {
        console.warn(`   ⚠️  Failed to import user ${user.email}: ${error.message}`)
      }
    }
    console.log(`   ✅ Imported ${importedUsers}/${exportData.tables.users.length} users`)

    // Import services
    console.log('🛠️  Importing services...')
    let importedServices = 0
    for (const service of exportData.tables.services) {
      try {
        await prisma.service.upsert({
          where: { slug: service.slug },
          update: service,
          create: service
        })
        importedServices++
      } catch (error) {
        console.warn(`   ⚠️  Failed to import service ${service.slug}: ${error.message}`)
      }
    }
    console.log(`   ✅ Imported ${importedServices}/${exportData.tables.services.length} services`)

    // Import content sections
    console.log('📄 Importing content sections...')
    let importedContent = 0
    for (const content of exportData.tables.contentSections) {
      try {
        await prisma.contentSection.upsert({
          where: { type: content.type },
          update: content,
          create: content
        })
        importedContent++
      } catch (error) {
        console.warn(`   ⚠️  Failed to import content ${content.type}: ${error.message}`)
      }
    }
    console.log(`   ✅ Imported ${importedContent}/${exportData.tables.contentSections.length} content sections`)

    // Import orders (more complex due to relations)
    console.log('📦 Importing orders...')
    let importedOrders = 0
    for (const order of exportData.tables.orders) {
      try {
        // Import order without relations first
        const { orderItems, tracking, ...orderData } = order
        
        await prisma.order.upsert({
          where: { orderNumber: order.orderNumber },
          update: orderData,
          create: orderData
        })

        // Import order items
        for (const item of orderItems || []) {
          try {
            await prisma.orderItem.upsert({
              where: { id: item.id },
              update: item,
              create: item
            })
          } catch (itemError) {
            console.warn(`     ⚠️  Failed to import order item: ${itemError.message}`)
          }
        }

        // Import tracking
        for (const track of tracking || []) {
          try {
            await prisma.orderTracking.upsert({
              where: { id: track.id },
              update: track,
              create: track
            })
          } catch (trackError) {
            console.warn(`     ⚠️  Failed to import tracking: ${trackError.message}`)
          }
        }

        importedOrders++
      } catch (error) {
        console.warn(`   ⚠️  Failed to import order ${order.orderNumber}: ${error.message}`)
      }
    }
    console.log(`   ✅ Imported ${importedOrders}/${exportData.tables.orders.length} orders`)

    // Import SEO settings
    console.log('🔍 Importing SEO settings...')
    let importedSEO = 0
    for (const seo of exportData.tables.seoSettings) {
      try {
        await prisma.seoSettings.create({ data: seo })
        importedSEO++
      } catch (error) {
        // Try update if create fails
        try {
          await prisma.seoSettings.update({
            where: { id: seo.id },
            data: seo
          })
          importedSEO++
        } catch (updateError) {
          console.warn(`   ⚠️  Failed to import SEO setting: ${error.message}`)
        }
      }
    }
    console.log(`   ✅ Imported ${importedSEO}/${exportData.tables.seoSettings.length} SEO settings`)

    // Import media files
    console.log('🖼️  Importing media files...')
    let importedMedia = 0
    for (const media of exportData.tables.mediaFiles) {
      try {
        await prisma.mediaFile.create({ data: media })
        importedMedia++
      } catch (error) {
        try {
          await prisma.mediaFile.update({
            where: { id: media.id },
            data: media
          })
          importedMedia++
        } catch (updateError) {
          console.warn(`   ⚠️  Failed to import media file: ${error.message}`)
        }
      }
    }
    console.log(`   ✅ Imported ${importedMedia}/${exportData.tables.mediaFiles.length} media files`)

    console.log('')
    console.log('🎉 Import completed successfully!')
    console.log('')
    console.log('📊 Import Summary:')
    console.log(`   Users: ${importedUsers}/${exportData.tables.users.length}`)
    console.log(`   Services: ${importedServices}/${exportData.tables.services.length}`)
    console.log(`   Orders: ${importedOrders}/${exportData.tables.orders.length}`)
    console.log(`   Content: ${importedContent}/${exportData.tables.contentSections.length}`)
    console.log(`   SEO Settings: ${importedSEO}/${exportData.tables.seoSettings.length}`)
    console.log(`   Media Files: ${importedMedia}/${exportData.tables.mediaFiles.length}`)
    console.log('')
    console.log('✅ Your Google Cloud SQL database is ready!')
    console.log('   Update your .env.local with the new DATABASE_URL')

  } catch (error) {
    console.error('❌ Import failed:', error.message)
    await prisma.$disconnect()
    process.exit(1)
  }

  await prisma.$disconnect()
}

importData()