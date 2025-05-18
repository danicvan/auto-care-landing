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
  
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error?.message || "Failed to fetch plans.")
    }
  
    const json = await res.json()
    return PlansSchema.parse(json)
}  