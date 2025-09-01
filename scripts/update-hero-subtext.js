const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://maritime_user:DOAZgMJpJcJ%2Fbj18oKSTTYeviaZZ6VLsPe%2FeCH33z0M%3D@35.192.22.45:5432/maritime?sslmode=require"
    }
  }
});

async function updateHeroSubtext() {
  try {
    // Check if hero section exists
    const heroSection = await prisma.contentSection.findUnique({
      where: { type: 'hero' }
    });

    if (heroSection) {
      // Update with subtext if it doesn't have one
      if (!heroSection.subtext) {
        await prisma.contentSection.update({
          where: { type: 'hero' },
          data: {
            subtext: 'To book for a truck to load and deliver your container or cargo, safe and sound tap the request for truck(s) button below.'
          }
        });
        console.log('Updated hero section with subtext');
      } else {
        console.log('Hero section already has subtext:', heroSection.subtext);
      }
    } else {
      // Create hero section if it doesn't exist
      await prisma.contentSection.create({
        data: {
          type: 'hero',
          name: 'Hero Section',
          title: 'Your Gateway to Global Maritime Solutions',
          content: 'Your trusted partner for comprehensive maritime solutions.',
          subtext: 'To book for a truck to load and deliver your container or cargo, safe and sound tap the request for truck(s) button below.'
        }
      });
      console.log('Created hero section with subtext');
    }

    // List all content sections
    const allSections = await prisma.contentSection.findMany();
    console.log('\nAll content sections:');
    allSections.forEach(section => {
      console.log(`- ${section.type}: ${section.title} (subtext: ${section.subtext ? 'yes' : 'no'})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateHeroSubtext();