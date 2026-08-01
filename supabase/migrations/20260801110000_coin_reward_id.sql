-- Exactly-once brushing rewards for Coin Drop mini-game

alter table coin_transactions
  add column if not exists reward_id text;

create unique index if not exists coin_transactions_reward_id_unique
  on coin_transactions(reward_id)
  where reward_id is not null;
