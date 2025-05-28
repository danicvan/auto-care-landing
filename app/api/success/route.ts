import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subscriptionId = searchParams.get("subscriptionId");

  if (!subscriptionId) {
    return NextResponse.json({ error: "subscriptionId ausente" }, { status: 400 });
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["customer", "items.data.price.product"],
    });

    const item = subscription.items.data[0];
    const plan = item.price.nickname || item.price.id;
    const priceId = item.price.id;
    const stripeCustomerId = subscription.customer as string;

    // 👇 Aqui usamos força bruta segura
    const unixEnd = (subscription as any).current_period_end;

    const email =
      typeof subscription.customer === "object" && subscription.customer && "email" in subscription.customer
        ? (subscription.customer as Stripe.Customer).email ?? "desconhecido"
        : "desconhecido";

    await supabase.from("subscriptions").insert([
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

    await resend.emails.send({
      from: "danicvan@hotmail.com",
      to: email,
      subject: "Confirmação da sua assinatura",
      html: `<p>Plano: ${plan}, Status: ${subscription.status}, Fim: ${new Date(unixEnd * 1000).toLocaleDateString("pt-BR")}</p>`,
    });

    return NextResponse.json({
      status: subscription.status,
      current_period_end: unixEnd,
      plan,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?subscriptionId=${subscriptionId}`,
    });
  } catch (err: any) {
    console.error("Erro ao buscar assinatura:", err);
    return NextResponse.json({ error: "Erro ao consultar assinatura" }, { status: 500 });
  }
}
