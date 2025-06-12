"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"
  const code = searchParams.get("code")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createPagesBrowserClient()

    const finishSignIn = async () => {
      if (!code) {
        console.error("❌ Código de verificação ausente na URL")
        router.replace("/login?error=missing-code")
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("❌ Erro ao finalizar login:", error.message)
        router.replace("/login?error=auth")
      } else {
        router.replace(redirectTo)
      }

      setLoading(false)
    }

    finishSignIn()
  }, [router, redirectTo, code])

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4">
      {loading ? (
        <div className="text-center">
          <p className="text-xl font-semibold">Autenticando...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Aguarde enquanto redirecionamos você
          </p>
        </div>
      ) : null}
    </main>
  )
}
