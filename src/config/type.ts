import type { Prisma } from '@prisma/client'

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

export enum MultiStepFormEnum {
  WELCOME = 1,
  SELECT_DATE = 2,
  SUBMIT_DETAILS = 3,
}

export type CarWithImages = Prisma.ClassifiedGetPayload<{
  include: { images: true }
}>

export interface Favourites {
  ids: string[]
}

export interface TaxonomyFilterProps extends AwaitedPageProps {
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export type FilterOptions<LType, VType> = Array<{
  label: LType
  value: VType
}>

export interface SidebarProps extends AwaitedPageProps {
  minMaxValues: Prisma.GetClassifiedAggregateType<{
    _min: { year: true; odoReading: true; price: true }
    _max: { year: true; odoReading: true; price: true }
  }>
}
