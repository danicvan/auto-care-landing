import { stripe } from "@/lib/stripe";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { productId, amount, interval } = req.body;

  if (!productId || !amount || !interval) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    // Busca todos os preços do produto
    const prices = await stripe.prices.list({
      product: productId,
      limit: 100,
      active: true,
    });

    // Verifica se já existe um preço igual
    const existing = prices.data.find(
      (price) =>
        price.unit_amount === amount &&
        price.recurring?.interval === interval
    );

    if (existing) {
      return res.status(200).json({ priceId: existing.id });
    }

    // Cria novo Price se não existir
    const newPrice = await stripe.prices.create({
      product: productId,
      unit_amount: amount,
      currency: "brl",
      recurring: {
        interval,
      },
    });

    return res.status(201).json({ priceId: newPrice.id });
  } catch (err: any) {
    console.error("Stripe Price Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
