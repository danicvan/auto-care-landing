// pages/minha-conta.tsx
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useEffect, useState } from "react"

export default function MinhaConta() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    if (!session) return

    supabase
      .from("subscriptions")
      .select("*")
      .eq("user_email", session.user.email)
      .single()
      .then(({ data }) => setSubscription(data))
  }, [session])

  if (!session) return <p>Você precisa estar logado.</p>

  return (
    <div className="p-10">
      <h1>Minha Conta</h1>
      {subscription ? (
        <>
          <p>Plano: {subscription.plan_id}</p>
          <p>Status: {subscription.status}</p>
          <p>Stripe ID: {subscription.stripe_subscription_id}</p>
        </>
      ) : (
        <p>Nenhuma assinatura encontrada.</p>
      )}
    </div>
  )
}
