import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { JOB_LISTING_EXPERIENCE_LEVELS, JOB_LISTING_TYPES } from '@backend/constants/types'
import { JobListing } from '../constants/types'

// Client handled so define schema here
const jobListingFilterSchema = z.object({
  title: z.string(),
  location: z.string(),
  minimumSalary: z.number().or(z.nan()),
  type: z.enum(JOB_LISTING_TYPES).or(z.literal('')),
  experienceLevel: z.enum(JOB_LISTING_EXPERIENCE_LEVELS).or(z.literal('')),
  showHidden: z.boolean(),
  onlyShowFavorites: z.boolean()
})

export type JobListingFilterFormValues = z.infer<typeof jobListingFilterSchema>

export function useJobListingFilterForm() {
  const form = useForm<JobListingFilterFormValues>({
    resolver: zodResolver(jobListingFilterSchema),
    mode: 'onChange', // Not submitting anything so update list as soon as information is entered
    defaultValues: {
      title: '',
      experienceLevel: '',
      location: '',
      minimumSalary: 0,
      onlyShowFavorites: false,
      showHidden: false,
      type: ''
    }
  })
  const values = form.watch()

  function getFilteredJobs(jobListings: JobListing[], hiddenIds: string[], favoriteIds: string[]) {
    return jobListings.filter(jobListing => {
      if (!jobListing.title.toLowerCase().match(values.title.toLowerCase())) {
        return false
      }

      if (!jobListing.location.toLowerCase().match(values.location.toLowerCase())) {
        return false
      }

      // If salary is a number and it's greater than our search criteria
      if (!isNaN(values.minimumSalary) && jobListing.salary < values.minimumSalary) {
        return false
      }

      if (values.type !== '' && jobListing.type !== values.type) {
        return false
      }

      if (values.experienceLevel !== '' && jobListing.experienceLevel !== values.experienceLevel) {
        return false
      }

      if (!values.showHidden && hiddenIds.includes(jobListing.id)) {
        return false
      }

      if (values.onlyShowFavorites && !favoriteIds.includes(jobListing.id)) {
        return false
      }

      return true
    })
  }

  return { form, getFilteredJobs }
}