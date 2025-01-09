import { getJobListing } from '@/features/job-listing'
import { deferredLoader } from '@/lib/reactRouter'

export const loader = deferredLoader(({ params: { id } }) => {
  if (typeof id !== 'string') throw new Response('Not found', { status: 404 })
  return { jobListingPromise: getJobListing(id), id }
})