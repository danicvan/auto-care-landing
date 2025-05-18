// pages/login.tsx
import { useSupabaseClient } from "@supabase/auth-helpers-react"

export default function Login() {
  const supabase = useSupabaseClient()

  const login = async () => {
    await supabase.auth.signInWithOtp({ email: prompt("Digite seu e-mail")! })
    alert("Verifique seu e-mail para o link de acesso.")
  }

  return <button onClick={login}>Entrar com e-mail</button>
}
