import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

type ProductImage = {
  storeEmail: string;
  category: string;
  imageUrl: string;
  featureVector: number[];
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase();
  if (!email) {
    return Response.json({ error: "Missing email." }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin
    .from("product_images")
    .select("id, store_email, category, image_url, created_at")
    .eq("store_email", email)
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
  const featureVectorRaw = String(formData.get("featureVector") ?? "");

  if (!rawEmail || !category || !(file instanceof File)) {
    return Response.json({ error: "Missing upload data." }, { status: 400 });
  }

  let featureVector: number[] = [];
  try {
    featureVector = JSON.parse(featureVectorRaw) as number[];
  } catch {
    return Response.json({ error: "Invalid feature data." }, { status: 400 });
  }

  const storeEmail = normalizeEmail(rawEmail);
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const filePath = `${storeEmail}/${Date.now()}-${file.name}`;

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
    storeEmail,
    category,
    imageUrl: publicUrlData.publicUrl,
    featureVector,
  };

  const { error } = await supabaseAdmin.from("product_images").insert({
    store_email: payload.storeEmail,
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
