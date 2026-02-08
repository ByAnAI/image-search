import { consumeResetToken, setAccountPassword } from "@/lib/server/authStore";

type Payload = {
  token?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Payload;
  const token = body.token?.trim();
  const password = body.password ?? "";

  if (!token) {
    return Response.json({ error: "Missing reset token." }, { status: 400 });
  }

  if (password.trim().length < 8) {
    return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const email = await consumeResetToken(token);
  if (!email) {
    return Response.json({ error: "Reset link is invalid or expired." }, { status: 400 });
  }

  await setAccountPassword(email, password);
  return Response.json({ ok: true });
}
