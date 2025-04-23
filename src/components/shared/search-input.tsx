import { useQueryState } from 'nuqs'
import React, { useCallback, useRef } from 'react'
import debounce from 'debounce'
import { SearchIcon, XIcon } from 'lucide-react'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

function debounceFunc<T extends (...args: any) => any>(
  func: T,
  wait: number,
  opts: { immediate: boolean }
) {
  return debounce(func, wait, opts)
}

const SearchInput = ({ className, ...rest }: Props) => {
  const [searchQuery, setSearchQuery] = useQueryState('q', { shallow: false })
  const inputRef = useRef<HTMLInputElement>(null)
  const handleSearch = useCallback(
    debounceFunc(
      (value: string) => {
        setSearchQuery(value || null)
      },
      1000,
      { immediate: false }
    ),
    []
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    handleSearch(newValue)
  }
  const clearSearch = () => {
    setSearchQuery(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <form className="relative flex-1">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        ref={inputRef}
        defaultValue={searchQuery || ''}
        className={cn(className, 'pl-8')}
        onChange={onChange}
        type="text"
        {...rest}
      />
      {searchQuery && (
        <XIcon
          className="absolute right-2.5 top-2.5 h-4 w-4 text-white bg-gray-500 p-0.5 rounded-full cursor-pointer"
          onClick={clearSearch}
        />
      )}
    </form>
  )
}

export default SearchInput
