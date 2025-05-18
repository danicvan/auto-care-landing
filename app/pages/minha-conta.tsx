"use client"

import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useEffect, useState } from "react"

export default function MinhaContaPage() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    if (!session) return

    supabase
      .from("subscriptions")
      .select("*")
      .eq("email", session.user.email)
      .single()
      .then(({ data }) => {
        setSubscription(data)
      })
  }, [session])

  if (!session) return <p className="p-10">Você precisa estar logado.</p>

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Minha Conta</h1>
      {subscription ? (
        <div>
          <p><strong>Plano:</strong> {subscription.plan}</p>
          <p><strong>Status:</strong> {subscription.status}</p>
          <p><strong>Válido até:</strong> {new Date(subscription.current_period_end * 1000).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>Nenhuma assinatura encontrada.</p>
      )}

        <button
        onClick={async () => {
            const res = await fetch("/api/stripe/portal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session.user.email }),
            })

            const { url } = await res.json()
            if (url) window.location.href = url
        }}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
        >
        Gerenciar assinatura
        </button>
    </div>
  )
}
