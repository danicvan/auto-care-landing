"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"
  const code = searchParams.get("code")

  useEffect(() => {
    const supabase = createPagesBrowserClient()

    const finishSignIn = async () => {
      if (!code) {
        console.error("Missing authentication code in URL")
        router.replace("/login?error=missing-code")
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error finishing sign-in:", error.message)
        router.replace("/login?error=auth")
      } else {
        router.replace(redirectTo)
      }
    }

    finishSignIn()
  }, [router, redirectTo, code])

  return <p className="text-center mt-8">Finalizing login...</p>
}