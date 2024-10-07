import { z } from 'zod'

import { jobListingFormSchema } from '@backend/constants/schemas/jobListings'
import { baseApi } from '@/services/baseApi'
import { jobListingSchema } from '../constants/schemas'

export function createJobListing(data: z.infer<typeof jobListingFormSchema>) {
  return baseApi
    .post('/job-listings', data)
    .then(res => jobListingSchema.parseAsync(res.data))
}

export function getAllMyListings() {
  return baseApi
    .get('/job-listings/my-listings')
    .then(res => z.array(jobListingSchema).parseAsync(res.data))
}