"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { stripePromise } from "@/lib/stripe/client";

export default function CheckoutPage() {
    const params = useSearchParams();
    const router = useRouter();

    const priceId = params.get("priceId");
    const isAnnual = params.get("isAnnual");

    console.log(`### priceId: ${priceId}`);
    console.log(`### isAnnual: ${isAnnual}`);

    const handleStripeCheckout = async () => {
        const res = await fetch("/api/stripe/checkout", {
            method: "POST",
            body: JSON.stringify({ priceId, isAnnual }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        console.log("### stripe session response:", data);

        if (!data.sessionId) {
            console.error("SessionId não foi retornado!");
            return;
        }

        const stripe = await stripePromise;

        if (!stripe) {
            console.error("Stripe não foi carregado corretamente.");
            return;
        }

        stripe.redirectToCheckout({ sessionId: data.sessionId }).catch((err) => {
            console.error("Erro no redirecionamento:", err.message);
        });
    };

    useEffect(() => {
        if (priceId) handleStripeCheckout();
    }, [priceId]);

    return <p>Redirecionando para o pagamento...</p>
}