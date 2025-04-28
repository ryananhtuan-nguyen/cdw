import { PrismaClient } from '@prisma/client'
import { seedTaxonomy } from './taxonomy.seed'
import { seedClassified } from './classified.seed'
import { seedImages } from './images.seed'
import { db } from '@/lib/db'

// const prisma = new PrismaClient()
async function main() {
  //   await db.$executeRaw`TRUNCATE TABLE "makes" RESTART IDENTITY CASCADE`
  //   await db.$executeRaw`TRUNCATE TABLE "classifieds" RESTART IDENTITY CASCADE`
  //   await seedTaxonomy(db)
  //   await seedClassified(db)
  //   await seedImages(db)
  // await seedAdmin(prisma);
  // await seedCustomers(prisma);
}

main()
  .catch((e) => {
    console.log('ERROR, ERROR', e)
    throw e
  })
  .finally(async () => {
    await db.$disconnect()
  })
