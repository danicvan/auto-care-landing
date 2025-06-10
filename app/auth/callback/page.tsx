"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"

  useEffect(() => {
    const supabase = createPagesBrowserClient()

    const finishSignIn = async () => {
      await supabase.auth.getSession() // importante para gravar o cookie
      router.replace(redirectTo)
    }

    finishSignIn()
  }, [router, redirectTo])

  return <p className="text-center mt-8">Finalizando login...</p>
}
