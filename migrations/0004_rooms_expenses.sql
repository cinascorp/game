alter table club_users add column if not exists room_id text;
alter table club_users add column if not exists table_buyin integer not null default 0;

create table if not exists club_rooms (
  id         text primary key,
  stake_id   text not null,
  state      jsonb not null,
  version    integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists club_rooms_stake_idx on club_rooms (stake_id);

create table if not exists club_expenses (
  id         text primary key,
  category   text not null,
  title      text not null,
  toman      integer not null,
  note       text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists club_expenses_created_idx on club_expenses (created_at desc);

insert into club_config (key, value) values ('rake_chips', '0')
  on conflict (key) do nothing;
