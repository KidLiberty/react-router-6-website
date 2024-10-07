
import { JobListing } from '../constants/types'
import { JobListingGrid } from './JobListingGrid'

type MyJobListingGridProps = {
  jobListings: JobListing[]
}

export function MyJobListingGrid({ jobListings }: MyJobListingGridProps) {
  return (
    <JobListingGrid>
      {jobListings.map(jobListing => <MyJobListingCard key={jobListing.id} />)}
    </JobListingGrid>
  )
}

function MyJobListingCard() {
  return (
    <div></div>
  )
}