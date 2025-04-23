'use client'
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as PaginationRoot,
} from '@/components/ui/pagination'
import { env } from '@/env'
import { cn } from '@/lib/utils'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'

type Props = {
  baseURL: string
  totalPages: number
  maxVisiblePages?: number
  styles: {
    paginationRoot: string
    paginationPrevious: string
    paginationNext: string
    paginationLink: string
    paginationLinkActive: string
  }
}

const CustomPagination = ({
  baseURL,
  totalPages,
  maxVisiblePages = 5,
  styles,
}: Props) => {
  const [currentPage, setCurrentPage] = useQueryState('page', {
    defaultValue: 1,
    parse: (value) => {
      const parsed = Number.parseInt(value, 10)
      return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed
    },
    serialize: (value) => value.toString(),
    shallow: false,
  })

  const [visibleRange, setVisibleRange] = useState({
    start: 1,
    end: Math.min(maxVisiblePages, totalPages),
  })

  useEffect(() => {
    const halfVisible = Math.floor(maxVisiblePages / 2)
    const newStart = Math.max(
      1,
      Math.min(currentPage - halfVisible, totalPages - maxVisiblePages + 1)
    )
    const newEnd = Math.min(totalPages, newStart + maxVisiblePages - 1)
    setVisibleRange({ start: newStart, end: newEnd })
  }, [currentPage, totalPages, maxVisiblePages])

  const createPageUrl = (pageNumber: number) => {
    const url = new URL(baseURL, env.NEXT_PUBLIC_URL)
    url.searchParams.set('page', pageNumber.toString())
    return url.toString()
  }

  const handleEllipsisClick = (direction: 'left' | 'right') => {
    const newPage =
      direction === 'left'
        ? Math.max(1, visibleRange.start - maxVisiblePages)
        : Math.min(totalPages, visibleRange.end + maxVisiblePages)
    setCurrentPage(newPage)
  }

  return (
    <PaginationRoot className={styles.paginationRoot}>
      <PaginationContent className="lg:gap-4">
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              currentPage <= 1 && 'hidden',
              styles.paginationPrevious
            )}
            href={createPageUrl(currentPage - 1)}
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1)
              }
            }}
          />
        </PaginationItem>

        {visibleRange.start > 1 && (
          <PaginationItem className="hidden lg:block group">
            <PaginationLink
              className={styles.paginationLink}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handleEllipsisClick('left')
              }}
              title="First page"
            >
              <ChevronsLeft
                size={16}
                className="text-black/20 group-hover:!text-black"
              />
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Pages go here */}
        {Array.from(
          { length: visibleRange.end - visibleRange.start + 1 },
          (_, index) => visibleRange.start + index
        ).map((pageNo) => {
          const isActive = pageNo === currentPage
          let rel = ''

          if (pageNo === currentPage - 1) {
            rel = 'prev'
          }

          if (pageNo === currentPage + 1) {
            rel = 'next'
          }
          return (
            <PaginationItem key={`Page number ${pageNo}`}>
              <PaginationLink
                {...(rel ? { rel } : {})}
                isActive={isActive}
                href={createPageUrl(pageNo)}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage(pageNo)
                }}
                className={cn(
                  styles.paginationLink,
                  isActive && styles.paginationLinkActive
                )}
              >
                {pageNo}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        {visibleRange.end < totalPages && (
          <PaginationItem className="hidden lg:block group">
            <PaginationLink
              className={styles.paginationLink}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handleEllipsisClick('right')
              }}
              title="Last page"
            >
              <ChevronsRight
                size={16}
                className="text-black/20 group-hover:text-black"
              />
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            className={cn(
              currentPage >= totalPages && 'hidden',
              styles.paginationNext
            )}
            href={createPageUrl(currentPage + 1)}
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1)
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  )
}

export default CustomPagination
