// app/api/stripe/portal/route.ts
import { stripe } from "@/lib/stripe"
import { supabase } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("email", email)
    .single()

  if (!subscription?.stripe_customer_id) {
    return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/minha-conta`,
  })

  return NextResponse.json({ url: portalSession.url })
}
