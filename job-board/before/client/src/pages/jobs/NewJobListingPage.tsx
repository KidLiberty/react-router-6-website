import { PageHeader } from '@/components/ui/PageHeader'
import { JobListingForm } from '@/features/job-listing'

export function NewJobListingsPage() {
  return (
    <>
      <PageHeader>New Listing</PageHeader>
      <JobListingForm />
    </>
  )
}
