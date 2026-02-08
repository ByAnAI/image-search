create extension if not exists "pgcrypto";

create table if not exists stores (
  email text primary key,
  store_name text,
  country text,
  city text,
  website text,
  phone text,
  updated_at timestamptz default now()
);

create table if not exists store_accounts (
  email text primary key,
  password_hash text not null,
  updated_at timestamptz default now()
);

create table if not exists password_resets (
  token text primary key,
  email text not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  store_email text references stores(email) on delete cascade,
  category text not null,
  image_url text not null,
  feature_vector float4[] not null,
  created_at timestamptz default now()
);

create index if not exists idx_product_images_category on product_images (category);
create index if not exists idx_product_images_store on product_images (store_email);
