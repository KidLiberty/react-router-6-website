import { Banknote, CalendarDays, GraduationCap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { JobListingGrid } from './JobListingGrid';

export function JobListingSkeletonCard() {
  return (
    <Card className='h-full flex flex-col'>
      <CardHeader className='flex flex-col gap-1'>
        <Skeleton className='w-48 h-6' />
        <Skeleton className='w-12 h-6' />
        <Skeleton className='w-20 h-6' />
        <div className='flex gap-1 flex-wrap'>
          <Badge className='animate-pulse' variant='secondary'>
            <Banknote className='w-4 h-4' />
            <div className='w-8' />
          </Badge>
          <Badge className='animate-pulse' variant='secondary'>
            <CalendarDays className='w-4 h-4' />
            <div className='w-8' />
          </Badge>
          <Badge className='animate-pulse' variant='secondary'>
            <GraduationCap className='w-4 h-4' />
            <div className='w-8' />
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-1'>
        <Skeleton className='h-4' />
        <Skeleton className='h-4' />
        <Skeleton className='h-4' />
        <Skeleton className='h-4 w-2/3' />
      </CardContent>
      <CardFooter className='flex gap-2 items-stretch justify-end'>
        <Skeleton className='w-24 h-10' />
      </CardFooter>
    </Card>
  )
}

export function JobListingSkeletonGrid({ amount = 6 }) {
  return (
    <JobListingGrid>
      {Array(amount).fill(null).map((_, i) => (
        <JobListingSkeletonCard key={i} />
      ))}
    </JobListingGrid>
  )
}