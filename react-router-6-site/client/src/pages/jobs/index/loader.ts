import { deferredLoader } from '@/lib/reactRouter';
import { getAllPublishedListings } from '@/features/job-listing';

export const loader = deferredLoader(() => {
  return { jobListingsPromise: getAllPublishedListings() }
})