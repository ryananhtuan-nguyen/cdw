import { imageSources } from '@/config/constants'
import { faker } from '@faker-js/faker'
import { PrismaClient, type Prisma } from '@prisma/client'
import { createPngDataUri } from 'unlazy/thumbhash'

export async function seedImages(prisma: PrismaClient) {
  const classifieds = await prisma.classified.findMany()

  const classifiedIds = classifieds.map((classified) => classified.id)

  for (const classifiedId of classifiedIds) {
    const image: Prisma.ImageCreateInput = {
      src: imageSources.classifiedPlaceholder,
      alt: faker.lorem.words(2),
      classified: {
        connect: {
          id: classifiedId,
        },
      },
      blurhash: createPngDataUri('VhgGDIKDaHdvdnmIhoHQPQ3OpA=='),
    }
    await prisma.image.create({
      data: image,
    })
  }
}
