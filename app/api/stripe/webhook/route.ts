// app/api/stripe/webhook/route.ts

import { buffer } from 'micro'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

// necessário para o Stripe validar o body
export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  console.log('➡️ Recebendo webhook da Stripe...')

  try {
    const buf = await req.arrayBuffer()
    const body = Buffer.from(buf)
    const sig = req.headers.get('stripe-signature')!

    console.log('📝 Assinatura recebida:', sig);
    console.log("### webhooSecret: " + webhookSecret);

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret)

    console.log('📦 Evento recebido:', event.type)

    switch (event.type) {
      case 'checkout.session.completed':
        console.log('✅ Sessão completa:', event.data.object)
        break
      case 'customer.subscription.updated':
        console.log('🔄 Subscription atualizada:', event.data.object)
        break
      case 'customer.subscription.deleted':
        console.log('🗑️ Subscription cancelada:', event.data.object)
        break
      default:
        console.log(`🤷 Evento não tratado: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
    })
  } catch (err: any) {
    console.error('❌ Erro no webhook:', err.message)
    return new Response(`Erro no webhook: ${err.message}`, { status: 500 })
  }
}
