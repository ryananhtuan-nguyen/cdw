import type { Prisma } from "@prisma/client"

type Params = {
  [key: string]: string | string[]
}
export type PageProps = {
  params?: Promise<Params>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export type AwaitedPageProps = {
  params?: Awaited<PageProps['params']>
  searchParams?: Awaited<PageProps['searchParams']>
}


export type CarWithImages = Prisma.ClassifiedGetPayload<{ include: { images: true } }>