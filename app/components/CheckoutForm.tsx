'use client';

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

interface Props {
  clientSecret: string;
  subscriptionId: string;
}

export function CheckoutForm({ clientSecret, subscriptionId }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success?subscriptionId=${subscriptionId}`,
      },
    });

    if (error) {
      setMessage(error.message ?? "Ocorreu um erro no pagamento.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
      >
        {loading ? "Processando..." : "Pagar"}
      </button>
      {message && (
        <div className="text-red-500 text-sm text-center mt-2">{message}</div>
      )}
    </form>
  );
}