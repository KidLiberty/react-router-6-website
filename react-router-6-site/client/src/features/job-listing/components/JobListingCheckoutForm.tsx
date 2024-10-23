import { FormEvent, useState } from 'react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/formatters'

type JobListingCheckoutFormProps = {
  amount: number
}

export function JobListingCheckoutForm({ amount }: JobListingCheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (stripe == null || elements == null) return

    setLoading(true)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/jobs/order-complete`
      }
    })

    if (error.type === "card_error" || error.type === "validation_error") {
      setErrorMessage(error.message)
    } else {
      setErrorMessage("An unexpected error occurred.")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage != null && (
        <p className='mb-4 text-sm text-red-500 dark:text-red-900'>{errorMessage}</p>
      )}
      <PaymentElement />
      <Button className='w-full mt-4' disabled={loading || stripe == null || elements == null}>
        Pay {formatCurrency(amount)}
      </Button>
    </form>
  )
}