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
  const [loading, setLoading] = useState(false);

  const supabase = createPagesBrowserClient();

  useEffect(() => {
    const loadCheckout = async () => {
      setLoading(true);
      console.log("🚀 Iniciando carregamento do checkout...");

      const priceId = searchParams.get("priceId");
      const isAnnual = searchParams.get("isAnnual") === "true";

      console.log("🔎 Params:", { priceId, isAnnual });

      if (!priceId || typeof priceId !== "string") {
        setError("Parâmetro 'priceId' inválido.");
        console.error("❌ priceId inválido.");
        setTimeout(() => router.push("/"), 2000);
        return;
      }

      try {
        console.log("👤 Verificando autenticação do usuário...");
        const { data: { user }, error: supabaseError } = await supabase.auth.getUser();

        if (supabaseError || !user?.email) {
          console.warn("⚠️ Usuário não autenticado. Redirecionando para login.");
          console.log("🧾 Supabase Error:", supabaseError);
          console.log("👤 Usuário:", user);

          const callbackUrl = `/checkout?priceId=${priceId}&isAnnual=${isAnnual}`;
          router.push(`/login?redirect=${encodeURIComponent(callbackUrl)}`);
          return;
        }

        console.log("✅ Usuário autenticado:", { id: user.id, email: user.email });

        console.log("📡 Enviando dados para a API de assinatura...");
        const res = await fetch("/api/stripe/create-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            email: user.email,
            price_id: priceId,
          }),
        });

        const data = await res.json();
        console.log("📨 Resposta da API:", data);

        if (!res.ok || !data.clientSecret) {
          throw new Error(data.error || "Falha ao criar assinatura.");
        }

        console.log("🔐 clientSecret recebido:", data.clientSecret);
        console.log("🧾 subscriptionId recebido:", data.subscriptionId);

        setClientSecret(data.clientSecret);
        setSubscriptionId(data.subscriptionId);
      } catch (err: any) {
        console.error("❌ Erro no checkout:", err);
        setError("Erro ao carregar checkout: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCheckout();
  }, [searchParams, router]);

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (loading || !clientSecret || !subscriptionId) {
    return <p className="text-center mt-8">Carregando...</p>;
  }

  return (
    <main className="py-10 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">Pagamento da Assinatura</h1>
      <CheckoutClient clientSecret={clientSecret} subscriptionId={subscriptionId} />
    </main>
  );
}
