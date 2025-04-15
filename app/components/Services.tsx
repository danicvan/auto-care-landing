import { CarIcon, DropletIcon, SprayIcon, ShieldIcon } from "./icons"

const services = [
  {
    icon: <CarIcon className="w-12 h-12 mb-4 text-blue-500" />,
    title: "Lavagem Completa",
    description: "Limpeza profunda interna e externa do seu veículo.",
  },
  {
    icon: <DropletIcon className="w-12 h-12 mb-4 text-blue-500" />,
    title: "Polimento",
    description: "Restaure o brilho original da pintura do seu carro.",
  },
  {
    icon: <SprayIcon className="w-12 h-12 mb-4 text-blue-500" />,
    title: "Higienização",
    description: "Limpeza profunda e desinfecção do interior do veículo.",
  },
  {
    icon: <ShieldIcon className="w-12 h-12 mb-4 text-blue-500" />,
    title: "Proteção de Pintura",
    description: "Aplicação de cera ou cerâmica para proteger a pintura.",
  },
]

export default function Services() {
  return (
    <section id="servicos" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center">Nossos Serviços</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
              {service.icon}
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
