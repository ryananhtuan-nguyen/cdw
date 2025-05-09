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

export const Select = (props: SelectProps) => {
  const {
    label,
    value,
    options,
    onChange,
    className,
    selectClassName,
    noDefault = true,
    ...rest
  } = props
  return (
    <div className={cn('mt-1', className)}>
      {label && <h4 className="text-sm font-semibold">{label}</h4>}
      <div className="mt-1">
        <select
          onChange={onChange}
          value={value || ''}
          className={cn(
            selectClassName,
            'disable:!bg-gray-100 w-full px-3 py-2 border-input border rounded-md focus:outline-hidden custom-select appearance-none pr-12 bg-no-repeat'
          )}
          {...rest}
        >
          {noDefault && <option value="">Select</option>}
          {options.map((option) => (
            <option key={`opt-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
