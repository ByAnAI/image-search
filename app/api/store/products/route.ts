import { createClient, SupabaseClient } from "@supabase/supabase-js";

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

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function getStoreIdByEmail(supabase: SupabaseClient, email: string) {
  const { data, error } = await supabase
    .from("store_accounts")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (error) return null;
  return data?.id ?? null;
}

async function getEmailByStoreId(supabase: SupabaseClient, storeId: string) {
  const { data, error } = await supabase
    .from("store_accounts")
    .select("email")
    .eq("id", storeId)
    .maybeSingle();
  if (error) return null;
  return data?.email ?? null;
}

function getStoragePathFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    const prefix = "/storage/v1/object/public/product-images/";
    if (!parsed.pathname.startsWith(prefix)) return null;
    return parsed.pathname.slice(prefix.length);
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return Response.json(
      { error: "Missing Supabase environment variables." },
      { status: 500 }
    );
  }
  const { searchParams } = new URL(request.url);
  const storeIdParam = searchParams.get("storeId")?.trim();
  const emailParam = searchParams.get("email")?.trim().toLowerCase();
  let storeId = storeIdParam ?? "";
  if (!storeId) {
    if (!emailParam) {
      return Response.json({ error: "Missing store ID or email." }, { status: 400 });
    }
    const resolvedId = await getStoreIdByEmail(supabase, emailParam);
    if (!resolvedId) {
      return Response.json({ error: "Store not found." }, { status: 404 });
    }
    storeId = resolvedId;
  }
  const { data, error } = await supabase
    .from("product_images")
    .select("id, store_id, store_email, category, image_url, created_at")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });
  if (error) {
    return Response.json({ error: "Could not load products." }, { status: 500 });
  }
  return Response.json({ items: data ?? [] });
}

export async function DELETE(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return Response.json(
      { error: "Missing Supabase environment variables." },
      { status: 500 }
    );
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();
  const storeIdParam = searchParams.get("storeId")?.trim();
  const emailParam = searchParams.get("email")?.trim().toLowerCase();

  if (!id) {
    return Response.json({ error: "Missing image id." }, { status: 400 });
  }

  let storeId = storeIdParam ?? "";
  if (!storeId) {
    if (!emailParam) {
      return Response.json({ error: "Missing store ID or email." }, { status: 400 });
    }
    const resolvedId = await getStoreIdByEmail(supabase, emailParam);
    if (!resolvedId) {
      return Response.json({ error: "Store not found." }, { status: 404 });
    }
    storeId = resolvedId;
  }

  const { data: image, error: loadError } = await supabase
    .from("product_images")
    .select("id, image_url")
    .eq("id", id)
    .eq("store_id", storeId)
    .maybeSingle();

  if (loadError) {
    return Response.json({ error: "Could not load image." }, { status: 500 });
  }
  if (!image) {
    return Response.json({ error: "Image not found." }, { status: 404 });
  }

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", id)
    .eq("store_id", storeId);

  if (error) {
    return Response.json({ error: "Could not delete image." }, { status: 500 });
  }

  const storagePath = getStoragePathFromUrl(image.image_url);
  if (storagePath) {
    await supabase.storage.from("product-images").remove([storagePath]);
  }

  return Response.json({ ok: true });
}

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return Response.json(
      { error: "Missing Supabase environment variables." },
      { status: 500 }
    );
  }
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
    storeId = (await getStoreIdByEmail(supabase, storeEmail)) ?? "";
  }
  if (!storeEmail) {
    storeEmail = (await getEmailByStoreId(supabase, storeId)) ?? "";
  }
  if (!storeId) {
    return Response.json({ error: "Store not found." }, { status: 404 });
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const filePath = `${storeId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return Response.json(
      {
        error: "Could not upload image.",
        details: uploadError.message,
      },
      { status: 500 }
    );
  }

  const { data: publicUrlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  const payload: ProductImage = {
    storeId,
    storeEmail,
    category,
    imageUrl: publicUrlData.publicUrl,
    featureVector,
  };

  const { error } = await supabase.from("product_images").insert({
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
