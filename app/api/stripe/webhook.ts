import { buffer } from "micro";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

export const config = {
    api: {
        bodyParser: false,
    },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") return res.status(405).end();

    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig!, webhookSecret)
    } catch (err: any) {
        console.error("Webhook Error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const data = event.data.object as any;

    if (event.type === "customer.subscription.updated" || event.type === "customer.source.deleted") {
        await supabase
            .from("subscriptions")
            .update({ status: data.status })
            .eq("stripe_subscription", data.id)
    }

    res.status(200).json({ received: true });
}
