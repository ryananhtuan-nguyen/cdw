'use client'
import type { AwaitedPageProps } from '@/config/type'
import React from 'react'

interface Props extends AwaitedPageProps {
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const TaxonomyFilters = (props: Props) => {
  return <div>TaxonomyFilters</div>
}

export default TaxonomyFilters
