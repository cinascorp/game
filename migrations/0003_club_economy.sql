alter table club_users add column if not exists deposited_toman integer not null default 0;
alter table club_users add column if not exists cashed_toman integer not null default 0;

insert into club_config (key, value) values ('rake_chips', '0')
  on conflict (key) do nothing;
