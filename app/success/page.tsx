'use client'

import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Pagamento realizado com sucesso!</h1>
        <p className="mb-2">Session ID: {sessionId}</p>
        <p className="text-sm text-gray-600">Você receberá um e-mail com os detalhes da assinatura.</p>
      </div>
    </div>
  );
}