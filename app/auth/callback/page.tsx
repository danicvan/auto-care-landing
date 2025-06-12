"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createPagesBrowserClient()

    const finishSignIn = async () => {
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

      router.replace("/") // ou qualquer página padrão
    }

    finishSignIn().finally(() => setLoading(false))
  }, [router, code])

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      {loading ? (
        <p className="text-center text-lg">Autenticando...</p>
      ) : null}
    </main>
  )
}
