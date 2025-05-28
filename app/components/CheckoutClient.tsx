'use client';

import { loadStripe } from "@stripe/stripe-js";
import { Elements, type StripeElementsOptions } from "@stripe/react-stripe-js";
import { CheckoutForm } from "@/app/components/CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function CheckoutClient({
  clientSecret,
  subscriptionId,
}: {
  clientSecret: string;
  subscriptionId: string;
}) {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: { theme: "stripe" }, // ou "night", "flat"
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm clientSecret={clientSecret} subscriptionId={subscriptionId} />
    </Elements>
  );
}