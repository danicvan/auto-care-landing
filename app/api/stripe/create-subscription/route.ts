import { NextResponse } from "next/server";
import Stripe from "stripe";

console.log("🔐 Stripe key loaded:", process.env.STRIPE_SECRET_KEY);
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

    debug("📥 Request body received:", requestData);

    const { email, price_id, user_id } = requestData;

    if (!email || !price_id || !user_id) {
      console.error("❌ Missing parameters:", { email, price_id, user_id });
      return NextResponse.json(
        { error: "Missing parameters." },
        { status: 400 }
      );
    }

    async function getOrCreateCustomer(email: string, user_id: string) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      const customer =
        customers.data[0] ??
        (await stripe.customers.create({
          email,
          metadata: { user_id },
        }));
      debug("👤 Customer ready:", customer);
      return customer;
    }

    const customer = await getOrCreateCustomer(email, user_id);

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price_id }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
    });

    debug("📦 Subscription created:", {
      id: subscription.id,
      status: subscription.status,
      latest_invoice: subscription.latest_invoice,
    });

    const invoiceId = subscription.latest_invoice as string;

    // Corrigido: invoice retorna um Response<Invoice>, extrair o objeto Invoice
    const invoiceResponse = await stripe.invoices.retrieve(invoiceId, {
      expand: ["payment_intent"],
    });

    // Se for do tipo Response<Invoice>, extrair o objeto Invoice
    const invoice =
      'object' in invoiceResponse && invoiceResponse.object === 'invoice'
        ? invoiceResponse
        : null;

    if (!invoice) {
      console.error("❌ Invoice object not found.");
      return NextResponse.json(
        { error: "Invoice object not found." },
        { status: 500 }
      );
    }

    const paymentIntent =
      invoice.payment_intent && typeof invoice.payment_intent !== "string"
        ? (invoice.payment_intent as Stripe.PaymentIntent)
        : null;

    debug("🧾 Invoice retrieved:", {
      id: invoice.id,
      status: invoice.status,
      hasPaymentIntent: !!paymentIntent,
    });

    if (!paymentIntent || !("client_secret" in paymentIntent)) {
      console.error(
        "❌ No client_secret. Subscription may not require immediate payment.",
        paymentIntent
      );
      return NextResponse.json(
        { error: "No client_secret found. This subscription may not require payment." },
        { status: 500 }
      );
    }

    debug("💳 PaymentIntent OK:", {
      id: paymentIntent.id,
      status: paymentIntent.status,
      client_secret: paymentIntent.client_secret,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription.id,
    });
  } catch (error: any) {
    console.error("❌ Error creating subscription:", error);
    return NextResponse.json(
      { error: "Internal error creating subscription." },
      { status: 500 }
    );
  }
}
