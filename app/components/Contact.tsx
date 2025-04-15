import { PhoneIcon, MailIcon, MapPinIcon } from "./icons"

export default function Contact() {
  return (
    <section id="contato" className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8 text-center">Entre em Contato</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Informações de Contato</h3>
            <div className="space-y-4">
              <p className="flex items-center">
                <PhoneIcon className="w-6 h-6 mr-2 text-blue-500" />
                (11) 1234-5678
              </p>
              <p className="flex items-center">
                <MailIcon className="w-6 h-6 mr-2 text-blue-500" />
                contato@autocare.com
              </p>
              <p className="flex items-center">
                <MapPinIcon className="w-6 h-6 mr-2 text-blue-500" />
                Av. Paulista, 1000 - São Paulo, SP
              </p>
            </div>
            <div className="mt-8">
              <h4 className="text-xl font-bold mb-2">Horário de Funcionamento</h4>
              <p>Segunda a Sexta: 8h às 18h</p>
              <p>Sábado: 9h às 14h</p>
              <p>Domingo: Fechado</p>
            </div>
          </div>
          <div>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
