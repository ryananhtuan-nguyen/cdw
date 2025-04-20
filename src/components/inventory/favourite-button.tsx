import React from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { HeartIcon } from 'lucide-react'

type Props = {}

const FavouriteButton = (props: Props) => {
  return (
    <Button
      className={cn(
        'absolute top-2.5 left-3.5 rounded-full z-10 group !h-6 !w-6 lg:!h-8 lg:!w-8 xl:!h-10 xl:!w-10'
      )}
      variant={'ghost'}
      size={'icon'}
    >
        <HeartIcon className={cn("duration-200 transition-colors ease-in-out w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-6 xl:h-6 text-white")}/>
    </Button>
  )
}

export default FavouriteButton
