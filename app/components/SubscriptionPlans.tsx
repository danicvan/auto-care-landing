"use client"

import { useState } from "react"
import { Fade } from "./animation"
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Básico",
    price: 199.99,
    features: ["Lavagem Exterior Mensal", "Brilho nos Pneus", "Aspiração do Interior"],
    recommended: false,
  },
  {
    name: "Premium",
    price: 349.99,
    features: ["Lavagem Exterior Quinzenal", "Brilho nos Pneus", "Aspiração do Interior", "Tratamento de Cera"],
    recommended: true,
  },
  {
    name: "Ultimate",
    price: 599.99,
    features: [
      "Lavagem Exterior Semanal",
      "Brilho nos Pneus",
      "Detalhamento Completo do Interior",
      "Tratamento de Cera",
      "Proteção de Pintura",
    ],
    recommended: false,
  },
]

export default function SubscriptionPlans() {
  const [isAnnual, setIsAnnual] = useState(false);
  const router = useRouter();

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const getDiscountedPrice = (price: number) => {
    const discountedPrice = isAnnual ? price * 0.9 * 12 : price
    return formatPrice(discountedPrice)
  }

  const handleCheckoutPage = () => {
    router.push('/checkout');
  }
  
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
          <span className={`ml-2 ${isAnnual ? "font-bold" : "text-gray-500"}`}>Anual (10% de desconto)</span>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Fade
              key={plan.name}
              direction="up"
              delay={index * 100}
              className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-8 shadow-xl relative ${
                plan.recommended ? "border-2 border-blue-500" : ""
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 rounded-bl-lg rounded-tr-lg">
                  Recomendado
                </div>
              )}
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <p className="text-4xl font-bold mb-6">
                {getDiscountedPrice(plan.price)}
                <span className="text-xl font-normal">/{isAnnual ? "ano" : "mês"}</span>
              </p>
              <ul className="mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors"
                onClick={handleCheckoutPage}
              >
                Escolher Plano
              </button>
              <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
                Faturamento mensal com contrato anual
              </p>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  )
}
