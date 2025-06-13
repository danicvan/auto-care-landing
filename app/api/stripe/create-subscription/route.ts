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
      expand: ["latest_invoice.payment_intent"], // ✅ necessário para acessar diretamente
    });

    debug("📦 Subscription criada:", {
      id: subscription.id,
      status: subscription.status,
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice & {
      payment_intent: Stripe.PaymentIntent;
    };

    const paymentIntent = invoice.payment_intent;

    debug("🧾 Invoice expandida:", {
      id: invoice.id,
      status: invoice.status,
      payment_intent_status: paymentIntent?.status,
    });

    if (!paymentIntent?.client_secret) {
      console.error("❌ Sem client_secret. Assinatura pode não exigir pagamento.");
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
