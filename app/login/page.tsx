"use client";

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const priceId = searchParams.get("priceId");
  const isAnnual = searchParams.get("isAnnual");
  const fallbackRedirect = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [canRetry, setCanRetry] = useState(true);

  const redirectTo = useMemo(
    () => `/checkout?priceId=${priceId}&isAnnual=${isAnnual}`,
    [priceId, isAnnual]
  );

  // Recupera params do fallback se necessário
  useEffect(() => {
    if ((!priceId || !isAnnual) && fallbackRedirect) {
      const urlParams = new URLSearchParams(fallbackRedirect.split("?")[1] || "");
      const recoveredPriceId = urlParams.get("priceId");
      const recoveredIsAnnual = urlParams.get("isAnnual");

      if (recoveredPriceId && recoveredIsAnnual) {
        router.replace(`/login?priceId=${recoveredPriceId}&isAnnual=${recoveredIsAnnual}`);
      }
    }
  }, [priceId, isAnnual, fallbackRedirect, router]);

  // Redireciona usuário logado
  useEffect(() => {
    if (user) {
      router.push(redirectTo);
    }
  }, [user, redirectTo, router]);

  const handleLogin = useCallback(async () => {
    setLoading(true);

    const isValidEmail = /\S+@\S+\.\S+/.test(email);
    if (!isValidEmail) {
      toast.warning("Insira um e-mail válido.");
      setLoading(false);
      return;
    }

    if (!canRetry) {
      toast.warning("Aguarde alguns segundos antes de tentar novamente.");
      setLoading(false);
      return;
    }

    setCanRetry(false);
    setTimeout(() => setCanRetry(true), 30000);

    try {
      const callbackUrl = `/auth/callback?redirect=${encodeURIComponent(redirectTo)}`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${callbackUrl}`,
        },
      });

      if (error) throw error;
      toast.success(`📩 Enviamos o link para ${email}`);
    } catch (err) {
      toast.error("Erro ao enviar o link. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [email, redirectTo, supabase, canRetry]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="w-full max-w-md bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Acessar sua conta</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Enviaremos um link mágico para seu e-mail.
        </p>

        <label htmlFor="email" className="sr-only">E-mail</label>
        <input
          id="email"
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
        />

        <button
          onClick={handleLogin}
          disabled={loading || !email}
          className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          aria-busy={loading}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Enviando...
            </>
          ) : (
            "Entrar com e-mail"
          )}
        </button>
      </div>
    </main>
  );
}