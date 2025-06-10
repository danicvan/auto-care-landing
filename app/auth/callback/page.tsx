"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"
  const code = searchParams.get("code") || ""  // pega o código da URL

  useEffect(() => {
    const supabase = createPagesBrowserClient()

    const finishSignIn = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession()

      if (error) {
        console.error("Erro ao finalizar login:", error.message)
        router.replace("/login?error=auth")
      } else {
        router.replace(redirectTo)
      }
    }

    finishSignIn()
  }, [router, redirectTo, code])

  return <p className="text-center mt-8">Finalizando login...</p>
}
