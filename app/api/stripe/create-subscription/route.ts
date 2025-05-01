import { supabase } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user_id, email, price_id } = await req.json();

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

    if (error) throw error;

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
    });
  } catch (err: any) {
    console.error("Erro na subscription:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
