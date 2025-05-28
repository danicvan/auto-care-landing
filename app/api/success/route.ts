import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subscriptionId = searchParams.get("subscriptionId");

  if (!subscriptionId) {
    return NextResponse.json({ error: "subscriptionId ausente" }, { status: 400 });
  }

  try {
    const subscription = (await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["customer", "items.data.price.product"],
    })) as Stripe.Subscription;    

    const item = subscription.items.data[0];
    const plan = item.price.nickname || item.price.id;
    const priceId = item.price.id;
    const stripeCustomerId = subscription.customer as string;
    const unixEnd = Number(subscription.current_period_end);

    const email =
      typeof subscription.customer === "object" && "email" in subscription.customer
        ? subscription.customer.email
        : "desconhecido";

    // 🔄 Salvar no Supabase
    const { error: dbError } = await supabase.from("subscriptions").insert([
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

    if (dbError) {
      console.error("❌ Erro ao salvar no Supabase:", dbError);
    }

    // ✉️ Enviar e-mail de confirmação
    const formattedDate =
      isNaN(unixEnd) || unixEnd <= 0
        ? "Desconhecida"
        : new Date(unixEnd * 1000).toLocaleDateString("pt-BR");

    const { error: emailError } = await resend.emails.send({
      from: "danicvan@hotmail.com", // ❗️Use domínio verificado aqui
      to: email,
      subject: "Confirmação da sua assinatura",
      html: `
        <div style="font-family: sans-serif; padding: 24px; max-width: 600px; margin: auto;">
          <h2 style="color: #10b981;">Assinatura Confirmada ✅</h2>
          <p>Olá!</p>
          <p>Sua assinatura foi concluída com sucesso.</p>
          <p><strong>Plano:</strong> ${plan}</p>
          <p><strong>Status:</strong> ${subscription.status}</p>
          <p><strong>Renovação em:</strong> ${formattedDate}</p>
          <br />
          <p style="font-size: 12px; color: #777;">Obrigado por escolher a AutoCare.</p>
        </div>
      `,
    });

    if (emailError) {
      console.error("❌ Erro ao enviar e-mail:", emailError);
    }

    return NextResponse.json({
      status: subscription.status,
      current_period_end: unixEnd,
      plan,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?subscriptionId=${subscriptionId}`,
    });
  } catch (err: any) {
    console.error("❌ Erro ao buscar assinatura:", err);
    return NextResponse.json({ error: "Erro ao consultar assinatura" }, { status: 500 });
  }
}