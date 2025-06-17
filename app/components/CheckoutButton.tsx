"use client"

import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutButtonProps {
  priceId: string
  isAnnual: boolean
}

export function CheckoutButton({ priceId, isAnnual }: CheckoutButtonProps) {
  const handleSubscribe = async () => {
    try {
      const res = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, isAnnual }),
      })

      const data = await res.json()

      if (!data.sessionId) {
        alert("Erro ao criar assinatura.")
        return
      }

      const stripe = await stripePromise
      await stripe?.redirectToCheckout({ sessionId: data.sessionId })
    } catch (err) {
      console.error("Erro no handleSubscribe:", err)
      alert("Erro ao redirecionar para o checkout.")
    }
  }

  return (
    <button
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleSubscribe}
    >
      Assinar agora
    </button>
  )
}
