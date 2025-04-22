import React from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { HeartIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'
import { endpoints } from '@/config/endpoints'

type Props = {
  isFavourite: boolean
  setIsFavourite: (isFavourite: boolean) => void
  id: number
}

const FavouriteButton = ({ isFavourite, setIsFavourite, id }: Props) => {
  const router = useRouter()

  const handleFavourite = async () => {
    const { ids } = await api.post<{ ids: number[] }>(endpoints.favourites, {
      json: {
        id,
      },
    })
    console.log('IDS', ids)
    if (ids.includes(id)) {
      setIsFavourite(true)
    } else {
      setIsFavourite(false)
    }

    setTimeout(() => router.refresh(), 250)
  }
  return (
    <Button
      className={cn(
        'absolute top-2.5 left-3.5 rounded-full z-10 group !h-6 !w-6 lg:!h-8 lg:!w-8 xl:!h-10 xl:!w-10',
        isFavourite ? 'bg-white' : '!bg-muted/15'
      )}
      variant={'ghost'}
      size={'icon'}
      onClick={handleFavourite}
    >
      <HeartIcon
        className={cn(
          'duration-200 transition-colors ease-in-out w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-6 xl:h-6 text-white',
          isFavourite
            ? 'text-pink-500 fill-pink-500'
            : 'group-hover:text-pink-500 group-hover:fill-pink-500'
        )}
      />
    </Button>
  )
}

export default FavouriteButton
