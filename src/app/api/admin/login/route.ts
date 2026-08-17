import { NextResponse } from "next/server";
import { COOKIE_NAME, createSessionToken } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const validUsername = process.env.ADMIN_USERNAME ?? "Admin";
  const validPassword = process.env.ADMIN_PASSWORD ?? "madauto2026";

  if (username !== validUsername || password !== validPassword) {
    return NextResponse.json({ error: "Pogrešno korisničko ime ili lozinka." }, { status: 401 });
  }

  const token = await createSessionToken(username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
