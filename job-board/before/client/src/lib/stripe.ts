import { loadStripe } from '@stripe/stripe-js'
import { env } from '@/constants/config'

const stripePromise = loadStripe(env.VITE_STRIPE_PUBLISHABLE_KEY)