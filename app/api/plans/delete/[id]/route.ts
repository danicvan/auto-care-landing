import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const { error } = await supabase.from("plans").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Plano deletado com sucesso" });
}