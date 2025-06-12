"use client"

import Link from "next/link"
import { CarIcon } from "./icons"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"

export default function Header() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const isAdmin = session?.user?.email === "seu@email.com" // TODO: mover para .env ou variável global

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
    <header className="fixed w-full bg-white dark:bg-gray-900 bg-opacity-90 z-50 shadow-sm backdrop-blur">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center text-2xl font-bold text-blue-600 hover:opacity-90 transition"
            aria-label="Auto Care - Home"
          >
            <CarIcon className="w-6 h-6 mr-2" />
            Auto Care
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-5 text-sm font-medium">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
              >
                {label}
              </Link>
            ))}

            {isAdmin && (
              <Link href="/admin" className="text-orange-500 hover:text-orange-600 transition">
                Admin
              </Link>
            )}

            {!session ? (
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 underline transition"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-600 underline transition"
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
