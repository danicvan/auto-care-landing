// File: /app/api/stripe/webhook/route.ts

import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { buffer } from "micro";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false, // Stripe requires raw body
  },
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const rawBody = await buffer(req.body as any);
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    if (!sig) throw new Error("Missing Stripe signature header.");
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 🎯 Handle specific event types
  switch (event.type) {
    case "invoice.payment_succeeded": {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      const customerId = invoice.customer;

      await supabase
        .from("subscriptions")
        .update({ status: "active" })
        .eq("stripe_customer", customerId)
        .eq("stripe_subscription", subscriptionId);

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      const customerId = invoice.customer;

      await supabase
        .from("subscriptions")
        .update({ status: "failed" })
        .eq("stripe_customer", customerId)
        .eq("stripe_subscription", subscriptionId);

      break;
    }

    // Você pode adicionar mais eventos como subscription.updated, canceled etc.

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new NextResponse("Webhook recebido com sucesso.", { status: 200 });
}
