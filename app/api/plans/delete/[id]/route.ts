import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const { error } = await supabase
      .from("plans")
      .update({ is_deleted: true })
      .eq("id", id);

    if (error) {
      console.error("Erro ao excluir plano:", error.message);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Plano marcado como excluído." }), { status: 200 });
  } catch (err: any) {
    console.error("Erro inesperado:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
