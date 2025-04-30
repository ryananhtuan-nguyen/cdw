import React from 'react'
import SearchInput from '../shared/search-input'
import TaxonomyFilters from '@/app/(presentation)/inventory/taxonomy-filters'
import {
  cn,
  formatBodyType,
  formatColour,
  formatFuelType,
  formatOdometerUnit,
  formatTransmission,
  formatUlezCompliance,
} from '@/lib/utils'
import type { AwaitedPageProps } from '@/config/type'
import RangeFilters from './range-filters'
import { Select } from '../ui/select'
import {
  BodyType,
  Colour,
  Currency,
  FuelType,
  OdoUnit,
  Transmission,
  ULEZCompliance,
} from '@prisma/client'

type Props = {
  clearFilters: () => void
  filterCount: number
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  searchParams: AwaitedPageProps['searchParams']
  queryStates: any
  minMaxValues: {
    min: {
      year: number | null
      odoReading: number | null
      price: number | null
    }
    max: {
      year: number | null
      odoReading: number | null
      price: number | null
    }
  }
}

const SidebarContent = ({
  clearFilters,
  filterCount,
  handleChange,
  searchParams,
  queryStates,
  minMaxValues,
}: Props) => {
  const { min, max } = minMaxValues
  return (
    <>
      <div>
        <div className="text-lg font-semibold flex justify-between lg:px-4">
          <span>Filters</span>
          <button
            type="button"
            onClick={clearFilters}
            aria-disabled={!filterCount}
            className={cn(
              'text-sm text-gray-500 py-1 hidden lg:block',
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
      <div className="lg:p-4">
        <SearchInput
          placeholder="Search cars..."
          className="w-full px-3 py-2 border rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="lg:p-4 space-y-2">
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
    </>
  )
}

export default SidebarContent
