'use client'

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const params = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priceId = params.get("priceId");
  const isAnnual = params.get("isAnnual");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch('/api/stripe/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: "00000000-0000-0000-0000-000000000000", // Troque pelo user logado
        email: "cliente@exemplo.com", // Troque pelo email do user logado
        price_id: priceId,
      }),
    });

    const data = await res.json();

    if (!stripe || !elements || !data.clientSecret) {
      setError('Erro ao processar pagamento.');
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (result.error) {
      setError(result.error.message || 'Erro no pagamento');
    } else if (result.paymentIntent?.status === 'succeeded') {
      window.location.href = "/success";
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <CardElement />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        disabled={!stripe || loading}
      >
        {loading ? 'Processando...' : 'Pagar'}
      </button>
    </form>
  );
}
