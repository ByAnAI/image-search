import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

type Payload = {
  featureVector?: number[];
  category?: string;
  country?: string;
  city?: string;
};

type StoreInfo = {
  email: string;
  store_name: string | null;
  country: string | null;
  city: string | null;
  website: string | null;
  phone: string | null;
};

function cosineSimilarity(a: number[], b: number[]) {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Payload;
  const featureVector = body.featureVector ?? [];
  const category = body.category?.trim() ?? "";
  const country = body.country?.trim() ?? "";
  const city = body.city?.trim() ?? "";

  if (!featureVector.length || !category) {
    return Response.json({ error: "Missing search data." }, { status: 400 });
  }

  const { data: images, error } = await supabaseAdmin
    .from("product_images")
    .select("id, store_email, category, image_url, feature_vector")
    .eq("category", category)
    .limit(500);

  if (error) {
    return Response.json({ error: "Search failed." }, { status: 500 });
  }

  const storeEmails = Array.from(new Set((images ?? []).map((item) => item.store_email)));
  const { data: stores, error: storeError } = await supabaseAdmin
    .from("stores")
    .select("email, store_name, country, city, website, phone")
    .in("email", storeEmails);

  if (storeError) {
    return Response.json({ error: "Search failed." }, { status: 500 });
  }

  const storeMap = new Map<string, StoreInfo>();
  (stores ?? []).forEach((store) => {
    storeMap.set(store.email, store);
  });

  const results = (images ?? [])
    .map((item) => {
      const store = storeMap.get(item.store_email);
      return {
        id: item.id,
        category: item.category,
        imageUrl: item.image_url,
        similarity: cosineSimilarity(featureVector, item.feature_vector ?? []),
        store: store ?? null,
      };
    })
    .filter((item) => {
      if (country || city) {
        if (!item.store) return false;
        if (country && item.store.country !== country) return false;
        if (city && item.store.city !== city) return false;
      }
      return true;
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 24);

  return Response.json({ results });
}
