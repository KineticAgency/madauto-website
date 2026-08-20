import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ensureSchema, pool } from "@/lib/db";
import { companyInfo } from "@/lib/data";
import { COOKIE_NAME, verifySessionToken } from "@/lib/adminAuth";

async function requireAdmin(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const token = match?.[1];
  return verifySessionToken(token);
}

function sendResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function GET(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Neautorizovano." }, { status: 401 });
  }

  await ensureSchema();
  const { rows } = await pool.query(
    `SELECT id, TO_CHAR(booking_date, 'YYYY-MM-DD') AS booking_date, booking_time,
            vehicle_type, full_name, phone, email, notes, status, source, created_at
     FROM bookings
     ORDER BY booking_date ASC, booking_time ASC`
  );
  return NextResponse.json({ bookings: rows });
}

const VALID_SOURCES = ["telefon", "licno"];

export async function POST(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Neautorizovano." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const date = typeof body?.date === "string" ? body.date : "";
  const timeSlot = typeof body?.timeSlot === "string" ? body.timeSlot : "";
  const vehicleType = typeof body?.vehicleType === "string" ? body.vehicleType : "";
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const notes = typeof body?.notes === "string" ? body.notes : "";
  const source = VALID_SOURCES.includes(body?.source) ? body.source : null;

  if (!date || !timeSlot || !vehicleType || !fullName || !phone || !source) {
    return NextResponse.json({ error: "Nedostaju obavezna polja." }, { status: 400 });
  }

  await ensureSchema();

  try {
    await pool.query(
      `INSERT INTO bookings (booking_date, booking_time, vehicle_type, full_name, phone, email, notes, source)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [date, timeSlot, vehicleType, fullName, phone, email || null, notes, source]
    );
  } catch (error) {
    const pgError = error as { code?: string };
    if (pgError.code === "23505") {
      return NextResponse.json(
        { error: "Taj termin je već zauzet. Izaberite drugi." },
        { status: 409 }
      );
    }
    console.error("Greška pri ručnom upisu termina:", error);
    return NextResponse.json({ error: "Upis termina nije uspeo." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Neautorizovano." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const id = Number(body?.id);
  const action = body?.action;

  if (!id || (action !== "cancel" && action !== "reschedule")) {
    return NextResponse.json({ error: "Nevažeći zahtev." }, { status: 400 });
  }

  await ensureSchema();

  const { rows: existingRows } = await pool.query(
    `SELECT id, TO_CHAR(booking_date, 'YYYY-MM-DD') AS booking_date, booking_time,
            vehicle_type, full_name, phone, email, notes, status
     FROM bookings WHERE id = $1`,
    [id]
  );
  const existing = existingRows[0];
  if (!existing) {
    return NextResponse.json({ error: "Termin nije pronađen." }, { status: 404 });
  }

  const resend = sendResend();
  const fromAddress = process.env.BOOKING_FROM_EMAIL ?? "MADAuto <onboarding@resend.dev>";

  if (action === "cancel") {
    await pool.query(`UPDATE bookings SET status = 'cancelled' WHERE id = $1`, [id]);

    if (resend && existing.email) {
      await resend.emails
        .send({
          from: fromAddress,
          to: existing.email,
          subject: "Vaš termin je otkazan — MADAuto",
          html: `
            <h2>Poštovani/a ${existing.full_name},</h2>
            <p>Obaveštavamo Vas da je Vaš zakazani termin otkazan:</p>
            <p><strong>Datum:</strong> ${existing.booking_date}</p>
            <p><strong>Vreme:</strong> ${existing.booking_time}</p>
            <p>Za novi termin, posetite naš sajt ili nas pozovite na ${companyInfo.phone}.</p>
            <p>MADAuto, ${companyInfo.address}</p>
          `,
        })
        .catch((e) => console.error("Greška pri slanju email-a o otkazivanju:", e));
    }

    return NextResponse.json({ ok: true });
  }

  // reschedule
  const newDate = typeof body?.date === "string" ? body.date : null;
  const newTime = typeof body?.time === "string" ? body.time : null;
  if (!newDate || !newTime) {
    return NextResponse.json({ error: "Nedostaje novi datum ili vreme." }, { status: 400 });
  }

  try {
    await pool.query(
      `UPDATE bookings SET booking_date = $1, booking_time = $2 WHERE id = $3`,
      [newDate, newTime, id]
    );
  } catch (error) {
    const pgError = error as { code?: string };
    if (pgError.code === "23505") {
      return NextResponse.json(
        { error: "Izabrani novi termin je već zauzet." },
        { status: 409 }
      );
    }
    console.error("Greška pri pomeranju termina:", error);
    return NextResponse.json({ error: "Pomeranje termina nije uspelo." }, { status: 502 });
  }

  if (resend && existing.email) {
    await resend.emails
      .send({
        from: fromAddress,
        to: existing.email,
        subject: "Vaš termin je pomeren — MADAuto",
        html: `
          <h2>Poštovani/a ${existing.full_name},</h2>
          <p>Vaš zakazani termin je pomeren na novi datum i vreme:</p>
          <p><strong>Novi datum:</strong> ${newDate}</p>
          <p><strong>Novo vreme:</strong> ${newTime}</p>
          <p>Ukoliko Vam ovaj termin ne odgovara, pozovite nas na ${companyInfo.phone}.</p>
          <p>MADAuto, ${companyInfo.address}</p>
        `,
      })
      .catch((e) => console.error("Greška pri slanju email-a o pomeranju:", e));
  }

  return NextResponse.json({ ok: true });
}
