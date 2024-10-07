import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/PageHeader';
import { Await, useDeferredLoaderData } from '@/lib/reactRouter';
import { Link } from 'react-router-dom';
import { loader } from './loader';
import { Suspense } from 'react';

import { MyJobListingGrid } from '@/features/job-listing/components/MyJobListingGrid';

export function MyJobListingsPage() {
  const { jobListingsPromise } = useDeferredLoaderData<typeof loader>()

  return (
    <>
      <PageHeader
        btnSection={
          <Button asChild variant='outline'>
            <Link to='/jobs/new'>
              Create Listing
            </Link>
          </Button>
        }
      >
        My Job Listings
      </PageHeader>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Await resolve={jobListingsPromise}>
          {jobListings => <MyJobListingGrid jobListings={jobListings} />}
        </Await>
      </Suspense>
    </>
  )
}
