import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Cog, Fuel, GaugeCircle, Paintbrush } from 'lucide-react'
import type { CarWithImages } from '@/config/type'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getKeyClassifiedInfo = (car: CarWithImages) => {
  return [
    {
      id: 'odoReading',
      icon: <GaugeCircle className="w-4 h-4" />,
      value: `${car.odoReading} ${car.odoUnit}`,
    },
    {
      id: 'transmission',
      icon: <Cog className="w-4 h-4" />,
      value: car?.transmission,
    },
    {
      id: 'fuelType',
      icon: <Fuel className="w-4 h-4" />,
      value: car?.fuelType,
    },
    {
      id: 'colour',
      icon: <Paintbrush className="w-4 h-4" />,
      value: car?.colour,
    },
  ]
}
