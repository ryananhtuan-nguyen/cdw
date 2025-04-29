import { z } from 'zod'
import ClassifiedList from '@/components/inventory/classified-list'
import Sidebar from '@/components/inventory/sidebar'
import CustomPagination from '@/components/shared/custom-pagination'
import { CARS_PER_PAGE } from '@/config/constants'
import { routes } from '@/config/routes'
import {
  Favourites,
  type AwaitedPageProps,
  type PageProps,
} from '@/config/type'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis-store'
import { getSourceId } from '@/lib/source-id'
import { ClassifiedStatus, type Prisma } from '@prisma/client'
import { buildCarFilterQuery } from '@/lib/utils'

export const PageSchema = z
  .string()
  .transform((val) => Math.max(Number(val), 1))
  .optional()

export const CarFilterSchema = z.object({
  query: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  modelVariant: z.string().optional(),
  minYear: z.string().optional(),
  maxYear: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minReading: z.string().optional(),
  maxReading: z.string().optional(),
  currency: z.string().optional(),
  odoUnit: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  bodyType: z.string().optional(),
  colour: z.string().optional(),
  doors: z.string().optional(),
  seats: z.string().optional(),
  ulezCompliance: z.string().optional(),
})

const getInventory = async (searchParams: AwaitedPageProps['searchParams']) => {
  const validPage = PageSchema.parse(searchParams?.page)
  //get current page
  const page = validPage ? validPage : 1

  //   calculate offset
  const offset = (page - 1) * CARS_PER_PAGE

  return db.classified.findMany({
    where: buildCarFilterQuery(searchParams),
    include: {
      images: { take: 1 },
    },
    skip: offset,
    take: CARS_PER_PAGE,
  })
}

export default async function InventoryPage(props: PageProps) {
  const searchParams = await props.searchParams
  const cars = await getInventory(searchParams)
  const count = await db.classified.count({
    where: buildCarFilterQuery(searchParams),
  })
  const sourceId = await getSourceId()
  const favourites = await redis.get<Favourites>(sourceId || '')
  const minMaxResult = await db.classified.aggregate({
    where: {
      status: ClassifiedStatus.LIVE,
    },
    _min: {
      year: true,
    },
    _max: {
      price: true,
      year: true,
      odoReading: true,
    },
  })

  const totalPages = Math.ceil(count / CARS_PER_PAGE)

  return (
    <div className="flex">
      <Sidebar minMaxValues={minMaxResult} searchParams={searchParams} />

      <div className="flex-1 p-4 bg-white">
        <div className="flex space-y-2 flex-col items-center justify-center pb-4 -mt-1">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-sm md:text-base lg:text-xl font-semibold min-w-fit">
              We have found {count} cars
            </h2>

            {/* <DialogFilters /> */}
          </div>

          <CustomPagination
            baseURL={routes.inventory}
            totalPages={totalPages}
            styles={{
              paginationRoot: 'hidden xl:flex justify-end',
              paginationPrevious: '',
              paginationNext: '',
              paginationLink: 'border-non active:border text-black',
              paginationLinkActive: '',
            }}
          />
          <ClassifiedList
            cars={cars}
            favourites={favourites ? favourites.ids : []}
          />
        </div>
      </div>
    </div>
  )
}
