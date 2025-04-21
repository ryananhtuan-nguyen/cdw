import ClassifiedList from '@/components/inventory/classified-list'
import {
  Favourites,
  type AwaitedPageProps,
  type PageProps,
} from '@/config/type'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis-store'
import { getSourceId } from '@/lib/source-id'

const getInventory = async (seachParams: AwaitedPageProps['searchParams']) => {
  return db.classified.findMany({
    include: {
      images: true,
    },
  })
}

export default async function InventoryPage(props: PageProps) {
  const searchParams = await props.searchParams
  const cars = await getInventory(searchParams)
  const sourceId = await getSourceId()
  const favourites = await redis.get<Favourites>(sourceId || '')
  return (
    <ClassifiedList cars={cars} favourites={favourites ? favourites.ids : []} />
  )
}
