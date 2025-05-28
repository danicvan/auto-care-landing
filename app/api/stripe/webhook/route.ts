import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");

  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret);
  } catch (err: any) {
    console.error("❌ Error validating webhook:", err.message);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
  
    const subscriptionId = (invoice as any).subscription as string;
  
    try {
      const subscription: Stripe.Subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ["customer", "items.data.price.product"],
      });

      const item = subscription.items.data[0];
      const plan = item.price.nickname || item.price.id;
      const priceId = item.price.id;
      const current_period_end = subscription.current_period_end;

      const email =
        typeof subscription.customer === "object" && "email" in subscription.customer
          ? subscription.customer.email
          : subscription.customer_email || "unknown";

      const { error: dbError } = await supabase
        .from("subscriptions")
        .update({
          status: subscription.status,
          current_period_end,
          price_id: priceId,
          plan,
        })
        .eq("subscription_id", subscription.id);

      if (dbError) {
        console.error("❌ Error updating Supabase:", dbError);
      } else {
        console.log("✅ Subscription updated successfully in Supabase.");
      }
    } catch (error: any) {
      console.error("❌ Error retrieving subscription from Stripe:", error.message);
    }
  }

  return NextResponse.json({ received: true });
}
