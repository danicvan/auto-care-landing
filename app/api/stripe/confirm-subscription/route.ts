import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subscriptionId = searchParams.get("subscriptionId");

  if (!subscriptionId) {
    return NextResponse.json({ error: "subscriptionId is missing" }, { status: 400 });
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    return NextResponse.json({
      status: subscription.status,
      // @ts-ignore: Stripe types may not include this field
      current_period_end: (subscription as any).current_period_end,
      plan:
        subscription.items.data[0].price.nickname ||
        subscription.items.data[0].price.id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?subscriptionId=${subscriptionId}`
    });
  } catch (err: any) {
    console.error("Error fetching subscription:", err);
    return NextResponse.json(
      { error: "Failed to retrieve subscription" },
      { status: 500 }
    );
  }
}
