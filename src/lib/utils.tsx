import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Cog, Fuel, GaugeCircle, Paintbrush } from 'lucide-react'
import type { AwaitedPageProps, CarWithImages } from '@/config/type'
import {
  OdoUnit,
  Transmission,
  FuelType,
  type Prisma,
  ClassifiedStatus,
  type Currency,
  ULEZCompliance,
  BodyType,
} from '@prisma/client'
import { CarFilterSchema } from '@/app/(presentation)/inventory/page'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNumber = (
  num: number | null,
  options?: Intl.NumberFormatOptions
) => {
  if (!num) return '0'

  return new Intl.NumberFormat('en-GB', options).format(num)
}

export const formatOdometerUnit = (unit: OdoUnit) => {
  return unit === OdoUnit.MILES ? 'mi' : 'km'
}

export const formatTransmission = (transmission: Transmission) => {
  return transmission === Transmission.AUTOMATIC ? 'Automatic' : 'Manual'
}

export const formatFuelType = (fuelType: FuelType) => {
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

export const formatColour = (colour: string) => {
  if (!colour || typeof colour !== 'string') return ''
  return colour[0] + colour.slice(1, colour.length).toLowerCase()
}

export const getKeyClassifiedInfo = (car: CarWithImages) => {
  return [
    {
      id: 'odoReading',
      icon: <GaugeCircle className="w-4 h-4" />,
      value: `${formatNumber(car.odoReading)} ${formatOdometerUnit(
        car.odoUnit
      )}`,
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

export const buildCarFilterQuery = (
  searchParams: AwaitedPageProps['searchParams'] | undefined
): Prisma.ClassifiedWhereInput => {
  const { data } = CarFilterSchema.safeParse(searchParams)

  if (!data) return { status: ClassifiedStatus.LIVE }

  const keys = Object.keys(data)

  const taxonomyFilters = ['make', 'model', 'modelVariant']

  const rangeFilters = {
    minYear: 'year',
    maxYear: 'year',
    minPrice: 'price',
    maxPrice: 'price',
    minReading: 'odoReading',
    maxReading: 'odoReading',
  }

  const numFilters = ['seats', 'doors']
  const enumFilters = [
    'odoUnit',
    'currency',
    'transmission',
    'bodyType',
    'fuelType',
    'colour',
    'ulezCompliance',
  ]

  const mapParamsToFields = keys.reduce((acc, key) => {
    const value = searchParams?.[key] as string | undefined
    if (!value) return acc
    if (taxonomyFilters.includes(key)) {
      acc[key] = { id: value }
    } else if (enumFilters.includes(key)) {
      acc[key] = value.toUpperCase()
    } else if (numFilters.includes(key)) {
      acc[key] = Number(value)
    } else if (key in rangeFilters) {
      const field = rangeFilters[key as keyof typeof rangeFilters]
      acc[field] = acc[field] || {}
      if (key.startsWith('min')) {
        acc[field].gte = Number(value)
      } else if (key.startsWith('max')) {
        acc[field].lte = Number(value)
      }
    }

    return acc
  }, {} as { [key: string]: any })

  return {
    status: ClassifiedStatus.LIVE,
    ...(searchParams?.q && {
      OR: [
        {
          title: {
            contains: searchParams.q as string,
            mode: 'insensitive',
          },
        },

        {
          description: {
            contains: searchParams.q as string,
            mode: 'insensitive',
          },
        },
      ],
    }),
    ...mapParamsToFields,
  }
}

interface FormatPriceArgs {
  price: number | null
  currency: Currency | null
}
export function formatPrice({ price, currency }: FormatPriceArgs) {
  if (!price) return '0'
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
    currency: currency || 'GBP',
    maximumFractionDigits: 0,
  })

  if (currency === 'USD') {
    return formatter.format(price / 100).replace('US$', '$')
  }

  return formatter.format(price / 100)
}

export const formatUlezCompliance = (ulezCompliance: ULEZCompliance) => {
  return ulezCompliance === ULEZCompliance.EXEMPT ? 'Exempt' : 'Non-Exempt'
}
export const formatBodyType = (bodyType: BodyType) => {
  switch (bodyType) {
    case BodyType.SEDAN:
      return 'Sedan'
    case BodyType.HATCHBACK:
      return 'Hatchback'
    case BodyType.SUV:
      return 'SUV'
    case BodyType.COUPE:
      return 'Coupe'
    case BodyType.CONVERTIBLE:
      return 'Convertible'
    case BodyType.WAGON:
      return 'Wagon'
    default:
      return 'Unknown'
  }
}
