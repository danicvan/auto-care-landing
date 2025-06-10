"use client"

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function LoginPage() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"

  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      router.push(redirectTo)
    }
  }, [user, redirectTo, router])

  const handleLogin = async () => {
    setMessage(null)
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`
      }
    })

    if (error) {
      setError("Erro: " + error.message)
    } else {
      setMessage("Verifique seu e-mail para continuar o login.")
    }

    setLoading(false)
  }

  return (
    <main className="p-10 text-center max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Entrar</h1>

      <input
        type="email"
        placeholder="Seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 p-2 w-full rounded mb-4"
      />

      <button
        onClick={handleLogin}
        disabled={loading || !email}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Login com e-mail"}
      </button>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </main>
  )
}
