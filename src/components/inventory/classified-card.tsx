'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { routes } from '@/config/routes'
import Image from 'next/image'
import {
  MultiStepFormEnum,
  type CarWithImages,
  type Favourites,
} from '@/config/type'
import { HTMLParser } from '../shared/html-parser'
import { getKeyClassifiedInfo } from '@/lib/utils'
import { Button } from '../ui/button'
import FavouriteButton from './favourite-button'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  car: CarWithImages
  favourites: number[]
}

const ClassifiedCard = ({ car, favourites }: Props) => {
  const [isFavourite, setIsFavourite] = useState(favourites.includes(car.id))
  const pathName = usePathname()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!isFavourite && pathName === routes.favourites) setIsVisible(false)
  }, [isVisible, pathName])
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="bg-white relative rounded-md shadow-md overflow-hidden flex flex-col"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="aspect-3/2 relative">
            <Link href={routes.singleClassified(car.slug)}>
              <Image
                placeholder="blur"
                blurDataURL={car.images[0].blurhash}
                alt={car.images[0].alt}
                src={car.images[0].src}
                className="object-cover"
                fill={true}
                quality={25}
              />
            </Link>

            <FavouriteButton
              id={car.id}
              isFavourite={isFavourite}
              setIsFavourite={setIsFavourite}
            />

            <div className="absolute top-2.5 right-3.5 bg-primary text-slate-50 font-bold px-2 py-1 rounded">
              <p className="text-xs lg:text-base xl:text-lg font-semibold">
                {car.price}
              </p>
            </div>
          </div>
          <div className="p-4 flex flex-col space-y-3">
            <div>
              <Link
                href={routes.singleClassified(car.slug)}
                className="text-sm md:text-base lg:text-lg font-semibold line-clamp-1 transition-colors hover:text-primary"
              >
                {car.title}
              </Link>
              {car?.description && (
                <div className="text-xs md:text-sm xl:text-base text-gray-500 line-clamp-2">
                  <HTMLParser html={car.description} />
                  &nbsp;
                  {/* equal spacing across each card in the grid */}
                </div>
              )}
              <ul className="text-xs md:text-sm text-gray-600 xl:flex grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-4 items-center justify-between w-full">
                {getKeyClassifiedInfo(car)
                  .filter((v) => v.value)
                  .map(({ id, icon, value }) => (
                    <li
                      key={id}
                      className="font-semibold flex xl:flex-col items-center gap-x-1.5"
                    >
                      {icon} {value}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="mt-4 flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:gap-x-2 w-full">
              <Button
                className="flex-1 transition-colors hover:border-white hover:bg-primary hover:text-white py-2 lg:py-2.5 h-full text-xs md:text-sm xl:text-base"
                asChild
                variant={'outline'}
                size={'sm'}
              >
                <Link
                  href={routes.reserve(car.slug, MultiStepFormEnum.WELCOME)}
                >
                  Reserve
                </Link>
              </Button>
              <Button
                className="flex-1 py-2 lg:py-2.5 h-full text-xs md:text-sm xl:text-base"
                asChild
                size={'sm'}
              >
                <Link href={routes.singleClassified(car.slug)}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ClassifiedCard
