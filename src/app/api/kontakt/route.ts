import { NextResponse } from "next/server";
import { Resend } from "resend";
import { companyInfo } from "@/lib/data";

type ContactPayload = {
  fullName: string;
  phone: string;
  email: string;
  message: string;
};

function isValidPayload(data: unknown): data is ContactPayload {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.fullName === "string" &&
    d.fullName.length > 0 &&
    typeof d.phone === "string" &&
    d.phone.length > 0 &&
    typeof d.email === "string" &&
    d.email.length > 0 &&
    typeof d.message === "string" &&
    d.message.length > 0
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Nepotpuni podaci." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY nije podešen — email nije poslat.");
    return NextResponse.json(
      { error: "Slanje email-a trenutno nije podešeno na serveru." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);
  const fromAddress = process.env.BOOKING_FROM_EMAIL ?? "MADAuto <onboarding@resend.dev>";

  try {
    await resend.emails.send({
      from: fromAddress,
      to: companyInfo.email,
      replyTo: body.email,
      subject: `Nova poruka sa sajta — ${body.fullName}`,
      html: `
        <h2>Nova poruka sa kontakt forme</h2>
        <p><strong>Ime i prezime:</strong> ${body.fullName}</p>
        <p><strong>Telefon:</strong> ${body.phone}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Poruka:</strong></p>
        <p>${body.message}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Greška pri slanju email-a sa kontakt forme:", error);
    return NextResponse.json({ error: "Slanje email-a nije uspelo." }, { status: 502 });
  }
}
