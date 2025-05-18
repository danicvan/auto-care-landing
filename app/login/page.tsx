"use client"

import { useSupabaseClient } from "@supabase/auth-helpers-react"

export default function LoginPage() {
  const supabase = useSupabaseClient()

  const handleLogin = async () => {
    const email = prompt("Digite seu e-mail para login:")
    if (!email) return
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert("Erro: " + error.message)
    else alert("Verifique seu e-mail para continuar")
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
