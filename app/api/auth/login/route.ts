import { verifyAccountPassword } from "@/lib/server/authStore";

type Payload = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Payload;
  const email = body.email?.trim();
  const password = body.password ?? "";

  if (!email || !password) {
    return Response.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const isValid = await verifyAccountPassword(email, password);
  if (!isValid) {
    return Response.json({ error: "Invalid credentials." }, { status: 401 });
  }

  return Response.json({ ok: true });
}
