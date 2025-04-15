"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

type Plan = {
  id: number
  name: string
  price: number
  features: string[]
  recommended: boolean
}

export default function PlansManager() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [savingPlan, setSavingPlan] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setError("Erro ao conectar com o Supabase. Verifique as variáveis de ambiente.")
      setLoading(false)
      return
    }

    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("plans").select("*").order("id")

      if (error) throw error

      setPlans(data || [])
    } catch (error: any) {
      setError(error.message || "Erro ao carregar planos")
    } finally {
      setLoading(false)
    }
  }

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan({ ...plan })
  }

  const handleSavePlan = async () => {
    if (!editingPlan || !supabase) return

    try {
      setSavingPlan(true)
      const { error } = await supabase
        .from("plans")
        .update({
          name: editingPlan.name,
          price: editingPlan.price,
          features: editingPlan.features,
          recommended: editingPlan.recommended,
        })
        .eq("id", editingPlan.id)

      if (error) throw error

      setPlans(plans.map((p) => (p.id === editingPlan.id ? editingPlan : p)))
      setEditingPlan(null)
    } catch (error: any) {
      setError(error.message || "Erro ao salvar plano")
    } finally {
      setSavingPlan(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingPlan(null)
  }

  const handleFeatureChange = (index: number, value: string) => {
    if (!editingPlan) return

    const newFeatures = [...editingPlan.features]
    newFeatures[index] = value

    setEditingPlan({
      ...editingPlan,
      features: newFeatures,
    })
  }

  const handleAddFeature = () => {
    if (!editingPlan) return

    setEditingPlan({
      ...editingPlan,
      features: [...editingPlan.features, ""],
    })
  }

  const handleRemoveFeature = (index: number) => {
    if (!editingPlan) return

    const newFeatures = [...editingPlan.features]
    newFeatures.splice(index, 1)

    setEditingPlan({
      ...editingPlan,
      features: newFeatures,
    })
  }

  if (loading) {
    return <div className="text-center py-8">Carregando planos...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Gerenciar Planos</h2>

      {plans.length === 0 ? (
        <p>Nenhum plano encontrado.</p>
      ) : (
        <div className="space-y-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <button
                  onClick={() => handleEditPlan(plan)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Editar
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Preço:</p>
                  <p>R${plan.price.toFixed(2).replace(".", ",")}</p>
                </div>
                <div>
                  <p className="font-semibold">Recomendado:</p>
                  <p>{plan.recommended ? "Sim" : "Não"}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="font-semibold mb-2">Recursos:</p>
                <ul className="list-disc pl-5">
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Editar Plano</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1">Nome</label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full p-2 border rounded-md dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block mb-1">Preço</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingPlan.price}
                  onChange={(e) => setEditingPlan({ ...editingPlan, price: Number.parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded-md dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block mb-1">Recomendado</label>
                <select
                  value={editingPlan.recommended ? "true" : "false"}
                  onChange={(e) => setEditingPlan({ ...editingPlan, recommended: e.target.value === "true" })}
                  className="w-full p-2 border rounded-md dark:bg-gray-700"
                >
                  <option value="false">Não</option>
                  <option value="true">Sim</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Recursos</label>
                {editingPlan.features.map((feature, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 p-2 border rounded-l-md dark:bg-gray-700"
                    />
                    <button
                      onClick={() => handleRemoveFeature(index)}
                      className="bg-red-500 text-white px-3 rounded-r-md"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button onClick={handleAddFeature} className="bg-green-500 text-white px-3 py-1 rounded-md mt-2">
                  Adicionar Recurso
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button onClick={handleCancelEdit} className="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded-md">
                Cancelar
              </button>
              <button
                onClick={handleSavePlan}
                disabled={savingPlan}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {savingPlan ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
