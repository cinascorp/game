import { randomBytes } from "node:crypto";
import { getSql, type Sql } from "@/lib/db";
import { TABLES, winCashable } from "@/lib/economy";
import {
  advanceBots,
  applyAction,
  createTable,
  humanCount,
  publicView,
  startHand,
  unseat,
  type Action,
  type TableState,
} from "@/lib/poker";

type UserRow = {
  id: string;
  username: string;
  chips: number;
  cashable: number;
  room_id: string | null;
  table_buyin: number;
};

type RoomRow = {
  id: string;
  stake_id: string;
  state: unknown;
  version: number;
};

function newId(prefix: string) {
  return prefix + "_" + randomBytes(8).toString("hex");
}

function parseState(raw: unknown): TableState {
  const state = (typeof raw === "string" ? JSON.parse(raw) : raw) as TableState;
  state.queued ??= [];
  state.actAt ??= 0;
  for (const p of state.players) {
    p.buyin ??= p.stack;
  }
  return state;
}

function buyinFor(stake: (typeof TABLES)[number], chips: number) {
  return Math.min(chips, stake.max, Math.max(stake.min, stake.bb * 80));
}

async function loadRoom(sql: Sql, id: string): Promise<RoomRow | null> {
  const rows = await sql.query<RoomRow>(`select id, stake_id, state, version from club_rooms where id = $1`, [id]);
  return rows[0] ?? null;
}

async function saveRoom(sql: Sql, room: RoomRow, state: TableState) {
  const next = room.version + 1;
  const updated = await sql.query<{ id: string }>(
    `update club_rooms set state = $1::jsonb, version = $2, updated_at = now()
     where id = $3 and version = $4 returning id`,
    [JSON.stringify(state), next, room.id, room.version],
  );
  if (!updated[0]) throw new Error("میز هم‌زمان تغییر کرد. دوباره تلاش کنید.");
  room.version = next;
}

async function tickRoom(sql: Sql, room: RoomRow): Promise<TableState> {
  const before = parseState(room.state);
  const state = advanceBots(before);
  if (state === before) return state;
  const changed =
    state.street !== before.street ||
    state.toAct !== before.toAct ||
    state.handOver !== before.handOver ||
    state.pot !== before.pot ||
    state.actAt !== before.actAt ||
    JSON.stringify(state.players) !== JSON.stringify(before.players);
  if (!changed) return state;
  try {
    await saveRoom(sql, room, state);
  } catch {
    const fresh = await loadRoom(sql, room.id);
    if (!fresh) return state;
    room.version = fresh.version;
    room.state = fresh.state;
    return parseState(fresh.state);
  }
  return state;
}

export async function lobbyTables() {
  const sql = await getSql();
  const rooms = await sql.query<{ stake_id: string; state: unknown }>(
    `select stake_id, state from club_rooms`,
  );
  const byStake: Record<string, { humans: number; open: number }> = {};
  for (const t of TABLES) byStake[t.id] = { humans: 0, open: t.seats };
  for (const r of rooms) {
    const state = parseState(r.state);
    const humans = humanCount(state);
    const slot = byStake[r.stake_id];
    if (!slot) continue;
    slot.humans += humans;
    slot.open = Math.max(0, slot.open - humans);
  }
  return TABLES.map((t) => ({
    id: t.id,
    name: t.name,
    tag: t.tag,
    sb: t.sb,
    bb: t.bb,
    min: t.min,
    max: t.max,
    seats: t.seats,
    humans: byStake[t.id]?.humans ?? 0,
    openSeats: byStake[t.id]?.open ?? t.seats,
  }));
}

export async function sitAtTable(user: UserRow, stakeId: string) {
  const stake = TABLES.find((t) => t.id === stakeId);
  if (!stake) throw new Error("میز نامعتبر است.");
  if (user.room_id) throw new Error("اول از میز فعلی بلند شوید.");
  if (user.chips < stake.min) throw new Error("ژتون کافی برای این میز ندارید.");
  const buyin = buyinFor(stake, user.chips);
  const sql = await getSql();

  const rooms = await sql.query<RoomRow>(
    `select id, stake_id, state, version from club_rooms where stake_id = $1 order by updated_at desc`,
    [stakeId],
  );

  let chosen: RoomRow | null = null;
  let state: TableState | null = null;
  for (const room of rooms) {
    const s = parseState(room.state);
    if (humanCount(s) >= 6) continue;
    chosen = room;
    state = s;
    break;
  }

  if (!chosen || !state) {
    const id = newId("rm");
    state = startHand(
      createTable({
        id,
        name: stake.name,
        sb: stake.sb,
        bb: stake.bb,
        humans: [{ id: user.id, name: user.username, stack: buyin }],
      }),
    );
    await sql.query(
      `insert into club_rooms (id, stake_id, state, version) values ($1, $2, $3::jsonb, 0)`,
      [id, stakeId, JSON.stringify(state)],
    );
    chosen = { id, stake_id: stakeId, state, version: 0 };
  } else if (state.handOver || state.street === "idle") {
    state.queued = [...(state.queued ?? []), { userId: user.id, name: user.username, stack: buyin }];
    state = startHand(state);
    await saveRoom(sql, chosen, state);
  } else {
    state.queued = [...(state.queued ?? []), { userId: user.id, name: user.username, stack: buyin }];
    state.logs.push(`${user.username} در صف نشستن است.`);
    await saveRoom(sql, chosen, state);
  }

  const chips = user.chips - buyin;
  const cashable = Math.min(user.cashable, chips);
  await sql.query(
    `update club_users set chips = $1, cashable = $2, room_id = $3, table_buyin = $4 where id = $5`,
    [chips, cashable, chosen.id, buyin, user.id],
  );

  return {
    table: publicView(state, user.id),
    user: { chips, cashable, roomId: chosen.id },
    humans: humanCount(state),
  };
}

export async function pollTable(user: UserRow) {
  if (!user.room_id) return { table: null as TableState | null, userPatch: null };
  const sql = await getSql();
  const room = await loadRoom(sql, user.room_id);
  if (!room) {
    await sql.query(`update club_users set room_id = null, table_buyin = 0 where id = $1`, [user.id]);
    return { table: null, userPatch: { roomId: null as string | null } };
  }
  let state: TableState;
  try {
    state = await tickRoom(sql, room);
  } catch {
    state = parseState(room.state);
  }
  const seated = state.players.some((p) => p.userId === user.id);
  const queued = (state.queued ?? []).some((q) => q.userId === user.id);
  if (!seated && !queued) {
    await sql.query(`update club_users set room_id = null, table_buyin = 0 where id = $1`, [user.id]);
    return { table: null, userPatch: { roomId: null as string | null } };
  }
  return { table: publicView(state, user.id), userPatch: null };
}

export async function actAtTable(user: UserRow, action: Action) {
  if (!user.room_id) throw new Error("سر میز نیستید.");
  const sql = await getSql();
  const room = await loadRoom(sql, user.room_id);
  if (!room) throw new Error("میز پیدا نشد.");
  let state = advanceBots(parseState(room.state));
  const actor = state.players[state.toAct];
  if (!actor || actor.userId !== user.id || state.handOver) {
    throw new Error("نوبت شما نیست.");
  }
  state = applyAction(state, action);
  await saveRoom(sql, room, state);
  return publicView(state, user.id);
}

export async function nextHandAtTable(user: UserRow) {
  if (!user.room_id) throw new Error("سر میز نیستید.");
  const sql = await getSql();
  const room = await loadRoom(sql, user.room_id);
  if (!room) throw new Error("میز پیدا نشد.");
  let state = parseState(room.state);
  if (!state.handOver) throw new Error("دست هنوز تمام نشده.");
  const me = state.players.find((p) => p.userId === user.id);
  if (me && me.stack < state.bb) throw new Error("استک برای دست بعد کافی نیست.");
  state = startHand(state);
  await saveRoom(sql, room, state);
  return publicView(state, user.id);
}

export async function leaveTable(user: UserRow) {
  if (!user.room_id) throw new Error("سر میز نیستید.");
  const sql = await getSql();
  const room = await loadRoom(sql, user.room_id);
  if (!room) {
    await sql.query(`update club_users set room_id = null, table_buyin = 0 where id = $1`, [user.id]);
    return { chips: user.chips, cashable: user.cashable, roomId: null as string | null, delta: 0, rake: 0 };
  }
  let state = parseState(room.state);
  const queued = (state.queued ?? []).find((q) => q.userId === user.id);
  let stack = 0;
  let buyin = user.table_buyin;
  if (queued) {
    stack = queued.stack;
    buyin = queued.stack;
    state.queued = (state.queued ?? []).filter((q) => q.userId !== user.id);
  } else {
    const result = unseat(state, user.id);
    state = result.state;
    stack = result.stack;
    buyin = result.buyin || user.table_buyin;
  }
  const humansLeft = humanCount(state);
  if (humansLeft === 0) {
    await sql.query(`delete from club_rooms where id = $1`, [room.id]);
  } else {
    await saveRoom(sql, room, state);
  }
  const delta = stack - buyin;
  const chips = user.chips + stack;
  let cashable = user.cashable;
  if (delta > 0) cashable += winCashable(delta);
  cashable = Math.min(cashable, chips);
  await sql.query(
    `update club_users set chips = $1, cashable = $2, room_id = null, table_buyin = 0 where id = $3`,
    [chips, cashable, user.id],
  );
  const kind = delta >= 0 ? "win" : "lose";
  const note = `میز ${state.name}`;
  await sql.query(
    `insert into club_tx (id, user_id, kind, chips, toman, status, note)
     values ($1, $2, $3, $4, 0, 'done', $5)`,
    [newId("tx"), user.id, kind, delta, note],
  );
  if (state.sessionRake > 0 && humansLeft === 0) {
    const prev = await sql.query<{ value: string }>(`select value from club_config where key = 'rake_chips'`);
    const next = String((Number(prev[0]?.value) || 0) + state.sessionRake);
    await sql.query(
      `insert into club_config (key, value) values ('rake_chips', $1)
       on conflict (key) do update set value = $1`,
      [next],
    );
  }
  return { chips, cashable, roomId: null as string | null, delta, rake: state.sessionRake };
}
