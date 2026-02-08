import { setAccountPassword } from "@/lib/server/authStore";

type Payload = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Payload;
  const email = body.email?.trim();
  const password = body.password ?? "";

  if (!email) {
    return Response.json({ error: "Missing email." }, { status: 400 });
  }

  if (password.trim().length < 8) {
    return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  await setAccountPassword(email, password);
  return Response.json({ ok: true });
}
