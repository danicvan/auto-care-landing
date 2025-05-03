import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, price_id, user_id } = body;

    if (!email || !price_id || !user_id) {
      return NextResponse.json(
        { error: "Parâmetros ausentes." },
        { status: 400 }
      );
    }

    // 🔎 Verificar se cliente já existe (opcional, mas recomendável se seu sistema persistir cliente_id)
    const customers = await stripe.customers.list({ email, limit: 1 });
    const existingCustomer = customers.data[0];

    const customer = existingCustomer
      ? existingCustomer
      : await stripe.customers.create({
          email,
          metadata: { user_id },
        });

    // 📦 Cria a assinatura com pagamento manual
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price_id }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"], // << já expande direto o paymentIntent
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    if (!paymentIntent?.client_secret) {
      return NextResponse.json(
        { error: "client_secret não gerado." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription.id,
    });
  } catch (error: any) {
    console.error("❌ Erro ao criar assinatura:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar assinatura." },
      { status: 500 }
    );
  }
}
