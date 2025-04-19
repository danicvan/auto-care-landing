"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
    const params = useSearchParams();
    const router = useRouter();

    const priceId = params.get("priceId");
    const isAnnual = params.get("isAnnual");

    const handleStripeCheckout = async () => {
        const res = await fetch("/api/stripe/checkout", {
            method: "POST",
            body: JSON.stringify({ priceId, isAnnual }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const { sessionId } = await res.json();
        const stripe = await (await import("@/lib/stripe/client")).stripePromise;
        stripe?.redirectToCheckout({ sessionId });
    };

    useEffect(() => {
        if (priceId) handleStripeCheckout();
    }, [priceId]);

    return <p>Redirecionando para o pagamento...</p>
}