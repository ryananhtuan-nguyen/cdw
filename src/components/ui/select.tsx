import { cn } from '@/lib/utils'
import type { SelectHTMLAttributes } from 'react'
import type React from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  value: string
  options: {
    label: string
    value: string
  }[]
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  className?: string
  selectClassName?: string
  noDefault?: boolean
}

const Select = (props: SelectProps) => {
  const {
    label,
    value,
    options,
    onChange,
    className,
    selectClassName,
    noDefault,
    ...rest
  } = props
  return (
    <div className={cn('mt-1', className)}>
      {label && <h4 className="text-sm font-semibold">{label}</h4>}
    </div>
  )
}
