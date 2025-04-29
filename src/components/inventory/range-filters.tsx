import type { FilterOptions, TaxonomyFilterProps } from '@/config/type'
import React, { useEffect, useState } from 'react'
import type { Currency } from '@prisma/client'
import RangeSelect from '../ui/range-select'

interface RangeFiltersProps extends TaxonomyFilterProps {
  label: string
  minName: string
  maxName: string
  defaultMin: number
  defaultMax: number
  increment?: number
  thousandSeparator?: string
  currency?: {
    currencyCode: Currency
  }
}

const RangeFilters = ({
  label,
  minName,
  maxName,
  defaultMin,
  defaultMax,
  increment,
  thousandSeparator,
  currency,
  handleChange,
  searchParams,
}: RangeFiltersProps) => {
  const getInitialState = () => {
    const state: FilterOptions<string, number> = []
    let iterator = defaultMin - 1
    do {
      if (increment) {
        iterator = iterator + increment
      } else {
        iterator++
      }

      state.push({
        label: iterator.toString(),
        value: iterator,
      })
    } while (iterator < defaultMax)

    return state
  }
  const initialState = getInitialState()

  const [minOptions, setMinOptions] =
    useState<FilterOptions<string, number>>(initialState)
  const [maxOptions, setMaxOptions] = useState<FilterOptions<string, number>>(
    initialState.toReversed()
  )
  useEffect(() => {
    if (searchParams?.[minName]) {
      setMaxOptions(
        initialState.filter(
          ({ value }) => value > Number(searchParams?.[minName])
        )
      )
    }
    if (searchParams?.[maxName]) {
      setMinOptions(
        initialState.filter(
          ({ value }) => value < Number(searchParams?.[maxName])
        )
      )
    }
  }, [searchParams?.[minName], searchParams?.[maxName]])

  return (
    <RangeSelect
      label={label}
      minSelect={{
        name: minName,
        value: Number(searchParams?.[minName]) || '',
        onChange: handleChange,
        options: minOptions,
      }}
      maxSelect={{
        name: maxName,
        value: Number(searchParams?.[maxName]) || '',
        onChange: handleChange,
        options: maxOptions,
      }}
    />
  )
}

export default RangeFilters
