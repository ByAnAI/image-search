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
  const origin =
    request.headers.get("origin") ??
    `${request.headers.get("x-forwarded-proto") ?? "https"}://${request.headers.get("host")}`;
  const resetLink = `${origin}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Image Search" <${user}>`,
    to: email,
    subject: "Password reset request",
    text: `Reset your password using this link:\n\n${resetLink}\n\nIf you did not request this, ignore this email.`,
  });

  return Response.json({ ok: true });
}
