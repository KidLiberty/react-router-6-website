import { useState } from 'react'
import { Control, FieldValues, type Path, type PathValue, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { jobListingFormSchema } from '@backend/constants/schemas/jobListings'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { JOB_LISTING_EXPERIENCE_LEVELS, JOB_LISTING_TYPES } from '@backend/constants/types'
import { JobListingGrid } from './JobListingGrid'
import { JobListingCard } from './JobListingCard'
import { JobListingFullDialog } from './JobListingFullDialog'

type JobListingValues = z.infer<typeof jobListingFormSchema>

const DEFAULT_VALUES: JobListingValues = {
  title: '',
  companyName: '',
  location: '',
  applyUrl: '',
  type: 'Full Time',
  experienceLevel: 'Mid-Level',
  salary: NaN,
  shortDescription: '',
  description: ''
}

type JobListingFormProps = {
  onSubmit: (values: JobListingValues) => void
  initialJobListing?: JobListingValues
}

export function JobListingForm({ onSubmit, initialJobListing = DEFAULT_VALUES }: JobListingFormProps) {
  const form = useForm<JobListingValues>({
    resolver: zodResolver(jobListingFormSchema),
    defaultValues: initialJobListing
  })
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const jobListingValues = form.watch() // Returns all values from the current form

  return (
    <>
      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='companyName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='applyUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apply URL</FormLabel>
                  <FormControl>
                    <Input type='url' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <JobListingSelectFormField
              label='Type'
              options={JOB_LISTING_TYPES}
              control={form.control}
              name='type'
            />
            <JobListingSelectFormField
              label='Experience Level'
              options={JOB_LISTING_EXPERIENCE_LEVELS}
              control={form.control}
              name='experienceLevel'
            />
            <FormField
              control={form.control}
              name='salary'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={e => field.onChange(e.target.valueAsNumber)}
                      value={isNaN(field.value) ? '' : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='shortDescription'
              render={({ field }) => (
                <FormItem className='sm:col-span-2'>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>Max 200 Characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='col-span-full'>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>Supports full Markdown</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex gap-2 justify-end'>
            <Button type='button' variant='outline' onClick={() => setIsPreviewOpen(prevIsPreviewOpen => !prevIsPreviewOpen)}>
              {isPreviewOpen ? 'Close' : 'Show'} Preview
            </Button>
            <Button type='submit' disabled={!form.formState.isValid || form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <LoadingSpinner /> : 'Save'}
            </Button>
          </div>
        </form>
      </Form>
      {isPreviewOpen && (
        // Render the grid to ensure we have the right dimensions
        <JobListingGrid className='mt-12'>
          <JobListingCard {...jobListingValues} footerBtns={<JobListingFullDialog {...jobListingValues} />} />
        </JobListingGrid>
      )}
    </>
  )
}

type JobListingSelectFormFieldProps<T extends FieldValues> = {
  label: string
  control: Control<T>
  name: Path<T>
  options: readonly PathValue<T, Path<T>>[]
}

function JobListingSelectFormField<T extends FieldValues>({ label, control, name, options }: JobListingSelectFormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={val => field.onChange(val as PathValue<T, Path<T>>)} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {options.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}