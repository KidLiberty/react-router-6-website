import { Banknote, CalendarDays, ExternalLink, GraduationCap } from 'lucide-react'

import { JobListing } from '../constants/types'
import { formatCurrency } from '@/utils/formatters'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'

type JobListingFullDialogProps = Pick<JobListing, 'title' | 'companyName' | 'location' | 'salary' | 'type' | 'experienceLevel' | 'applyUrl' | 'description'>

export function JobListingFullDialog({ title, companyName, location, salary, type: jobType, experienceLevel, applyUrl, description }: JobListingFullDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View more</Button>
      </DialogTrigger>
      {/* 2rem less than the full height of our screen */}
      <DialogContent className='max-h-[calc(100vh-2rem)] max-w-3xl w-[calc(100vw-2rem)] flex flex-col'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className='flex flex-col'>
            <div>{companyName}</div>
            <div>{location}</div>
          </DialogDescription>
          <div className='flex gap-1 flex-wrap'>
            <Badge className='flex gap-1 whitespace-nowrap' variant='secondary'>
              <Banknote className='w-4 h-4' /> {formatCurrency(salary)}
            </Badge>
            <Badge className='flex gap-1 whitespace-nowrap' variant='secondary'>
              <CalendarDays className='w-4 h-4' /> {jobType}
            </Badge>
            <Badge className='flex gap-1 whitespace-nowrap' variant='secondary'>
              <GraduationCap className='w-4 h-4' /> {experienceLevel}
            </Badge>
          </div>
        </DialogHeader>
        <div>
          <Button asChild>
            <a href={applyUrl} target='_blank'>
              Apply on company site
              <ExternalLink className='w-4 h-4 ml-2' />
            </a>
          </Button>
        </div>
        <MarkdownRenderer className='overflow-auto'>
          {description}
        </MarkdownRenderer>
      </DialogContent>
    </Dialog>
  )
}
