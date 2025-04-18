import { faker } from '@faker-js/faker'
import {
  BodyType,
  ClassifiedStatus,
  Colour,
  Currency,
  FuelType,
  OdoUnit,
  PrismaClient,
  Transmission,
  ULEZCompliance,
  type Prisma,
} from '@prisma/client'
import slugify from 'slugify'
export async function seedClassified(prisma: PrismaClient) {
  const makes = await prisma.make.findMany({
    include: {
      models: {
        include: {
          modelVariants: true,
        },
      },
    },
  })

  const classifiedData: Prisma.ClassifiedCreateManyInput[] = []

  for (let i = 0; i < 25; i++) {
    const make = faker.helpers.arrayElement(makes)
    if (!make.models.length) continue
    const model = faker.helpers.arrayElement(make.models)
    const variant = model.modelVariants.length
      ? faker.helpers.arrayElement(model.modelVariants)
      : null

    const year = faker.date
      .between({
        from: new Date(1925, 0, 1),
        to: new Date(),
      })
      .getFullYear()

    const title = [year, make.name, model.name, variant?.name]
      .filter(Boolean)
      .join(' ')

    const vrm = faker.vehicle.vrm()

    const baseSlug = slugify(`${title}-${vrm}`)

    classifiedData.push({
      year,
      vrm,
      slug: baseSlug,
      makeId: make.id,
      modelId: model.id,
      ...(variant?.id && { modelVariantId: variant.id }),
      title,
      price: faker.number.int({ min: 40000, max: 100000000 }),
      currency: faker.helpers.arrayElement(Object.values(Currency)),
      odoUnit: faker.helpers.arrayElement(Object.values(OdoUnit)),
      bodyType: faker.helpers.arrayElement(Object.values(BodyType)),
      transmission: faker.helpers.arrayElement(Object.values(Transmission)),
      fuelType: faker.helpers.arrayElement(Object.values(FuelType)),
      colour: faker.helpers.arrayElement(Object.values(Colour)),
      ulezCompliance: faker.helpers.arrayElement(Object.values(ULEZCompliance)),
      status: faker.helpers.arrayElement(Object.values(ClassifiedStatus)),
      odoReading: faker.number.int({ min: 0, max: 200000 }),
      doors: faker.number.int({ min: 2, max: 8 }),
      seats: faker.number.int({ min: 2, max: 8 }),
      views: faker.number.int({ min: 100, max: 1000 }),
      description: faker.commerce.productDescription(),
    })
  }

  const results = await prisma.classified.createMany({
    data: classifiedData,
  })

  console.log(`Created ${results.count} classified listings`)
}
