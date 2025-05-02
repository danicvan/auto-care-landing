import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { productId, amount, isAnnual } = await req.json();

  if (!productId || !amount || isAnnual === undefined) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const interval = isAnnual ? "year" : "month";

    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      limit: 100,
    });

    const existing = prices.data.find(
      (p) => p.unit_amount === amount && p.recurring?.interval === interval
    );

    const price = existing
      ? existing
      : await stripe.prices.create({
          product: productId,
          unit_amount: amount,
          currency: "brl",
          recurring: { interval },
        });

    const { error } = await supabase.from("plans").insert([
      {
        product_id: productId,
        price_id: price.id,
        amount: amount / 100,
        is_annual: isAnnual,
      },
    ]);

    if (error) {
      console.error("Erro ao salvar no Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ priceId: price.id });
  } catch (err: any) {
    console.error("Erro Stripe:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
