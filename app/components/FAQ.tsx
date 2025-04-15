"use client"

import { useState } from "react"
import { AnimatePresence } from "./animation"

const faqs = [
  {
    question: "Com que frequência posso lavar meu carro com uma assinatura?",
    answer:
      "A frequência depende do plano escolhido. O Básico permite lavagens mensais, o Premium quinzenais e o Ultimate semanais.",
  },
  {
    question: "Posso cancelar minha assinatura a qualquer momento?",
    answer:
      "Sim, você pode cancelar sua assinatura a qualquer momento sem penalidades. Seu serviço continuará até o final do ciclo de faturamento atual.",
  },
  {
    question: "Vocês oferecem serviços adicionais não incluídos na assinatura?",
    answer:
      "Sim, oferecemos uma variedade de serviços adicionais como correção de pintura, revestimento cerâmico e limpeza profunda do interior. Estes podem ser adicionados à sua assinatura ou comprados separadamente.",
  },
  {
    question: "Quanto tempo leva uma lavagem típica de carro?",
    answer:
      "Uma lavagem exterior padrão geralmente leva cerca de 15-20 minutos. Serviços de detalhamento completo podem levar de 2 a 3 horas, dependendo do tamanho e condição do veículo.",
  },
]

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8 text-center">Perguntas Frequentes</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <span className="text-lg font-medium">{faq.question}</span>
                <svg
                  className={`w-6 h-6 transition-transform duration-300 ${activeIndex === index ? "transform rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <AnimatePresence show={activeIndex === index}>
                <div className="mt-2">
                  <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </div>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
