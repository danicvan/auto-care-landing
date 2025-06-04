"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export default function CheckoutLoader() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const priceId = searchParams.get("priceId");
    const isAnnual = searchParams.get("isAnnual") === "true";

    if (!priceId || typeof priceId !== "string") {
      setError("Parâmetro 'priceId' inválido.");
      setTimeout(() => router.push("/"), 2000);
      return;
    }

    const supabase = createPagesBrowserClient();

    supabase.auth.getUser().then(({ data: { user }, error: supabaseError }) => {
      if (supabaseError || !user?.email) {
        console.error("❌ Erro ao obter usuário:", supabaseError || "Sem e-mail");
        setError("Erro ao autenticar usuário.");
        return;
      }

      fetch("/api/stripe/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          email: user.email,
          price_id: priceId,
        }),
      })
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok || !data.clientSecret) {
            throw new Error(data.error || "Falha ao criar assinatura");
          }

          setClientSecret(data.clientSecret);
          setSubscriptionId(data.subscriptionId);
        })
        .catch((err) => {
          console.error("❌ Erro no fetch:", err.message);
          setError("Erro ao carregar checkout: " + err.message);
        });
    });
  }, [searchParams, router]);

  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!clientSecret || !subscriptionId) return <p className="text-center mt-8">Carregando...</p>;

  return (
    <main className="py-10 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">Pagamento da Assinatura</h1>
      <CheckoutClient clientSecret={clientSecret} subscriptionId={subscriptionId} />
    </main>
  );
}
