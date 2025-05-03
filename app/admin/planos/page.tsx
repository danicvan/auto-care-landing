'use client'

import { useEffect, useState } from 'react'

export default function PlansAdminPage() {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [isAnnual, setIsAnnual] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [plans, setPlans] = useState<any[]>([])

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/plans/list')
      const data = await res.json()
      setPlans(data || [])
    } catch (err) {
      console.error('Erro ao carregar planos:', err)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResponse(null)
    setError(null)

    try {
      const res = await fetch('/api/stripe/create-or-ensure-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: parseFloat(amount),
          isAnnual,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar plano')

      setResponse(`✅ Plano cadastrado com sucesso!`)
      setName('')
      setAmount('')
      setIsAnnual(false)
      fetchPlans()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Administração de Planos</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do Plano</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isAnnual}
            onChange={(e) => setIsAnnual(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm">Plano Anual</label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cadastrar Plano
        </button>
      </form>
      {response && <p className="text-green-600">{response}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  )
}
