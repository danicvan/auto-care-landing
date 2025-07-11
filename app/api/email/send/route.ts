import { resend } from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, plan, current_period_end, status } = await req.json();

    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "long",
      timeZone: "America/Sao_Paulo",
    }).format(new Date(current_period_end * 1000));

    const html = generateEmailHTML(plan, status, formattedDate);

    const response = await resend.emails.send({
      from: "danicvan@hotmail.com",
      to: email,
      subject: "Confirmação da sua assinatura",
      html,
    });

    if (response.error) {
      console.error("Failed to send email:", response.error);
      return NextResponse.json({ error: "Email not sent." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}

function generateEmailHTML(plan: string, status: string, renewalDate: string): string {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 40px 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(90deg, #1e40af, #2563eb); padding: 32px; color: #ffffff; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Assinatura Confirmada</h1>
          <p style="margin: 8px 0 0; font-size: 16px;">Bem-vindo à AutoCare</p>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; color: #111827;">Olá,</p>
          <p style="font-size: 16px; color: #111827;">Obrigado por assinar o plano <strong style="color: #2563eb;">${plan}</strong>!</p>
          <p style="font-size: 16px; color: #111827;">Aqui estão os detalhes da sua assinatura:</p>

          <table style="width: 100%; margin-top: 24px; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Plano</td>
              <td style="padding: 8px 0; color: #111827;">${plan}</td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Status</td>
              <td style="padding: 8px 0; color: #111827;">${status}</td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Próxima renovação</td>
              <td style="padding: 8px 0; color: #111827;">${renewalDate}</td>
            </tr>
          </table>

          <p style="font-size: 16px; color: #111827; margin-top: 32px;">
            Caso tenha dúvidas ou precise de suporte, nossa equipe está à disposição para ajudar.
          </p>

          <p style="font-size: 16px; color: #111827; margin-top: 32px;">
            Grande abraço, <br/>
            <strong style="color: #1e40af;">Equipe AutoCare</strong>
          </p>
        </div>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 13px; color: #6b7280;">
          © 2025 AutoCare. Todos os direitos reservados. <br/>
          Este e-mail foi enviado automaticamente. Por favor, não responda.
        </div>
      </div>
    </div>
  `;
}
