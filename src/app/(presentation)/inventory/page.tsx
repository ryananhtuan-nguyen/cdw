import ClassifiedList from '@/components/inventory/classified-list'
import type { AwaitedPageProps, PageProps } from '@/config/type'
import { db } from '@/lib/db'

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
