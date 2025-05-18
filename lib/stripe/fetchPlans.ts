import { z } from "zod"
import { Plan } from "@/types/plan"

const PlanSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  price_id: z.string(),
  amount: z.number(),
  is_annual: z.boolean(),
  created_at: z.string()
})

const PlansSchema = z.array(PlanSchema)

export async function fetchPlans(): Promise<Plan[]> {
  const res = await fetch("/api/plans/list")
  const json = await res.json()

  const raw = Array.isArray(json) ? json : json?.plans ?? []

  return PlansSchema.parse(raw)
}