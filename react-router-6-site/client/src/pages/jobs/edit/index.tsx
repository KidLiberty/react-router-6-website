import { PrivatePage } from '@/components/routing/PrivatePage';
import { loader } from './loader';
import { EditJobListingPage } from './Page';

export const editJobListingRoute = {
  loader,
  element: (
    <PrivatePage>
      <EditJobListingPage />
    </PrivatePage>
  )
}