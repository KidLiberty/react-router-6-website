import { ComponentProps } from 'react'
import { cn } from '@/utils/shadcnUtils'

type JobListingGridProps = ComponentProps<'div'>

export function JobListingGrid({ className, ...props }: JobListingGridProps) {
  return <div className={cn('flex flex-col sm:grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]', className)} {...props} />
}