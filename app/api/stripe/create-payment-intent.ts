import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    const { priceId, isAnnual } = await req.json();

    const amount = isAnnual === "true"? 20000 : 2500;
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'brl',
        automatic_payment_methods: { enabled: true},
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret});
}