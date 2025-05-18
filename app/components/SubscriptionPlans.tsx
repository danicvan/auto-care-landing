"use client"

import { useEffect, useState } from "react"
import { Fade } from "./animation"
import { CheckoutButton } from "./CheckoutButton"
import { fetchPlans } from "@/lib/stripe/fetchPlans"
import { Plan } from "@/types/plan"

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isAnnual, setIsAnnual] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlans()
      .then((res) => {
        console.log("✅ Planos recebidos:", res)
        setPlans(res)
      })
      .catch((err) => {
        console.error("❌ Erro ao buscar planos:", err)
        setPlans([])
      })
      .finally(() => setLoading(false))
  }, [])  

  const filteredPlans = plans.filter((plan) => Boolean(plan.is_annual) === isAnnual)

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })

  return (
    <section id="planos" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8 text-center">Planos de Assinatura</h2>

        <div className="flex justify-center items-center mb-8">
          <span className={`mr-2 ${isAnnual ? "text-gray-500" : "font-bold"}`}>Mensal</span>
          <button
            className={`w-14 h-7 flex items-center rounded-full p-1 ${
              isAnnual ? "bg-blue-500 justify-end" : "bg-gray-300 justify-start"
            }`}
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <div className="bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300" />
          </button>
          <span className={`ml-2 ${isAnnual ? "font-bold" : "text-gray-500"}`}>Anual</span>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Carregando planos...</p>
        ) : filteredPlans.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum plano encontrado.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {filteredPlans.map((plan, index) => (
              <Fade
                key={plan.id}
                direction="up"
                delay={index * 100}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 shadow-xl relative"
              >
                <h3 className="text-2xl font-bold mb-4">
                  {plan.is_annual ? "Plano Anual" : "Plano Mensal"}
                </h3>
                <p className="text-4xl font-bold mb-6">
                  {formatPrice(plan.amount)}
                  <span className="text-xl font-normal">/{isAnnual ? "ano" : "mês"}</span>
                </p>

                <ul className="mb-8">
                  <li className="mb-2 flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Benefício 1 incluso
                  </li>
                </ul>

                <CheckoutButton priceId={plan.price_id} isAnnual={plan.is_annual} />

                <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
                  Pagamento recorrente no Stripe
                </p>
              </Fade>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}