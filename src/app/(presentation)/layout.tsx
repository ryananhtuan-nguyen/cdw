import { PublicLayout } from '@/components/layouts/public-layout'
import React, { type PropsWithChildren } from 'react'

type Props = {}

const PresentationLayout = ({ children }: PropsWithChildren) => {
  return <PublicLayout>{children}</PublicLayout>
}

export default PresentationLayout
