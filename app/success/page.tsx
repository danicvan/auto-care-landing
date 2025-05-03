'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [subscription, setSubscription] = useState<{
    status: string;
    current_period_end: number;
    plan: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get('subscriptionId');

  useEffect(() => {
    if (!subscriptionId) return;

    fetch(`/api/success?subscriptionId=${subscriptionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setSubscription(data);
        }
      })
      .catch(() => {
        setError('Erro ao verificar a assinatura');
      });
  }, [subscriptionId]);

  if (error) {
    return (
      <main className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-600">{error}</h1>
      </main>
    );
  }

  if (!subscription) {
    return (
      <main className="text-center py-10">
        <p className="text-lg">Verificando assinatura...</p>
      </main>
    );
  }

  const date =
    subscription.current_period_end && !isNaN(subscription.current_period_end)
      ? new Date(subscription.current_period_end * 1000).toLocaleDateString('pt-BR')
      : 'Desconhecida';

  return (
    <main className="text-center py-10">
      <h1 className="text-3xl font-bold text-green-600">Assinatura confirmada! ✅</h1>
      <p className="mt-4 text-lg">Plano: <strong>{subscription.plan}</strong></p>
      <p className="mt-2 text-md">Status: <strong>{subscription.status}</strong></p>
      <p className="mt-2 text-md">Renovação em: <strong>{date}</strong></p>
    </main>
  );
}