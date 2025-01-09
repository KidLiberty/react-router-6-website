import { useNavigate } from 'react-router-dom'

import { createJobListing, JobListingForm } from '@/features/job-listing'
import { PageHeader } from '@/components/ui/PageHeader'

export function NewJobListingsPage() {
  const navigate = useNavigate()
  return (
    <>
      <PageHeader>New Listing</PageHeader>
      <JobListingForm
        onSubmit={async values => {
          await createJobListing(values)
          navigate('/jobs/my-listings')
        }}
      />
    </>
  )
}
