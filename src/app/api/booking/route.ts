import { NextResponse } from "next/server";
import { Resend } from "resend";
import { companyInfo } from "@/lib/data";

type BookingPayload = {
  date: string;
  timeSlot: string;
  vehicleType: string;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
};

function isValidPayload(data: unknown): data is BookingPayload {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.date === "string" &&
    d.date.length > 0 &&
    typeof d.timeSlot === "string" &&
    d.timeSlot.length > 0 &&
    typeof d.vehicleType === "string" &&
    d.vehicleType.length > 0 &&
    typeof d.fullName === "string" &&
    d.fullName.length > 0 &&
    typeof d.phone === "string" &&
    d.phone.length > 0 &&
    typeof d.email === "string" &&
    d.email.length > 0
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
  const notes = body.notes?.trim() ? body.notes : "—";

  try {
    await resend.emails.send({
      from: fromAddress,
      to: companyInfo.email,
      replyTo: body.email,
      subject: `Novi zahtev za termin — ${body.fullName} (${body.date} ${body.timeSlot})`,
      html: `
        <h2>Novi zahtev za zakazivanje termina</h2>
        <p><strong>Datum:</strong> ${body.date}</p>
        <p><strong>Vreme:</strong> ${body.timeSlot}</p>
        <p><strong>Tip vozila:</strong> ${body.vehicleType}</p>
        <p><strong>Ime i prezime:</strong> ${body.fullName}</p>
        <p><strong>Telefon:</strong> ${body.phone}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Napomena:</strong> ${notes}</p>
      `,
    });

    await resend.emails.send({
      from: fromAddress,
      to: body.email,
      subject: "Vaš zahtev za termin je primljen — MADAuto",
      html: `
        <h2>Hvala Vam, ${body.fullName}!</h2>
        <p>Primili smo Vaš zahtev za termin:</p>
        <p><strong>Datum:</strong> ${body.date}</p>
        <p><strong>Vreme:</strong> ${body.timeSlot}</p>
        <p><strong>Tip vozila:</strong> ${body.vehicleType}</p>
        <p>Naš tim će Vas kontaktirati na broj <strong>${body.phone}</strong> radi potvrde termina.</p>
        <p>Ukoliko imate pitanja, pozovite nas na ${companyInfo.phone} ili odgovorite na ovaj email.</p>
        <p>MADAuto, ${companyInfo.address}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Greška pri slanju email-a za zakazivanje:", error);
    return NextResponse.json({ error: "Slanje email-a nije uspelo." }, { status: 502 });
  }
}
