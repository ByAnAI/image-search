import nodemailer from "nodemailer";

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

  await transporter.sendMail({
    from: `"Image Search" <${user}>`,
    to: email,
    subject: "Password reset request",
    text:
      "We received a request to reset your password. If you did not request this, ignore this email.",
  });

  return Response.json({ ok: true });
}
