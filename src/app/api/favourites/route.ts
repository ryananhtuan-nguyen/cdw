import { routes } from '@/config/routes'
import type { Favourites } from '@/config/type'
import { redis } from '@/lib/redis-store'
import { setSourceId } from '@/lib/source-id'
import { revalidatePath } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import z from 'zod'

const validateIdSchema = z.object({
  id: z.string().uuid(),
})
export const POST = async (request: NextRequest) => {
  const body = await request.json()

  const { data, error } = validateIdSchema.safeParse(body)
  if (!data) {
    return NextResponse.json({ error: error?.message }, { status: 400 })
  }

  //get SourceId from cookies
  const sourceId = await setSourceId()

  //   retrieve the exist favorite from redis session
  const storedFavourites = await redis.get<Favourites>(sourceId)
  const favourites: Favourites = storedFavourites || { ids: [] }

  if (favourites.ids.includes(data.id)) {
    //add or remove the ID based on its current presence in the favourites
    //remove the ID if it already exists
    favourites.ids = favourites.ids.filter((id) => id !== data.id)
  } else {
    //add the id if it does not exists
    favourites.ids.push(data.id)
  }

  //update the redis session with the new favourites
  await redis.set(sourceId, favourites)

  revalidatePath(routes.favourites)

  return NextResponse.json({ ids: favourites.ids }, { status: 200 })
}
