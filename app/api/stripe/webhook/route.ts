import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");

  const rawBody = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret);
  } catch (err: any) {
    console.error("❌ Erro ao validar webhook:", err.message);
    return NextResponse.json({ error: "Webhook inválido" }, { status: 400 });
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;

    if (!invoice.subscription || typeof invoice.subscription !== "string") {
      console.error("❌ Subscription ID ausente ou inválido.");
      return NextResponse.json({ error: "Subscription ID ausente." }, { status: 400 });
    }

    const subscriptionId = invoice.subscription;

    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ["customer", "items.data.price.product"],
      });

      const item = subscription.items.data[0];
      const plan = item.price.nickname || item.price.id;
      const priceId = item.price.id;
      const stripeCustomerId = subscription.customer as string;
      const current_period_end = subscription.current_period_end;

      const email =
        typeof subscription.customer === "object" && "email" in subscription.customer
          ? subscription.customer.email
          : subscription.customer_email || "desconhecido";

      // Atualizar no Supabase
      const { error: dbError } = await supabase
        .from("subscriptions")
        .update({
          status: subscription.status,
          current_period_end,
          price_id: priceId,
          plan,
        })
        .eq("subscription_id", subscription.id);

      if (dbError) {
        console.error("❌ Erro ao atualizar Supabase:", dbError);
      }

      console.log("✅ Assinatura atualizada com sucesso no Supabase.");
    } catch (error: any) {
      console.error("❌ Erro ao buscar assinatura no Stripe:", error.message);
    }
  }

  return NextResponse.json({ received: true });
}
