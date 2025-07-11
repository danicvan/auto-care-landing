import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  if (
    !process.env.STRIPE_SECRET_KEY ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    throw new Error("Missing environment variables.");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { price, isAnnual } = await req.json();

  try {
    const productName = isAnnual ? "Plano Anual" : "Plano Mensal";

    const products = await stripe.products.list({ limit: 100 });
    const existingProduct = products.data.find((p) => p.name === productName);

    let productId: string;

    if (existingProduct) {
      productId = existingProduct.id;
    } else {
      const newProduct = await stripe.products.create({ name: productName });
      productId = newProduct.id;
    }

    const newPrice = await stripe.prices.create({
      unit_amount: price * 100,
      currency: "brl",
      recurring: {
        interval: isAnnual ? "year" : "month",
      },
      product: productId,
    });

    const { error } = await supabase.from("plans").insert([
      {
        product_id: productId,
        price_id: newPrice.id,
        amount: price,
        is_annual: isAnnual,
      },
    ]);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[create-plan]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}