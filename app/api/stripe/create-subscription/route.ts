import { NextResponse } from "next/server";
import Stripe from "stripe";

console.log("🔐 Chave Stripe carregada:", process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const requestData: {
      email: string;
      price_id: string;
      user_id: string;
    } = await req.json();
    
    console.log("📥 Body recebido:", requestData);

    const { email, price_id, user_id } = requestData;

    if (!email || !price_id || !user_id) {
      console.error("❌ Parâmetros ausentes:", { email, price_id, user_id });
      return NextResponse.json(
        { error: "Parâmetros ausentes." },
        { status: 400 }
      );
    }    

    const customers = await stripe.customers.list({ email, limit: 1 });
    const existingCustomer = customers.data[0];

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
      },
      expand: ["latest_invoice"]
    });

    console.log("🔍 Subscription criada:", subscription);

    const invoice = subscription.latest_invoice as Stripe.Invoice & {
      payment_intent?: Stripe.PaymentIntent;
    };

    console.log("🧾 Invoice:", invoice);
    
    const paymentIntent = invoice.payment_intent;
    
    if (!paymentIntent?.client_secret) {
      console.error("❌ client_secret não encontrado. paymentIntent:", paymentIntent);
      return NextResponse.json(
        { error: "client_secret não gerado. Verifique se o price_id exige pagamento." },
        { status: 500 }
      );
    }       

    console.log("💳 PaymentIntent:", paymentIntent);

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
