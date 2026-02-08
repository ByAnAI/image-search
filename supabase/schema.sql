create extension if not exists "pgcrypto";

-- Migration helpers for existing databases
alter table if exists store_accounts
  add column if not exists id uuid default gen_random_uuid();

alter table if exists stores
  add column if not exists store_id uuid;

alter table if exists product_images
  add column if not exists store_id uuid;

do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'store_accounts_id_unique'
  ) then
    alter table store_accounts add constraint store_accounts_id_unique unique (id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'stores_store_id_unique'
  ) then
    alter table stores add constraint stores_store_id_unique unique (store_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'stores_store_id_fkey'
  ) then
    alter table stores add constraint stores_store_id_fkey
      foreign key (store_id) references store_accounts(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'product_images_store_id_fkey'
  ) then
    alter table product_images add constraint product_images_store_id_fkey
      foreign key (store_id) references store_accounts(id) on delete cascade;
  end if;
end $$;

create table if not exists store_accounts (
  email text primary key,
  id uuid unique default gen_random_uuid(),
  password_hash text not null,
  updated_at timestamptz default now()
);

create table if not exists stores (
  email text primary key,
  store_id uuid unique references store_accounts(id) on delete cascade,
  store_name text,
  country text,
  city text,
  website text,
  phone text,
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
  store_id uuid not null references store_accounts(id) on delete cascade,
  store_email text,
  category text not null,
  image_url text not null,
  feature_vector float4[] not null,
  created_at timestamptz default now()
);

create index if not exists idx_product_images_category on product_images (category);
create index if not exists idx_product_images_store_id on product_images (store_id);
