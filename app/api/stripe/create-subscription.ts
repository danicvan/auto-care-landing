import { supabase } from "@/lib/supabase";
import { stripe } from "@/lib/stripe/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { user_id, email, price_id } = req.body;

    try {
        const customer = await stripe.customers.create({
            email,
            metadata: { user_id },
        });

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: price_id }],
            payment_behavior: "default_incomplete",
            expand: ["latest_invoice.payment_intent"],
        });

        const { error } = await supabase.from("subscriptions").insert([
            {
                user_id,
                stripe_customer: customer.id,
                stripe_subscription: subscription.id,
                price_id,
                status: subscription.status,
            },
        ]);

        if (error) throw error

        res.status(200).json({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
        })

    } catch (err: any) {
        console.error("Erro na subscription:", err);
        res.status(500).json({ error: err.message});
    }
}
