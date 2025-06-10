"use client"

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"

  // Se o usuário já estiver logado, redireciona imediatamente
  useEffect(() => {
    if (user) {
      router.push(redirectTo)
    }
  }, [user, redirectTo, router])

  const handleLogin = async () => {
    const email = prompt("Digite seu e-mail para login:")
    if (!email) return

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`
      }
    })

    if (error) alert("Erro: " + error.message)
    else alert("Verifique seu e-mail para continuar o login")
  }

  return (
    <main className="p-10 text-center">
      <h1 className="text-2xl mb-6">Entrar</h1>
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
        Login com e-mail
      </button>
    </main>
  )
}
