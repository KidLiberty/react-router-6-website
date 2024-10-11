import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { differenceInDays, formatDistanceStrict, isAfter } from 'date-fns'
import { Elements } from '@stripe/react-stripe-js'

import { JobListingCard } from './JobListingCard'
import { JobListingGrid } from './JobListingGrid'
import { JobListing } from '../constants/types'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { toast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { createPublishPaymentIntent, deleteListing } from '../services/jobListing'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { JOB_LISTING_DURATIONS } from '@backend/constants/types'
import { formatCurrency } from '@/utils/formatters'
import { getJobListingPriceInCents } from '@backend/utils/getJobListingPriceInCents'
import { Badge } from '@/components/ui/badge'
import { stripePromise } from '@/lib/stripe'
import { JobListingCheckoutForm } from './JobListingCheckoutForm'
import { useThemeContext } from '@/hooks/useTheme'

type MyJobListingGridProps = {
  jobListings: JobListing[]
}

export function MyJobListingGrid({ jobListings }: MyJobListingGridProps) {
  const [deletedJobListingIds, setDeletedJobListingIds] = useState<string[]>([])
  const visibleJobListings = useMemo(() => {
    return jobListings
      .filter(jobListing => !deletedJobListingIds.includes(jobListing.id))
      .sort(sortJobListings)
  }, [jobListings, deletedJobListingIds])

  function deleteJobListing(id: string) {
    // Catch error so if deleteListing service fails, job listing will remain & toast will inform the of error and attempt retry
    deleteListing(id)
      .catch(() => {
        toast({
          title: 'Failed to delete job listing.',
          action: (
            <ToastAction altText='Click the delete button in the job card to retry' onClick={() => deleteJobListing(id)}>
              Retry
            </ToastAction>
          )
        })
        setDeletedJobListingIds(ids => {
          return ids.filter(listingId => listingId !== id)
        })
      })
    setDeletedJobListingIds(ids => [...ids, id])
  }

  return (
    <JobListingGrid>
      {visibleJobListings.map(jobListing => (
        <MyJobListingCard
          key={jobListing.id}
          jobListing={jobListing}
          deleteJobListing={deleteJobListing}
        />
      ))}
    </JobListingGrid>
  )
}

type MyJobListingCardProps = {
  jobListing: JobListing
  deleteJobListing: (id: string) => void
}

function MyJobListingCard({ jobListing, deleteJobListing }: MyJobListingCardProps) {
  const { isDark } = useThemeContext()
  const [selectedDuration, setSelectedDuration] = useState<(typeof JOB_LISTING_DURATIONS)[number]>()
  const [clientSecret, setClientSecret] = useState<string>()
  const status = getJobListingStatus(jobListing.expiresAt)

  return (
    <JobListingCard
      {...jobListing}
      headerDetails={
        <div>
          <Badge className='rounded' variant={getJobListingBadgeVariant(status)}>
            {status} {status === 'Active' && jobListing.expiresAt != null && ` - ${getDaysRemainingText(jobListing.expiresAt)}`}
          </Badge>
        </div>
      }
      footerBtns={
        <>
          <DeleteJobListingDialog deleteListing={() => deleteJobListing(jobListing.id)} />
          <Button asChild variant='outline'>
            <Link to={`/jobs/${jobListing.id}/edit`}>Edit</Link>
          </Button>
          {/* Dialog cannot be inside dropdown since they both 'freeze' the UI */}
          <Dialog
            open={selectedDuration != null}
            onOpenChange={isOpen => {
              if (isOpen) return
              setSelectedDuration(undefined)
              setClientSecret(undefined)
            }}
          >
            <DialogContent>
              <DialogTitle>{getPurchaseButtonText(status)} {jobListing.title} for {selectedDuration} days</DialogTitle>
              <DialogDescription>This is a non-refundable purcahse</DialogDescription>
              {clientSecret != null && selectedDuration != undefined && (
                <Elements options={{ appearance: { theme: isDark ? 'night' : 'stripe' }, clientSecret }} stripe={stripePromise}>
                  <JobListingCheckoutForm amount={getJobListingPriceInCents(selectedDuration) / 100} />
                </Elements>
              )}
            </DialogContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>{getPurchaseButtonText(status)}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='p-2' align='end'>
                {JOB_LISTING_DURATIONS.map(duration => (
                  <DropdownMenuItem
                    key={duration}
                    onClick={async () => {
                      setSelectedDuration(duration)
                      const { clientSecret } = await createPublishPaymentIntent(jobListing.id, duration)
                      setClientSecret(clientSecret)
                    }}
                  >
                    {duration} Days - {formatCurrency(getJobListingPriceInCents(duration) / 100)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </Dialog>
        </>
      }
    />
  )
}

type DeleteJobListingDialogProps = {
  deleteListing: () => void
}

function DeleteJobListingDialog({ deleteListing }: DeleteJobListingDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='ghost'>Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this job listing?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your job listing and any remaining time will not be refunded.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteListing}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// date-fns
function getJobListingStatus(expiresAt: Date | null) {
  if (expiresAt == null) {
    return 'Draft'
  } else if (isAfter(expiresAt, new Date())) {
    return 'Active'
  } else {
    return 'Expired'
  }
}

function getDaysRemainingText(expiresAt: Date) {
  return `${formatDistanceStrict(expiresAt, new Date(), { unit: 'day' })} left`
}

function getPurchaseButtonText(status: ReturnType<typeof getJobListingStatus>) {
  switch (status) {
    case 'Draft':
      return 'Publish'
    case 'Active':
      return 'Extend'
    case 'Expired':
      return 'Republish'
  }
}

function getJobListingBadgeVariant(status: ReturnType<typeof getJobListingStatus>) {
  switch (status) {
    case 'Draft':
      return 'secondary'
    case 'Active':
      return 'default'
    case 'Expired':
      return 'destructive'
  }
}

function sortJobListings(a: JobListing, b: JobListing) {
  if (a.expiresAt === b.expiresAt) {
    return 0
  } else if (a.expiresAt === null) {
    return -1
  } else if (b.expiresAt === null) {
    return 1
  } else {
    return differenceInDays(a.expiresAt, b.expiresAt)
  }
}