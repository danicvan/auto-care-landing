'use client';

import { stripePromise } from "@/lib/stripe/client";

export const CheckoutButton = ({ priceId, customerEmail }: { priceId: string, customerEmail: string }) => {
    const handleCheckout = async () => {
        const res = await fetch('/api/stripe/checkout', {
            method: 'POST',
            body: JSON.stringify({ priceId, customerEmail }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const { url } = await res.json();
        const stripe = await stripePromise;
        stripe?.redirectToCheckout({ sessionId: url })
    }

    return <button onClick={handleCheckout}>Subscribe</button>
}