import Link from "next/link"
import { CarIcon } from "./icons"

export default function Header() {
  return (
    <header className="fixed w-full bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 z-50">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center text-2xl font-bold text-blue-500">
            <CarIcon className="w-6 h-6 mr-2" />
            Auto Care
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link href="#sobre" className="hover:text-blue-500 transition-colors">
              Sobre
            </Link>
            <Link href="#servicos" className="hover:text-blue-500 transition-colors">
              Serviços
            </Link>
            <Link href="#recursos" className="hover:text-blue-500 transition-colors">
              Recursos
            </Link>
            <Link href="#planos" className="hover:text-blue-500 transition-colors">
              Planos
            </Link>
            <Link href="#depoimentos" className="hover:text-blue-500 transition-colors">
              Depoimentos
            </Link>
            <Link href="#faq" className="hover:text-blue-500 transition-colors">
              FAQ
            </Link>
            <Link href="#contato" className="hover:text-blue-500 transition-colors">
              Contato
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
