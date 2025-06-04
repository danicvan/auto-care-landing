import { NextResponse } from "next/server";
import Stripe from "stripe";

console.log("🔐 Chave Stripe carregada:", process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  function debug(label: string, data: any) {
    if (process.env.NODE_ENV !== "production") {
      console.log(label, data);
    }
  }

  try {
    const requestData: {
      email: string;
      price_id: string;
      user_id: string;
    } = await req.json();

    debug("📥 Body recebido:", requestData);

    const { email, price_id, user_id } = requestData;

    if (!email || !price_id || !user_id) {
      console.error("❌ Parâmetros ausentes:", { email, price_id, user_id });
      return NextResponse.json(
        { error: "Parâmetros ausentes." },
        { status: 400 }
      );
    }

    async function getOrCreateCustomer(email: string, user_id: string) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      return customers.data[0] ?? await stripe.customers.create({
        email,
        metadata: { user_id },
      });
    }

    const customer = await getOrCreateCustomer(email, user_id);

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price_id }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      }
    });

    debug("🔍 Subscription criada:", subscription);

    // Buscar invoice manualmente com expand
    const invoiceId = subscription.latest_invoice as string;
    const invoice = await stripe.invoices.retrieve(invoiceId, {
      expand: ["payment_intent"],
    });

    debug("🧾 Invoice (manual):", structuredClone(invoice));

    const paymentIntent = invoice.payment_intent;

    if (
      !paymentIntent ||
      typeof paymentIntent === "string" ||
      !("client_secret" in paymentIntent)
    ) {
      console.error("❌ No client_secret. Subscription may not require immediate payment.", paymentIntent);
      return NextResponse.json(
        { error: "No client_secret found. This subscription may not require payment." },
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
