import { ReactNode } from 'react';
import { Await as AwaitReactRouter, type AwaitProps as AwaitPropsReactRouter, defer, useLoaderData, LoaderFunctionArgs } from 'react-router-dom';

// Library extensions

// Return to us some type of data T, where this data will be a Promise
export function deferredLoader<T extends Record<string, unknown>>(dataFunc: (args: LoaderFunctionArgs) => T) {
  return (args: LoaderFunctionArgs) => {
    return defer(dataFunc(args)) as Omit<ReturnType<typeof defer>, 'data'> & { data: T }
  }
}

// Get the data of type T, which is going to be a Promise
export function useDeferredLoaderData<T extends ReturnType<typeof deferredLoader>>() {
  return useLoaderData() as ReturnType<T>['data']
}

// Get the Promise of data we have and get the return value of it
type AwaitProps<T> = Omit<AwaitPropsReactRouter, 'children' | 'resolve'> & {
  children: (data: Awaited<T>) => ReactNode
  resolve: Promise<T>
}

// Now we can use this custom Await instead of the one built into React Router
export function Await<T>(props: AwaitProps<T>) {
  return <AwaitReactRouter {...props} />
}