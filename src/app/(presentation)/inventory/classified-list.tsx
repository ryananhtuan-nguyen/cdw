import type { Prisma } from '@prisma/client'
import React from 'react'
import type { CarWithImages } from '@/config/type'
import ClassifiedCard from '@/components/inventory/classified-card'

type Props = {
  cars: CarWithImages[]
}

const ClassifiedList = ({ cars }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {cars.map((car) => {
        return <ClassifiedCard key={car.id} car={car} />
      })}
    </div>
  )
}

export default ClassifiedList
