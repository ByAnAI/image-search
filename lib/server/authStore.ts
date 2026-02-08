import crypto from "crypto";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

const TOKEN_TTL_MS = 1000 * 60 * 60;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function setAccountPassword(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const { error } = await supabaseAdmin.from("store_accounts").upsert(
    {
      email: normalizedEmail,
      password_hash: hashPassword(password),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email" }
  );
  if (error) {
    throw new Error(error.message);
  }
}

export async function verifyAccountPassword(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const { data, error } = await supabaseAdmin
    .from("store_accounts")
    .select("password_hash")
    .eq("email", normalizedEmail)
    .maybeSingle();
  if (error || !data) return false;
  return data.password_hash === hashPassword(password);
}

export async function createResetToken(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const token = crypto.randomBytes(24).toString("hex");
  const { error } = await supabaseAdmin.from("password_resets").insert({
    token,
    email: normalizedEmail,
    expires_at: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
  });
  if (error) {
    throw new Error(error.message);
  }
  return token;
}

export async function consumeResetToken(token: string) {
  const { data, error } = await supabaseAdmin
    .from("password_resets")
    .select("email, expires_at")
    .eq("token", token)
    .maybeSingle();
  if (error || !data) return null;
  const expired = new Date(data.expires_at).getTime() < Date.now();
  await supabaseAdmin.from("password_resets").delete().eq("token", token);
  if (expired) return null;
  return data.email as string;
}
