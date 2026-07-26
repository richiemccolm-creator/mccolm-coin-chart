-- ============================================================================
-- Coin Chart — kids rewards schema
-- Lives in the SAME Supabase project as The Ledger (family budget app).
-- Tables are prefixed coin_* and have NO foreign keys into budget tables.
-- Mirrors localStorage shape in src/app.jsx (coins + log per kid).
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Kids (Sam, Isaac, Ben) + current coin balance
-- ----------------------------------------------------------------------------

create table if not exists coin_kids (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique
              check (slug in ('sam', 'isaac', 'ben')),
  name        text not null,
  colour      text not null,
  badge       text not null default '',
  sort_order  int not null default 0,
  balance     int not null default 0 check (balance >= 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Earn / spend ledger (newest first in the app = order by created_at desc)
-- ----------------------------------------------------------------------------

create table if not exists coin_transactions (
  id           uuid primary key default gen_random_uuid(),
  kid_id       uuid not null references coin_kids(id) on delete cascade,
  entry_type   text not null check (entry_type in ('earned', 'spent')),
  amount       int not null check (amount > 0),
  description  text not null,
  created_at   timestamptz not null default now()
);

create index if not exists idx_coin_transactions_kid_created
  on coin_transactions (kid_id, created_at desc);

-- ----------------------------------------------------------------------------
-- Seed the three heroes (idempotent)
-- ----------------------------------------------------------------------------

insert into coin_kids (slug, name, colour, badge, sort_order, balance)
values
  ('sam',   'Sam',   '#ff8c00', '⚡', 0, 0),
  ('isaac', 'Isaac', '#5aa9ff', '⭐', 1, 0),
  ('ben',   'Ben',   '#ff3b3b', '✊', 2, 0)
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- Shared-project bootstrap: allow anon key read/write (same as Ledger tables)
-- Re-enable with proper policies once Auth is wired.
-- ----------------------------------------------------------------------------

alter table if exists coin_kids disable row level security;
alter table if exists coin_transactions disable row level security;

grant select, insert, update, delete on table coin_kids to anon, authenticated;
grant select, insert, update, delete on table coin_transactions to anon, authenticated;
