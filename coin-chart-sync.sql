-- Coin Chart — paste into Supabase → SQL Editor if not applying migrations via CLI.
-- Same project as The Ledger. No FKs into budget tables.

create extension if not exists pgcrypto;

create table if not exists coin_kids (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique
              check (slug in ('sam', 'isaac', 'ben')),
  name        text not null,
  colour      text not null,
  badge       text not null default '',
  sort_order  int not null default 0,
  balance     int not null default 0 check (balance >= 0),
  double_earns_left int not null default 0,
  free_switch boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table coin_kids
  add column if not exists double_earns_left int not null default 0,
  add column if not exists free_switch boolean not null default false;

create table if not exists coin_transactions (
  id           uuid primary key default gen_random_uuid(),
  kid_id       uuid not null references coin_kids(id) on delete cascade,
  entry_type   text not null check (entry_type in ('earned', 'spent')),
  amount       int not null check (amount >= 0),
  description  text not null,
  source       text,
  created_at   timestamptz not null default now()
);

alter table coin_transactions
  add column if not exists source text;

do $$
begin
  alter table coin_transactions drop constraint if exists coin_transactions_amount_check;
exception when undefined_object then
  null;
end $$;
alter table coin_transactions
  add constraint coin_transactions_amount_check check (amount >= 0);

create index if not exists idx_coin_transactions_kid_created
  on coin_transactions (kid_id, created_at desc);

create table if not exists coin_unlocks (
  id           uuid primary key default gen_random_uuid(),
  kid_id       uuid not null references coin_kids(id) on delete cascade,
  unlock_id    text not null,
  unlock_type  text not null check (unlock_type in ('trophy', 'powerup')),
  used         boolean not null default false,
  unlocked_at  timestamptz not null default now(),
  unique (kid_id, unlock_id)
);

create index if not exists idx_coin_unlocks_kid
  on coin_unlocks (kid_id, unlocked_at desc);

insert into coin_kids (slug, name, colour, badge, sort_order, balance)
values
  ('sam',   'Sam',   '#ff8c00', '⚡', 0, 0),
  ('isaac', 'Isaac', '#5aa9ff', '⭐', 1, 0),
  ('ben',   'Ben',   '#ff3b3b', '✊', 2, 0)
on conflict (slug) do nothing;

alter table if exists coin_kids disable row level security;
alter table if exists coin_transactions disable row level security;
alter table if exists coin_unlocks disable row level security;

grant select, insert, update, delete on table coin_kids to anon, authenticated;
grant select, insert, update, delete on table coin_transactions to anon, authenticated;
grant select, insert, update, delete on table coin_unlocks to anon, authenticated;
