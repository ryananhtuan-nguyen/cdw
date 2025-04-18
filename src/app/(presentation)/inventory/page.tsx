import ClassifiedCard from '@/components/inventory/classified-card'
import type { AwaitedPageProps, PageProps } from '@/config/type'
import { db } from '@/lib/db'
import ClassifiedList from './classified-list'

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
  return <ClassifiedList cars={cars} />
}
