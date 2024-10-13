import { Suspense } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/utils/shadcnUtils'
import { Await, useDeferredLoaderData } from '@/lib/reactRouter'
import { loader } from './loader'
import { Button } from '@/components/ui/button'
import { JobListingSkeletonGrid } from '@/features/job-listing'
import { PageHeader } from '@/components/ui/PageHeader'
import { JobListingCard } from '@/features/job-listing/components/JobListingCard'
import { JobListingGrid } from '@/features/job-listing/components/JobListingGrid'
import { JobListingFullDialog } from '@/features/job-listing/components/JobListingFullDialog'
import { Eye, EyeOff, Heart } from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export function JobListingsListPage() {
  const { jobListingsPromise } = useDeferredLoaderData<typeof loader>()
  const [hiddenJobListingIds, setHiddenJobListingIds] = useLocalStorage<string[]>('hiddenJobsIds', [])
  const [favoriteJobListingIds, setFavoriteJobListingIds] = useLocalStorage<string[]>('favoriteJobsIds', [])

  function toggleHidden(jobListingId: string) {
    setHiddenJobListingIds(ids => {
      if (ids.includes(jobListingId)) {
        return ids.filter(id => id !== jobListingId)
      }

      return [...ids, jobListingId]
    })
  }

  function toggleFavorite(jobListingId: string) {
    setFavoriteJobListingIds(ids => {
      if (ids.includes(jobListingId)) {
        return ids.filter(id => id !== jobListingId)
      }

      return [...ids, jobListingId]
    })
  }

  return (
    <>
      <PageHeader
        btnSection={
          <Button asChild variant='outline'>
            <Link to='/jobs/new'>Create Listing</Link>
          </Button>
        }
      >
        Job Listings
      </PageHeader>
      <Suspense fallback={<JobListingSkeletonGrid />}>
        <Await resolve={jobListingsPromise}>
          {jobListings => (
            <JobListingGrid>
              {jobListings.map(jobListing => {
                const isFavorite = favoriteJobListingIds.includes(jobListing.id)
                const isHidden = hiddenJobListingIds.includes(jobListing.id)
                const HideIcon = isHidden ? Eye : EyeOff

                return (
                  <JobListingCard
                    {...jobListing}
                    headerDetails={
                      <div className='-mt-2 -mr-2'>
                        <Button className='rounded-full' size='icon' variant='ghost' onClick={() => toggleHidden(jobListing.id)}>
                          <HideIcon className='w-4 h-4' />
                          <div className='sr-only'>{isHidden ? 'Show' : 'Hide'}</div>
                        </Button>
                        <Button className='rounded-full' size='icon' variant='ghost' onClick={() => toggleFavorite(jobListing.id)}>
                          <Heart className={cn('w-4 h-4', isFavorite && 'fill-red-500 stroke-red-500')} />
                          <div className='sr-only'>{isFavorite ? 'Un-Favorite' : 'Favorite'}</div>
                        </Button>
                      </div>
                    }
                    footerBtns={<JobListingFullDialog {...jobListing} />}
                  />
                )
              })}
            </JobListingGrid>
          )}
        </Await>
      </Suspense>
    </>
  )
}