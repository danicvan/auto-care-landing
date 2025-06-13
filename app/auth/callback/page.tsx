"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function AuthCallback() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirectTo = searchParams.get("redirect") || "/";

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.push(redirectTo);
      }
    });
  }, [supabase, router, searchParams]);

  return <p className="text-center mt-10">Autenticando...</p>;
}
