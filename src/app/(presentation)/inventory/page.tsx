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
import { z } from 'zod'

const PageSchema = z
  .string()
  .transform((val) => Math.max(Number(val), 1))
  .optional()

const getInventory = async (seachParams: AwaitedPageProps['searchParams']) => {
  const validPage = PageSchema.parse(seachParams?.page)

  //get current page
  const page = validPage ? validPage : 1

  //   calculate offset
  const offset = (page - 1) * CARS_PER_PAGE

  return db.classified.findMany({
    where: {},
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
  const count = await db.classified.count({ where: {} })
  const sourceId = await getSourceId()
  const favourites = await redis.get<Favourites>(sourceId || '')

  const totalPages = Math.ceil(count / CARS_PER_PAGE)

  return (
    <div className="flex">
      <Sidebar minMaxValues={null} searchParams={searchParams} />

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
