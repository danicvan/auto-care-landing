import { supabase } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user_id, email, price_id } = await req.json();

  if (!user_id || !email || !price_id) {
    return NextResponse.json({ error: "Parâmetros ausentes." }, { status: 400 });
  }

  try {
    // 🔍 Verifica se o cliente já existe no Supabase ou cria um novo
    const customer = await stripe.customers.create({
      email,
      metadata: { user_id },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price_id }],
      payment_behavior: "default_incomplete", // 🔥 necessário para checkout transparente
      collection_method: "charge_automatically", // 🔥 necessário para criar payment_intent
      expand: ["latest_invoice.payment_intent"], // 🔥 sem isso, o clientSecret não vem
    });

    // ✅ Salva assinatura no Supabase
    const { error } = await supabase.from("subscriptions").insert([
      {
        user_id,
        stripe_customer: customer.id,
        stripe_subscription: subscription.id,
        price_id,
        status: subscription.status,
      },
    ]);

    if (error) {
      console.error("Erro ao salvar no Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const clientSecret = subscription.latest_invoice?.payment_intent?.client_secret;

    if (!clientSecret) {
      throw new Error("Stripe não retornou client_secret.");
    }

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret,
    });
  } catch (err: any) {
    console.error("Erro na subscription:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
