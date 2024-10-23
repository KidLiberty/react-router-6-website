import { loadStripe } from '@stripe/stripe-js'
import { env } from '@/constants/config'

export const stripePromise = loadStripe(env.VITE_STRIPE_PUBLISHABLE_KEY)