export default function About() {
  return (
    <section id="sobre" className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8 text-center">Sobre a Auto Care</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg mb-4">
              A Auto Care é uma empresa de estética automotiva de ponta dedicada a manter seu veículo em condições
              impecáveis. Nossa tecnologia de última geração e equipe especializada garantem que seu carro sempre tenha
              a melhor aparência.
            </p>
            <p className="text-lg">
              Com nossos inovadores planos de assinatura, manter a aparência do seu carro nunca foi tão fácil ou
              acessível. Experimente a diferença Auto Care hoje!
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
              alt="Mercedes sendo lavada na Auto Care"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
