import { Suspense } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Await, useDeferredLoaderData } from '@/lib/reactRouter'
import { loader } from './loader'

import { MyJobListingGrid } from '@/features/job-listing/components/MyJobListingGrid'
import { JobListingSkeletonGrid } from '@/features/job-listing'

export function MyJobListingsPage() {
  const { jobListingsPromise } = useDeferredLoaderData<typeof loader>()

  return (
    <>
      <PageHeader
        btnSection={
          <Button asChild variant='outline'>
            <Link to='/jobs/new'>Create Listing</Link>
          </Button>
        }
      >
        My Job Listings
      </PageHeader>
      <Suspense fallback={<JobListingSkeletonGrid />}>
        <Await resolve={jobListingsPromise}>
          {jobListings => <MyJobListingGrid jobListings={jobListings} />}
        </Await>
      </Suspense>
    </>
  )
}
