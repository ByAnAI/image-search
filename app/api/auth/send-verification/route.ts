import nodemailer from "nodemailer";

type Payload = {
  email?: string;
  code?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Payload;
  const email = body.email?.trim();
  const code = body.code?.trim();

  if (!email || !code) {
    return Response.json({ error: "Missing email or code." }, { status: 400 });
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
    subject: "Your verification code",
    text: `Your verification code is ${code}`,
  });

  return Response.json({ ok: true });
}
