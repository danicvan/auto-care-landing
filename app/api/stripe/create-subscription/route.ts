import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    const customers = await stripe.customers.list({ email, limit: 1 });
    const existingCustomer = customers.data[0];

    const customer = existingCustomer
      ? existingCustomer
      : await stripe.customers.create({
          email,
          metadata: { user_id },
        });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price_id }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice"]
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;

    if (!invoice || typeof invoice !== "object") {
      return NextResponse.json(
        { error: "Fatura inválida ou ausente." },
        { status: 500 }
      );
    }

    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    if (!paymentIntent || !paymentIntent.client_secret) {
      return NextResponse.json(
        { error: "payment_intent.client_secret não disponível." },
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
