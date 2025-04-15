import { CheckCircleIcon } from "./icons"

const features = [
  "Tecnologia de ponta para limpeza eficiente",
  "Produtos ecológicos e biodegradáveis",
  "Equipe altamente treinada e especializada",
  "Agendamento online fácil e rápido",
  "Atendimento personalizado para cada veículo",
  "Garantia de satisfação em todos os serviços",
]

export default function Features() {
  return (
    <section id="recursos" className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center">Nossos Diferenciais</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <CheckCircleIcon className="w-6 h-6 text-blue-500 mr-4" />
              <p className="text-lg">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
