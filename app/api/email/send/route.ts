import { resend } from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, plan, current_period_end, status } = await req.json();

  try {
    const renewal = new Date(current_period_end * 1000).toLocaleDateString("pt-BR");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="background-color: #1e40af; color: #fff; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 24px;">Assinatura Confirmada ✅</h2>
        </div>
        <div style="padding: 24px;">
          <p>Olá,</p>
          <p>Obrigado por assinar o plano <strong style="color: #1e40af;">${plan}</strong>! 🎉</p>
          <p>Confira os detalhes da sua assinatura:</p>
          <ul style="padding-left: 20px; line-height: 1.8;">
            <li><strong>Plano:</strong> ${plan}</li>
            <li><strong>Status:</strong> ${status}</li>
            <li><strong>Próxima renovação:</strong> ${renewal}</li>
          </ul>
          <p>Se tiver qualquer dúvida, estamos por aqui para ajudar.</p>
          <p style="margin-top: 32px;">Abraços,<br/><strong>Equipe AutoCare</strong></p>
        </div>
        <div style="background-color: #f3f4f6; text-align: center; font-size: 12px; color: #6b7280; padding: 16px;">
          © 2025 AutoCare. Todos os direitos reservados.
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "danicvan@hotmail.com",
      to: email,
      subject: "Confirmação da sua assinatura",
      html: htmlContent,
    });

    if (error) {
      console.error("Erro ao enviar e-mail:", error);
      return NextResponse.json({ error: "Falha ao enviar e-mail" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
