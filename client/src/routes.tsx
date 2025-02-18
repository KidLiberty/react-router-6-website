import { Navigate, RouteObject } from 'react-router-dom'

import { RootLayout } from '@/layouts/RootLayout'
import { AuthLayout, LoginForm, SignupForm } from '@/features/authentication'

import { ErrorPage } from '@/pages/ErrorPage'
import { TaskListPage } from '@/pages/tasks/TaskListPage'
import { NewTaskPage } from '@/pages/tasks/NewTaskPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { myJobListingsRoute } from '@/pages/jobs/my-listings'
import { NewJobListingsPage } from '@/pages/jobs/NewJobListingPage'
import { editJobListingRoute } from '@/pages/jobs/edit'
import { OrderCompleteRoute } from './pages/jobs/order-complete'
import { jobListingsIndexRoute } from './pages/jobs/index/index'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Navigate to='/tasks' replace /> },
          {
            path: 'tasks',
            children: [
              { index: true, element: <TaskListPage /> },
              { path: 'new', element: <NewTaskPage /> },
            ],
          },
          {
            path: 'jobs',
            children: [
              { index: true, ...jobListingsIndexRoute },
              { path: 'my-listings', ...myJobListingsRoute },
              { path: 'new', element: <NewJobListingsPage /> },
              { path: ':id/edit', ...editJobListingRoute },
              { path: 'order-complete', ...OrderCompleteRoute }
            ]
          },
          {
            element: <AuthLayout />,
            children: [
              { path: 'signup', element: <SignupForm /> },
              { path: 'login', element: <LoginForm /> }
            ]
          },
          { path: '*', element: <NotFoundPage /> }
        ],
      },
    ],
  },
]
