const { PrismaClient } = require('@prisma/client');

async function testPrisma() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing Prisma connection...');
    
    // Test if we can connect to the database
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Test if we can query artists
    const artists = await prisma.artist.findMany();
    console.log('✅ Found artists:', artists.length);
    console.log('Artists:', artists);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();

