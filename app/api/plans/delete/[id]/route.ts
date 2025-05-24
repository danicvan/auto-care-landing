import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ✅ Correto para Next.js 15 App Router
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;

  const { error } = await supabase.from("plans").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Plano deletado com sucesso" });
}
