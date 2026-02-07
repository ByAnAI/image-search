import { promises as fs } from "fs";
import path from "path";

type StoreProfile = {
  email: string;
  storeName: string;
  country: string;
  city: string;
  website?: string;
  phone?: string;
  updatedAt?: string;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "store-profiles.json");

async function readProfiles(): Promise<Record<string, StoreProfile>> {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    return JSON.parse(raw) as Record<string, StoreProfile>;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

async function writeProfiles(data: Record<string, StoreProfile>) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase();
  if (!email) {
    return Response.json({ error: "Missing email." }, { status: 400 });
  }
  const profiles = await readProfiles();
  return Response.json({ profile: profiles[email] ?? null });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<StoreProfile>;
  const email = body.email?.trim().toLowerCase();
  if (!email) {
    return Response.json({ error: "Missing email." }, { status: 400 });
  }
  const profiles = await readProfiles();
  profiles[email] = {
    email,
    storeName: body.storeName?.trim() ?? "",
    country: body.country?.trim() ?? "",
    city: body.city?.trim() ?? "",
    website: body.website?.trim() ?? "",
    phone: body.phone?.trim() ?? "",
    updatedAt: new Date().toISOString(),
  };
  await writeProfiles(profiles);
  return Response.json({ ok: true });
}
