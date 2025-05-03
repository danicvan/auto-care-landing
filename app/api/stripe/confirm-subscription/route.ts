import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subscriptionId = searchParams.get("subscriptionId");

  if (!subscriptionId) {
    return NextResponse.json({ error: "subscriptionId ausente" }, { status: 400 });
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    return NextResponse.json({
      status: subscription.status,
      current_period_end: subscription.current_period_end,
      plan: subscription.items.data[0].price.nickname || subscription.items.data[0].price.id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?subscriptionId=${subscriptionId}`
    });
  } catch (err: any) {
    console.error("Erro ao buscar assinatura:", err);
    return NextResponse.json({ error: "Erro ao consultar assinatura" }, { status: 500 });
  }
}