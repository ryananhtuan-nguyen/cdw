'use client'
import { routes } from '@/config/routes'
import type { SidebarProps } from '@/config/type'
import { env } from '@/env'
import { useRouter } from 'next/navigation'
import { parseAsString, useQueryStates } from 'nuqs'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { Settings2 } from 'lucide-react'
import SidebarContent from './sidebar-content'

interface DialogFiltersProps extends SidebarProps {
  count: number
}

const DialogFilters = ({
  minMaxValues,
  searchParams,
  count,
}: DialogFiltersProps) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [filterCount, setFilterCount] = useState(0)
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
  const { _min: min, _max: max } = minMaxValues

  const clearFilters = () => {
    const url = new URL(routes.inventory, env.NEXT_PUBLIC_URL)
    router.replace(url.toString())
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={'outline'} size={'icon'} className={cn('lg:hidden')}>
          <Settings2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] h-[90vh] overflow-y-auto rounded-xl bg-white">
        <DialogTitle className="hidden">Filters</DialogTitle>
        <div className="space-y-6">
          <SidebarContent
            minMaxValues={{ min, max }}
            clearFilters={clearFilters}
            searchParams={searchParams}
            handleChange={handleChange}
            queryStates={queryStates}
            filterCount={filterCount}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full"
          >
            Results {count > 0 ? ` (${count})` : null}
          </Button>

          {filterCount > 0 && (
            <Button
              type="button"
              variant={'outline'}
              onClick={clearFilters}
              className={cn(
                'text-sm py-1',
                !filterCount
                  ? 'disabled opacity-50 pointer-events-none cursor-default'
                  : 'hover:underline'
              )}
              aria-disabled={!filterCount}
            >
              Clear all ({filterCount}){' '}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogFilters
