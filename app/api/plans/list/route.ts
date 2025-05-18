import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔄 Consultando planos no Supabase...")

    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("⚠️ Erro Supabase:", error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ Dados encontrados:", data)
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("❌ Erro inesperado:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}