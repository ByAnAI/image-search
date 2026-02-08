import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

type ProductImage = {
  storeId: string;
  storeEmail?: string;
  category: string;
  imageUrl: string;
  featureVector: number[];
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function getStoreIdByEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from("store_accounts")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (error) return null;
  return data?.id ?? null;
}

async function getEmailByStoreId(storeId: string) {
  const { data, error } = await supabaseAdmin
    .from("store_accounts")
    .select("email")
    .eq("id", storeId)
    .maybeSingle();
  if (error) return null;
  return data?.email ?? null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeIdParam = searchParams.get("storeId")?.trim();
  const emailParam = searchParams.get("email")?.trim().toLowerCase();
  let storeId = storeIdParam ?? "";
  if (!storeId) {
    if (!emailParam) {
      return Response.json({ error: "Missing store ID or email." }, { status: 400 });
    }
    const resolvedId = await getStoreIdByEmail(emailParam);
    if (!resolvedId) {
      return Response.json({ error: "Store not found." }, { status: 404 });
    }
    storeId = resolvedId;
  }
  const { data, error } = await supabaseAdmin
    .from("product_images")
    .select("id, store_id, store_email, category, image_url, created_at")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });
  if (error) {
    return Response.json({ error: "Could not load products." }, { status: 500 });
  }
  return Response.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const category = String(formData.get("category") ?? "").trim();
  const rawEmail = String(formData.get("storeEmail") ?? "").trim();
  const rawStoreId = String(formData.get("storeId") ?? "").trim();
  const featureVectorRaw = String(formData.get("featureVector") ?? "");

  if ((!rawEmail && !rawStoreId) || !category || !(file instanceof File)) {
    return Response.json({ error: "Missing upload data." }, { status: 400 });
  }

  let featureVector: number[] = [];
  try {
    featureVector = JSON.parse(featureVectorRaw) as number[];
  } catch {
    return Response.json({ error: "Invalid feature data." }, { status: 400 });
  }

  let storeId = rawStoreId;
  let storeEmail = rawEmail ? normalizeEmail(rawEmail) : "";
  if (!storeId) {
    storeId = (await getStoreIdByEmail(storeEmail)) ?? "";
  }
  if (!storeEmail) {
    storeEmail = (await getEmailByStoreId(storeId)) ?? "";
  }
  if (!storeId) {
    return Response.json({ error: "Store not found." }, { status: 404 });
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const filePath = `${storeId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("product-images")
    .upload(filePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return Response.json({ error: "Could not upload image." }, { status: 500 });
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from("product-images")
    .getPublicUrl(filePath);

  const payload: ProductImage = {
    storeId,
    storeEmail,
    category,
    imageUrl: publicUrlData.publicUrl,
    featureVector,
  };

  const { error } = await supabaseAdmin.from("product_images").insert({
    store_id: payload.storeId,
    store_email: payload.storeEmail ?? null,
    category: payload.category,
    image_url: payload.imageUrl,
    feature_vector: payload.featureVector,
    created_at: new Date().toISOString(),
  });

  if (error) {
    return Response.json({ error: "Could not save image." }, { status: 500 });
  }

  return Response.json({ ok: true, imageUrl: payload.imageUrl });
}
