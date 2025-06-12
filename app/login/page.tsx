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
      setMessage("📩 Verifique seu e-mail para continuar o login.")
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">Entrar</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Digite seu e-mail para receber um link de acesso.
        </p>

        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
        />

        <button
          onClick={handleLogin}
          disabled={loading || !email}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
        >
          {loading ? "Enviando link..." : "Entrar com e-mail"}
        </button>

        {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </main>
  )
}
