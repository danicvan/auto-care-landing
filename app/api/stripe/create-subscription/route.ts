import { NextResponse } from "next/server";
import Stripe from "stripe";

// Inicializa o Stripe com sua chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15", // ou a versão ativa no seu dashboard
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, price_id, user_id } = body;

    // Verifica se todos os campos obrigatórios estão presentes
    if (!email || !price_id || !user_id) {
      return NextResponse.json(
        { error: "Parâmetros ausentes." },
        { status: 400 }
      );
    }

    // Cria o cliente no Stripe
    const customer = await stripe.customers.create({
      email,
      metadata: { user_id },
    });

    // Cria a assinatura com configuração para confirmação manual
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price_id }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice"], // evita erro ao expandir payment_intent diretamente
    });

    // Tenta acessar o payment_intent com segurança
    const invoice = subscription.latest_invoice as Stripe.Invoice;
    let clientSecret = null;

    if (invoice?.payment_intent && typeof invoice.payment_intent !== "string") {
      clientSecret = (invoice.payment_intent as Stripe.PaymentIntent).client_secret;
    }

    // Retorna o clientSecret (pode ser null se ainda não gerado) e a ID da assinatura
    return NextResponse.json({
      clientSecret,
      subscriptionId: subscription.id,
    });
  } catch (error: any) {
    console.error("❌ Erro ao criar assinatura:", error.message || error);
    return NextResponse.json(
      { error: "Erro interno ao criar assinatura." },
      { status: 500 }
    );
  }
}