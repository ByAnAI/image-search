import nodemailer from "nodemailer";
import { createResetToken } from "@/lib/server/authStore";

type Payload = {
  email?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Payload;
  const email = body.email?.trim();

  if (!email) {
    return Response.json({ error: "Missing email." }, { status: 400 });
  }

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return Response.json({ error: "Email provider not configured." }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const token = await createResetToken(email);
  const headerOrigin = request.headers.get("origin");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("host");
  const fallbackOrigin = host ? `${forwardedProto ?? "https"}://${host}` : undefined;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    headerOrigin ??
    fallbackOrigin;

  if (!baseUrl) {
    return Response.json({ error: "Missing site URL." }, { status: 500 });
  }

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const resetLink = `${normalizedBaseUrl}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Image Search" <${user}>`,
    to: email,
    subject: "Password reset request",
    text: `Reset your password using this link:\n\n${resetLink}\n\nIf you did not request this, ignore this email.`,
    html: `<p>Reset your password using this link:</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you did not request this, ignore this email.</p>`,
  });

  return Response.json({ ok: true });
}
