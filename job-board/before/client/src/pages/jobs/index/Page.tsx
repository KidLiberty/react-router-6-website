import { Suspense, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Heart } from 'lucide-react'

import { loader } from './loader'
import { Await, useDeferredLoaderData } from '@/lib/reactRouter'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { cn } from '@/utils/shadcnUtils'

import { JobListingCard, JobListingFilterForm, JobListingFullDialog, JobListingGrid, JobListingSkeletonGrid, useJobListingFilterForm } from '@/features/job-listing'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/PageHeader'
import { toast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'

export function JobListingsListPage() {
  const { jobListingsPromise } = useDeferredLoaderData<typeof loader>()
  const [hiddenJobListingIds, setHiddenJobListingIds] = useLocalStorage<string[]>('hiddenJobsIds', [])
  const [favoriteJobListingIds, setFavoriteJobListingIds] = useLocalStorage<string[]>('favoriteJobsIds', [])
  const { form, getFilteredJobs } = useJobListingFilterForm()

  function toggleHidden(jobListingId: string, title: string) {
    setHiddenJobListingIds(ids => {
      if (ids.includes(jobListingId)) {
        return ids.filter(id => id !== jobListingId)
      }

      return [...ids, jobListingId]
    })

    if (hiddenJobListingIds.includes(jobListingId)) return

    toast({
      title: 'Job Hidden',
      description: `${title} will no longer be shown.`,
      action: (
        <ToastAction
          onClick={() => {
            setHiddenJobListingIds(ids => {
              return ids.filter(id => id !== jobListingId)
            })
          }}
          altText='Click show hidden in the filter section to show hidden jobs and then click the show button in the card to show this job again.'
        >
          Undo
        </ToastAction>
      )
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
      <JobListingFilterForm className='mb-12' form={form} />
      <Suspense fallback={<JobListingSkeletonGrid />}>
        <Await resolve={jobListingsPromise}>
          {jobListings => (
            <JobListingGrid>
              {getFilteredJobs(jobListings, hiddenJobListingIds, favoriteJobListingIds)
                .map(jobListing => {
                  const isFavorite = favoriteJobListingIds.includes(jobListing.id)
                  const isHidden = hiddenJobListingIds.includes(jobListing.id)
                  const HideIcon = isHidden ? Eye : EyeOff

                  return (
                    <JobListingCard
                      key={jobListing.id}
                      className={isHidden ? 'opacity-50' : undefined}
                      {...jobListing}
                      headerDetails={
                        <div className='-mt-2 -mr-2'>
                          <Button className='rounded-full' size='icon' variant='ghost' onClick={() => toggleHidden(jobListing.id, jobListing.title)}>
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