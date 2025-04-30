'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { parseAsString, useQueryState, useQueryStates } from 'nuqs'
import type { AwaitedPageProps } from '@/config/type'
import { routes } from '@/config/routes'
import { env } from '@/env'
import {
  cn,
  formatBodyType,
  formatColour,
  formatFuelType,
  formatOdometerUnit,
  formatTransmission,
  formatUlezCompliance,
} from '@/lib/utils'
import SearchInput from '../shared/search-input'
import TaxonomyFilters from '@/app/(presentation)/inventory/taxonomy-filters'
import RangeFilters from './range-filters'
import {
  BodyType,
  Colour,
  Currency,
  FuelType,
  OdoUnit,
  Transmission,
  ULEZCompliance,
  type Prisma,
} from '@prisma/client'
import { Select } from '../ui/select'
interface Props extends AwaitedPageProps {
  minMaxValues: Prisma.GetClassifiedAggregateType<{
    _min: { year: true; odoReading: true; price: true }
    _max: { year: true; odoReading: true; price: true }
  }>
}

const Sidebar = ({ minMaxValues, searchParams }: Props) => {
  const router = useRouter()
  const [filterCount, setFilterCount] = useState(0)
  const { _min: min, _max: max } = minMaxValues
  const [queryStates, setQueryStates] = useQueryStates(
    {
      make: parseAsString.withDefault(''),
      model: parseAsString.withDefault(''),
      modelVariant: parseAsString.withDefault(''),
      minYear: parseAsString.withDefault(''),
      maxYear: parseAsString.withDefault(''),
      minPrice: parseAsString.withDefault(''),
      maxPrice: parseAsString.withDefault(''),
      minReading: parseAsString.withDefault(''),
      maxReading: parseAsString.withDefault(''),
      currency: parseAsString.withDefault(''),
      odoUnit: parseAsString.withDefault(''),
      transmission: parseAsString.withDefault(''),
      fuelType: parseAsString.withDefault(''),
      bodyType: parseAsString.withDefault(''),
      colour: parseAsString.withDefault(''),
      doors: parseAsString.withDefault(''),
      seats: parseAsString.withDefault(''),
      ulezCompliance: parseAsString.withDefault(''),
    },
    {
      shallow: false,
    }
  )

  useEffect(() => {
    const filterCount = Object.entries(
      searchParams as Record<string, string>
    ).filter(([key, value]) => key !== 'page' && value).length

    setFilterCount(filterCount)
  }, [searchParams])

  const clearFilters = () => {
    const url = new URL(routes.inventory, env.NEXT_PUBLIC_URL)
    window.location.replace(url.toString())
    setFilterCount(0)
  }

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setQueryStates({
      [name]: value || null,
    })

    if (name === 'make') {
      setQueryStates({
        model: null,
        modelVariant: null,
      })
    }

    router.refresh()
  }

  return (
    <div className="py-4 w-[21.25rem] bg-white border-r border-muted block">
      <div>
        <div className="text-lg font-semibold flex justify-between px-4">
          <span>Filters</span>
          <button
            type="button"
            onClick={clearFilters}
            aria-disabled={!filterCount}
            className={cn(
              'text-sm text-gray-500 py-1',
              !filterCount
                ? 'disabled opacity-50 pointer-events-none cursor-default'
                : 'hover:underline cursor-pointer'
            )}
          >
            Clear all {filterCount ? `(${filterCount})` : null}
          </button>
        </div>
        <div className="mt-2" />
      </div>
      <div className="p-4">
        <SearchInput
          placeholder="Search cars..."
          className="w-full px-3 py-2 border rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="p-4 space-y-2">
        <TaxonomyFilters
          searchParams={searchParams}
          handleChange={handleChange}
        />
        <RangeFilters
          label="Year"
          minName="minYear"
          maxName="maxYear"
          defaultMin={min.year || 1925}
          defaultMax={max.year || new Date().getFullYear()}
          handleChange={handleChange}
          searchParams={searchParams}
        />
        <RangeFilters
          label="Price"
          minName="minPrice"
          maxName="maxPrice"
          defaultMin={min.price || 0}
          defaultMax={max.price || 21474836}
          handleChange={handleChange}
          searchParams={searchParams}
          increment={1000000}
          thousandSeparator
          currency={{
            currencyCode: 'GBP',
          }}
        />
        <RangeFilters
          label="Odometer reading"
          minName="minReading"
          maxName="maxReading"
          defaultMin={min.odoReading || 0}
          defaultMax={max.odoReading || 1000000}
          handleChange={handleChange}
          searchParams={searchParams}
          increment={5000}
          thousandSeparator
        />
        <Select
          label="Currency"
          name="currency"
          value={queryStates.currency || ''}
          onChange={handleChange}
          options={Object.values(Currency).map((value) => ({
            label: value,
            value,
          }))}
        />
        <Select
          label="Odometer unit"
          name="odoUnit"
          value={queryStates.odoUnit || ''}
          onChange={handleChange}
          options={Object.values(OdoUnit).map((value) => ({
            label: formatOdometerUnit(value),
            value,
          }))}
        />
        <Select
          label="Transmission"
          name="transmission"
          value={queryStates.transmission || ''}
          onChange={handleChange}
          options={Object.values(Transmission).map((value) => ({
            label: formatTransmission(value),
            value,
          }))}
        />
        <Select
          label="Fuel Type"
          name="fuelType"
          value={queryStates.fuelType || ''}
          onChange={handleChange}
          options={Object.values(FuelType).map((value) => ({
            label: formatFuelType(value),
            value,
          }))}
        />
        <Select
          label="Body Type"
          name="bodyType"
          value={queryStates.bodyType || ''}
          onChange={handleChange}
          options={Object.values(BodyType).map((value) => ({
            label: formatBodyType(value),
            value,
          }))}
        />
        <Select
          label="Colour"
          name="colour"
          value={queryStates.colour || ''}
          onChange={handleChange}
          options={Object.values(Colour).map((value) => ({
            label: formatColour(value),
            value,
          }))}
        />
        <Select
          label="ULEZ Compliance"
          name="ulezCompliance"
          value={queryStates.ulezCompliance || ''}
          onChange={handleChange}
          options={Object.values(ULEZCompliance).map((value) => ({
            label: formatUlezCompliance(value),
            value,
          }))}
        />
        <Select
          label="Doors"
          name="doors"
          value={queryStates.doors || ''}
          onChange={handleChange}
          options={Array.from({ length: 6 }).map((_, idx) => ({
            label: (idx + 1).toString(),
            value: (idx + 1).toString(),
          }))}
        />
        <Select
          label="Seats"
          name="seats"
          value={queryStates.seats || ''}
          onChange={handleChange}
          options={Array.from({ length: 8 }).map((_, idx) => ({
            label: (idx + 1).toString(),
            value: (idx + 1).toString(),
          }))}
        />
      </div>
    </div>
  )
}

export default Sidebar
