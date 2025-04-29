'use client'
import { Select } from '@/components/ui/select'
import { endpoints } from '@/config/endpoints'
import type { FilterOptions, TaxonomyFilterProps } from '@/config/type'
import { api } from '@/lib/api-client'
import { useEffect, useState } from 'react'

const TaxonomyFilters = ({
  searchParams,
  handleChange,
}: TaxonomyFilterProps) => {
  const [makes, setMakes] = useState<FilterOptions<string, string>>([])
  const [models, setModels] = useState<FilterOptions<string, string>>([])
  const [modelVariants, setModelVariants] = useState<
    FilterOptions<string, string>
  >([])

  useEffect(() => {
    ;(async function fetchMakesOptions() {
      console.log('This ran')
      const params = new URLSearchParams()
      for (const [key, value] of Object.entries(
        searchParams as Record<string, string>
      )) {
        if (value) params.set(key, value as string)
      }
      const url = new URL(endpoints.taxonomy, window.location.href)
      url.search = params.toString()
      const data = await api.get<{
        makes: FilterOptions<string, string>
        models: FilterOptions<string, string>
        modelVariants: FilterOptions<string, string>
      }>(url.toString())

      setMakes(data.makes)
      setModels(data.models)
      setModelVariants(data.modelVariants)
    })()
  }, [searchParams])
  return (
    <>
      <Select
        label="Make"
        name="make"
        value={searchParams?.make as string}
        options={makes}
        onChange={handleChange}
      />
      <Select
        label="Model"
        name="model"
        value={searchParams?.model as string}
        options={models}
        onChange={handleChange}
        disabled={!models.length}
      />
      <Select
        label="Model Variant"
        name="modelVariant"
        value={searchParams?.model as string}
        options={modelVariants}
        onChange={handleChange}
        disabled={!modelVariants.length}
      />
    </>
  )
}

export default TaxonomyFilters
