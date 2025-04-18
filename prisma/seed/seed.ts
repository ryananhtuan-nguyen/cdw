import { PrismaClient } from '@prisma/client'
import { seedTaxonomy } from './taxonomy.seed'
import { seedClassified } from './classified.seed'
import { seedImages } from './images.seed'

const prisma = new PrismaClient()
async function main() {
  //   await prisma.make.deleteMany()
  //   await seedTaxonomy(prisma)
  //   await prisma.classified.deleteMany()
  //   await seedClassified(prisma)
  //   await seedImages(prisma)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
