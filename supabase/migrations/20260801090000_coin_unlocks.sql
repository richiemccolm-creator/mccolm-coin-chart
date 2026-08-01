-- Coin Chart — trophies, power-ups, transaction source, boost counters

alter table coin_transactions
  add column if not exists source text;

-- Allow free power-up spends (amount 0)
do $$
begin
  alter table coin_transactions drop constraint if exists coin_transactions_amount_check;
exception when undefined_object then
  null;
end $$;

alter table coin_transactions
  add constraint coin_transactions_amount_check check (amount >= 0);

alter table coin_kids
  add column if not exists double_earns_left int not null default 0,
  add column if not exists free_switch boolean not null default false;

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

alter table if exists coin_unlocks disable row level security;

grant select, insert, update, delete on table coin_unlocks to anon, authenticated;
