import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

type StoreProfile = {
  email: string;
  storeName: string;
  country: string;
  city: string;
  website?: string;
  phone?: string;
  updatedAt?: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase();
  if (!email) {
    return Response.json({ error: "Missing email." }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin
    .from("stores")
    .select("email, store_name, country, city, website, phone, updated_at")
    .eq("email", email)
    .maybeSingle();
  if (error) {
    return Response.json({ error: "Could not load profile." }, { status: 500 });
  }
  if (!data) {
    return Response.json({ profile: null });
  }
  return Response.json({
    profile: {
      email: data.email,
      storeName: data.store_name ?? "",
      country: data.country ?? "",
      city: data.city ?? "",
      website: data.website ?? "",
      phone: data.phone ?? "",
      updatedAt: data.updated_at ?? "",
    } satisfies StoreProfile,
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<StoreProfile>;
  const email = body.email?.trim().toLowerCase();
  if (!email) {
    return Response.json({ error: "Missing email." }, { status: 400 });
  }
  const { error } = await supabaseAdmin.from("stores").upsert(
    {
      email,
      store_name: body.storeName?.trim() ?? "",
      country: body.country?.trim() ?? "",
      city: body.city?.trim() ?? "",
      website: body.website?.trim() ?? "",
      phone: body.phone?.trim() ?? "",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email" }
  );
  if (error) {
    return Response.json({ error: "Could not save profile." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
