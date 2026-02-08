# Image Search

Find similar products in stores by uploading an image. Business owners can register and upload their product images.

## Project setup (Step 1)

- **Stack:** Next.js 14, TypeScript, Tailwind CSS
- **Pages:** Home (search), Login, Register, Store Dashboard

### Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Routes

| Route | Description |
|-------|-------------|
| `/` | Search — upload image, find similar products (UI only) |
| `/login` | Business owner login (form only) |
| `/register` | Business owner registration (form only) |
| `/store/dashboard` | Store dashboard — upload products (UI only) |

Auth, password reset, and image search now rely on Supabase.

### Supabase setup

1. Create a Supabase project.
2. In the SQL editor, run `supabase/schema.sql`.
3. Create a Storage bucket named `product-images` and mark it as **public**.
4. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `EMAIL_USER`
   - `EMAIL_PASS`

### Notes

- Passwords are hashed with SHA-256 in this starter setup (upgrade to bcrypt before production).
- Image similarity uses a lightweight client-side feature extractor (8x8 color grid).

See [APP-OUTLINE.md](./APP-OUTLINE.md) for the full plan.
