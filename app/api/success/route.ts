import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subscriptionId = searchParams.get("subscriptionId");

  if (!subscriptionId) {
    return NextResponse.json({ error: "Parâmetro 'subscriptionId' é obrigatório." }, { status: 400 });
  }

  try {
    // Recupera os dados da assinatura com expansão de customer e produto
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["customer", "items.data.price.product"],
    });

    const item = subscription.items.data[0];
    const plan = item.price.nickname ?? item.price.id;
    const priceId = item.price.id;
    const stripeCustomerId = typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id ?? "desconhecido";

    const unixEnd = subscription.current_period_end;

    const email = typeof subscription.customer === "object" && subscription.customer && "email" in subscription.customer
      ? (subscription.customer as Stripe.Customer).email ?? "desconhecido"
      : "desconhecido";

    // Salva no banco de dados
    const { error } = await supabase.from("subscriptions").insert([
      {
        subscription_id: subscription.id,
        stripe_customer: stripeCustomerId,
        email,
        price_id: priceId,
        plan,
        status: subscription.status,
        current_period_end: unixEnd,
      },
    ]);

    if (error) {
      console.error("Erro ao salvar no Supabase:", error);
      return NextResponse.json({ error: "Erro ao salvar assinatura no banco." }, { status: 500 });
    }

    // Envia o e-mail de confirmação
    await resend.emails.send({
      from: "danicvan@hotmail.com",
      to: email,
      subject: "Confirmação da sua assinatura",
      html: `
        <p><strong>Plano:</strong> ${plan}</p>
        <p><strong>Status:</strong> ${subscription.status}</p>
        <p><strong>Válido até:</strong> ${new Date(unixEnd * 1000).toLocaleDateString("pt-BR")}</p>
      `,
    });

    return NextResponse.json({
      status: subscription.status,
      current_period_end: unixEnd,
      plan,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?subscriptionId=${subscriptionId}`,
    });
  } catch (err) {
    console.error("Erro ao buscar assinatura:", err);
    return NextResponse.json({ error: "Erro interno ao consultar assinatura." }, { status: 500 });
  }
}
