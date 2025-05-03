'use client';

import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get("subscriptionId");

  return (
    <main className="max-w-xl mx-auto py-20 px-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Pagamento confirmado! ✅</h1>
      <p className="text-lg">Obrigado por assinar nosso plano.</p>
      {subscriptionId && (
        <p className="mt-4 text-sm text-gray-500">
          ID da assinatura: <code>{subscriptionId}</code>
        </p>
      )}
    </main>
  );
}