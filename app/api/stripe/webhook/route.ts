import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  console.log('➡️ Recebendo webhook da Stripe...');

  try {
    const buf = await req.arrayBuffer();
    const body = Buffer.from(buf);
    const sig = req.headers.get('stripe-signature')!;

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    console.log('📦 Evento recebido:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      console.log('Session recebida:', JSON.stringify(session, null, 2))

      const subscriptionId = session.subscription;

      if (!subscriptionId || typeof subscriptionId !== 'string') {
        console.error('⚠️ Subscription ID não encontrado na session:', subscriptionId)
        return NextResponse.json({ error: 'Subscription ID não encontrado' }, { status: 400 })
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const userId = subscription.metadata.user_id;

      const { error } = await supabase.from('subscriptions').insert([
        {
          user_id: userId,
          stripe_customer: subscription.customer as string,
          stripe_subscription: subscription.id,
          price_id: subscription.items.data[0].price.id,
          status: subscription.status,
        },
      ]);

      if (error) {
        console.error('Erro ao inserir no Supabase:', error.message);
        throw new Error(error.message);
      }

      console.log('✅ Subscription salva com sucesso!');
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
    });
  } catch (err: any) {
    console.error('❌ Erro no webhook:', err.message);
    return new Response(`Erro no webhook: ${err.message}`, { status: 500 });
  }
}