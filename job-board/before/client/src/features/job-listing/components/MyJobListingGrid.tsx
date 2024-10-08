import { JobListing } from '../constants/types'
import { JobListingCard } from './JobListingCard'
import { JobListingGrid } from './JobListingGrid'

type MyJobListingGridProps = {
  jobListings: JobListing[]
}

export function MyJobListingGrid({ jobListings }: MyJobListingGridProps) {
  return (
    <JobListingGrid>
      {jobListings.map(jobListing => <MyJobListingCard key={jobListing.id} jobListing={jobListing} />)}
    </JobListingGrid>
  )
}

type MyJobListingCardProps = {
  jobListing: JobListing
}

function MyJobListingCard({ jobListing }: MyJobListingCardProps) {
  return (
    <JobListingCard
      {...jobListing}
    // footerBtns={ }
    />
  )
}