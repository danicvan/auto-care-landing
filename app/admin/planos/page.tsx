'use client'

import { useState } from 'react'

export default function PlansAdminPage() {
  const [amount, setAmount] = useState('')
  const [interval, setInterval] = useState('month')
  const [productId, setProductId] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResponse(null)
    setError(null)

    try {
      const res = await fetch('/api/stripe/create-or-get-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          amount: Math.round(parseFloat(amount) * 100),
          interval,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao registrar plano')
      }

      setResponse(`✅ Preço cadastrado com sucesso: ${data.priceId}`)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Planos (Stripe)</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ID do Produto (productId)</label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Valor (em R$)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Recorrência</label>
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="month">Mensal</option>
            <option value="year">Anual</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cadastrar Plano
        </button>
      </form>
      {response && <p className="mt-4 text-green-600">{response}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  )
}
