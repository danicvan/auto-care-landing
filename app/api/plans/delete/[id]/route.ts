import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const { error } = await supabase.from("plans").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar plano:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Plano deletado com sucesso" });
}