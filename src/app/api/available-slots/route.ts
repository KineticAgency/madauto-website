import { NextResponse } from "next/server";
import { ensureSchema, pool } from "@/lib/db";
import { timeSlots } from "@/lib/data";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const excludeId = searchParams.get("excludeId");

  if (!date || !DATE_PATTERN.test(date)) {
    return NextResponse.json({ error: "Nevažeći datum." }, { status: 400 });
  }

  try {
    await ensureSchema();

    const { rows } = excludeId
      ? await pool.query<{ booking_time: string }>(
          `SELECT booking_time FROM bookings WHERE booking_date = $1 AND status != 'cancelled' AND id != $2`,
          [date, Number(excludeId)]
        )
      : await pool.query<{ booking_time: string }>(
          `SELECT booking_time FROM bookings WHERE booking_date = $1 AND status != 'cancelled'`,
          [date]
        );
    const takenTimes = new Set(rows.map((r) => r.booking_time));

    const slots = timeSlots.map((time) => ({
      time,
      available: !takenTimes.has(time),
    }));

    return NextResponse.json({ date, slots });
  } catch (error) {
    console.error("Greška pri učitavanju termina:", error);
    return NextResponse.json({ error: "Učitavanje termina nije uspelo." }, { status: 502 });
  }
}
