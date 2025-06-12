"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"

export default function AuthCallback() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createPagesBrowserClient()

    const finishSignIn = async () => {
      const url = new URL(window.location.href)
      const code = url.searchParams.get("code")

      if (!code) {
        console.error("❌ Código ausente")
        router.replace("/login?error=missing-code")
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("❌ Erro ao autenticar:", error.message)
        router.replace("/login?error=auth")
        return
      }

      // Redireciona para o path após "/auth/callback"
      const redirectPath = pathname.replace("/auth/callback", "") || "/"
      router.replace(redirectPath)
    }

    finishSignIn()
  }, [router, pathname])

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Autenticando...</p>
    </main>
  )
}
