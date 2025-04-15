"use client"

import { Fade } from "./animation"
import Image from "next/image"

const testimonials = [
  {
    name: "Carlos Silva",
    role: "Empresário",
    content:
      "A Auto Care transformou completamente o cuidado com meu carro. O serviço é impecável e a conveniência é incomparável.",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
  {
    name: "Ana Oliveira",
    role: "Advogada",
    content:
      "Desde que comecei a usar os serviços da Auto Care, meu carro parece novo o tempo todo. A equipe é profissional e atenciosa.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
  {
    name: "Pedro Santos",
    role: "Médico",
    content:
      "A assinatura da Auto Care é perfeita para minha agenda lotada. Não preciso me preocupar com a manutenção do meu carro.",
    image:
      "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
]

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center">O que nossos clientes dizem</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Fade
              key={index}
              direction="up"
              delay={index * 100}
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-4">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={64}
                  height={64}
                  className="rounded-full mr-4"
                />
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                </div>
              </div>
              <p className="italic">"{testimonial.content}"</p>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  )
}
