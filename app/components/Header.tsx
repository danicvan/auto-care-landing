"use client"

import Link from "next/link"
import { CarIcon } from "./icons"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"

export default function Header() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const isAdmin = session?.user?.email === "seu@email.com"

  const logout = () => supabase.auth.signOut()

  const navLinks = [
    { href: "#sobre", label: "Sobre" },
    { href: "#servicos", label: "Serviços" },
    { href: "#recursos", label: "Recursos" },
    { href: "#planos", label: "Planos" },
    { href: "#depoimentos", label: "Depoimentos" },
    { href: "#faq", label: "FAQ" },
    { href: "#contato", label: "Contato" },
  ]

  return (
    <header className="fixed w-full bg-white dark:bg-gray-900/95 shadow-md backdrop-blur z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <CarIcon className="w-7 h-7 mr-2" />
            Auto Care
          </Link>

          {/* Navegação Desktop */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:underline underline-offset-4 transition"
              >
                {label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                href="/admin"
                className="text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 transition"
              >
                Admin
              </Link>
            )}

            {!session ? (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition shadow-sm"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600 transition shadow-sm"
              >
                Sair
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
