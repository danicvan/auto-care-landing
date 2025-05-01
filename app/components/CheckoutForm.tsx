'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const params = useSearchParams();

  const priceId = params.get("priceId");
  const isAnnual = params.get("isAnnual") === "true";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!priceId) {
      setError("ID do plano não encontrado.");
      setLoading(false);
      return;
    }

    const res = await fetch('/api/stripe/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: "00000000-0000-0000-0000-000000000000",
        email: "cliente@exemplo.com",
        price_id: priceId,
      }),
    });

    const data = await res.json();

    if (!stripe || !elements || !data.clientSecret) {
      setError('Erro ao iniciar pagamento.');
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
      setSuccess(true);
      window.location.href = "/success";
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Resumo da Assinatura</h2>
      <div className="mb-4 text-gray-700">
        <p><strong>Plano:</strong> {isAnnual ? 'Anual' : 'Mensal'}</p>
        <p><strong>ID do Preço:</strong> {priceId}</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-600">Dados do Cartão</label>
        <div className="border rounded p-3 shadow-sm bg-gray-50">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#32325d',
                '::placeholder': {
                  color: '#a0aec0',
                },
              },
              invalid: {
                color: '#e53e3e',
              },
            },
          }} />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">Pagamento concluído com sucesso!</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold transition disabled:opacity-50"
      >
        {loading ? "Processando..." : "Confirmar Pagamento"}
      </button>
    </form>
  );
}
