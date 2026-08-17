const COOKIE_NAME = "madauto_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dana

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "madauto-dev-secret-change-me";
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i++) {
    binary += String.fromCharCode(view[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toBase64Url(signature);
}

export async function createSessionToken(username: string) {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${username}:${expires}`;
  const signature = await hmac(payload);
  return toBase64Url(new TextEncoder().encode(`${payload}:${signature}`));
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  try {
    const padded = token.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(padded);
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;
    const [username, expiresStr, signature] = parts;

    const expected = await hmac(`${username}:${expiresStr}`);
    if (signature !== expected) return false;

    return Date.now() < Number(expiresStr);
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
