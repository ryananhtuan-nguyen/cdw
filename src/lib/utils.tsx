import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Cog, Fuel, GaugeCircle, Paintbrush } from 'lucide-react'
import type { CarWithImages } from '@/config/type'
import { OdoUnit, Transmission, FuelType } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const formatNumber = (
  num: number | null,
  options?: Intl.NumberFormatOptions
) => {
  if (!num) return '0'

  return new Intl.NumberFormat('en-GB', options).format(num)
}

const formatOdometer = (unit: OdoUnit) => {
  return unit === OdoUnit.MILES ? 'mi' : 'km'
}

const formatTransmission = (transmission: Transmission) => {
  return transmission === Transmission.AUTOMATIC ? 'Automatic' : 'Manual'
}

const formatFuelType = (fuelType: FuelType) => {
  switch (fuelType) {
    case FuelType.PETROL:
      return 'Petrol'
    case FuelType.DIESEL:
      return 'Diesel'
    case FuelType.ELECTRIC:
      return 'Electric'
    case FuelType.HYBRID:
      return 'Hybrid'
    default:
      return 'Unknown'
  }
}

const formatColour = (colour: string) => {
  if (!colour || typeof colour !== 'string') return ''
  return colour[0] + colour.slice(1, colour.length).toLowerCase()
}

export const getKeyClassifiedInfo = (car: CarWithImages) => {
  return [
    {
      id: 'odoReading',
      icon: <GaugeCircle className="w-4 h-4" />,
      value: `${formatNumber(car.odoReading)} ${formatOdometer(car.odoUnit)}`,
    },
    {
      id: 'transmission',
      icon: <Cog className="w-4 h-4" />,
      value: formatTransmission(car?.transmission),
    },
    {
      id: 'fuelType',
      icon: <Fuel className="w-4 h-4" />,
      value: formatFuelType(car?.fuelType),
    },
    {
      id: 'colour',
      icon: <Paintbrush className="w-4 h-4" />,
      value: formatColour(car?.colour),
    },
  ]
}
