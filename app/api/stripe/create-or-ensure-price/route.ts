import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, price, isAnnual } = await req.json();

  if (!name || !price || isAnnual === undefined) {
    return NextResponse.json({ error: "Parâmetros ausentes" }, { status: 400 });
  }

  try {
    // Verifica ou cria o produto
    const products = await stripe.products.list({ limit: 100 });
    let product = products.data.find((p) => p.name === name);

    if (!product) {
      product = await stripe.products.create({ name });
    }

    // Verifica ou cria o preço
    const interval = isAnnual ? "year" : "month";
    const prices = await stripe.prices.list({ product: product.id, active: true, limit: 100 });

    let existingPrice = prices.data.find(
      (p) => p.unit_amount === Math.round(price * 100) && p.recurring?.interval === interval
    );

    if (!existingPrice) {
      existingPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(price * 100),
        currency: "brl",
        recurring: { interval },
      });
    }

    const { error } = await supabase.from("plans").insert([
      {
        product_id: product.id,
        price_id: existingPrice.id,
        amount: price,
        is_annual: isAnnual,
      },
    ]);

    if (error) throw new Error(error.message);

    return NextResponse.json({ priceId: existingPrice.id });
  } catch (err: any) {
    console.error("Erro Stripe:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}