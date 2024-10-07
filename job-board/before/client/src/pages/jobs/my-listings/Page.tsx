import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/PageHeader';
import { Link } from 'react-router-dom';

export function MyJobListingsPage() {
  return (
    <PageHeader
      btnSection={
        <Button asChild variant='outline'>
          <Link to='/jobs/new'>
            Create Listing
          </Link>
        </Button>
      }
    >
      My Job Listings
    </PageHeader>
  )
}
