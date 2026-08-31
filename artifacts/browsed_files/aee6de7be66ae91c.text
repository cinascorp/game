create table if not exists club_users (
  id         text primary key,
  username   text not null unique,
  phone      text not null,
  pass_salt  text not null,
  pass_hash  text not null,
  chips      integer not null default 0,
  cashable   integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists club_sessions (
  token      text primary key,
  user_id    text not null,
  created_at timestamptz not null default now()
);

create table if not exists club_tx (
  id         text primary key,
  user_id    text not null,
  kind       text not null,
  chips      integer not null,
  toman      integer not null default 0,
  status     text not null,
  note       text not null default '',
  pack_id    text,
  created_at timestamptz not null default now()
);

create table if not exists club_config (
  key   text primary key,
  value text not null
);

create index if not exists club_tx_user_idx on club_tx (user_id, created_at desc);
create index if not exists club_tx_status_idx on club_tx (status);
