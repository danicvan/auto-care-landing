import { stripe } from '@/lib/stripe/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { priceId, customerEmail } = await req.json();

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer_email: customerEmail,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
        })

        return NextResponse.json({ url: session.url })
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}