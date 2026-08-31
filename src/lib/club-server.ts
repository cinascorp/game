import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cashoutWindow } from "@/lib/cashout-window";
import {
  actAtTable,
  leaveTable,
  lobbyTables,
  nextHandAtTable,
  pollTable,
  sitAtTable,
} from "@/lib/club-tables.server";
import { CLUB_ADMIN_BOOTSTRAP, CLUB_PAY_CARD, CLUB_PAY_NAME } from "@/lib/club-secrets.server";
import { getSql } from "@/lib/db";
import {
  CASHOUT_MAX_MULTIPLIER,
  DAILY_BONUS,
  DAILY_CASHOUT_CAP,
  EXPENSE_CATEGORIES,
  MIN_CASHOUT_CHIPS,
  PACKAGES,
  WELCOME_CHIPS,
  cashoutToman,
} from "@/lib/economy";
import type { Action } from "@/lib/poker";

function hashPass(password: string, salt: string) {
  return scryptSync(password, salt, 32).toString("hex");
}
function newSalt() {
  return randomBytes(16).toString("hex");
}
function newId(prefix: string) {
  return prefix + "_" + randomBytes(8).toString("hex");
}

type UserRow = {
  id: string;
  username: string;
  phone: string;
  pass_salt: string;
  pass_hash: string;
  chips: number;
  cashable: number;
  deposited_toman: number;
  cashed_toman: number;
  room_id: string | null;
  table_buyin: number;
};
type TxRow = {
  id: string;
  user_id: string;
  kind: string;
  chips: number;
  toman: number;
  status: string;
  note: string;
  created_at: string | Date;
  pack_id: string | null;
};

function pub(u: UserRow) {
  return {
    id: u.id,
    username: u.username,
    phone: u.phone,
    chips: u.chips,
    cashable: u.cashable,
    depositedToman: u.deposited_toman ?? 0,
    cashedToman: u.cashed_toman ?? 0,
    roomId: u.room_id,
  };
}

function mapTx(t: TxRow, username?: string) {
  const created =
    typeof t.created_at === "string" ? Date.parse(t.created_at) : t.created_at.getTime();
  return {
    id: t.id,
    userId: t.user_id,
    kind: t.kind as "deposit" | "cashout" | "bonus" | "win" | "lose" | "rake" | "expense",
    chips: t.chips,
    toman: t.toman,
    status: t.status as "pending" | "approved" | "rejected" | "done",
    note: t.note,
    createdAt: Number.isFinite(created) ? created : Date.now(),
    packId: t.pack_id ?? undefined,
    username,
  };
}

async function cfg(sql: Awaited<ReturnType<typeof getSql>>, key: string, fallback: string) {
  const rows = await sql<{ value: string }>`select value from club_config where key = ${key}`;
  return rows[0]?.value ?? fallback;
}

async function seedPayee(sql: Awaited<ReturnType<typeof getSql>>) {
  const existing = await sql<{ value: string }>`select value from club_config where key = ${"card_number"}`;
  if (!existing[0]) {
    await sql`insert into club_config (key, value) values (${"card_number"}, ${CLUB_PAY_CARD}) on conflict (key) do nothing`;
    await sql`insert into club_config (key, value) values (${"card_name"}, ${CLUB_PAY_NAME}) on conflict (key) do nothing`;
  }
}

async function userByToken(sql: Awaited<ReturnType<typeof getSql>>, token: string) {
  const rows = await sql<UserRow>`
    select u.id, u.username, u.phone, u.pass_salt, u.pass_hash, u.chips, u.cashable,
           coalesce(u.deposited_toman, 0) as deposited_toman,
           coalesce(u.cashed_toman, 0) as cashed_toman,
           u.room_id, coalesce(u.table_buyin, 0) as table_buyin
    from club_sessions s
    join club_users u on u.id = s.user_id
    where s.token = ${token}
  `;
  const u = rows[0];
  if (!u) throw new Error("نشست منقضی شده.");
  return u;
}

async function requireAdmin(sql: Awaited<ReturnType<typeof getSql>>, token: string | null) {
  if (!token) throw new Error("ورود مدیریت لازم است.");
  const rows = await sql<{ user_id: string }>`
    select user_id from club_sessions where token = ${token}
  `;
  if (rows[0]?.user_id !== "__admin__") throw new Error("ورود مدیریت لازم است.");
}

async function statsOf(sql: Awaited<ReturnType<typeof getSql>>) {
  const users = await sql<{ n: number }>`select count(*)::int as n from club_users`;
  const dep = await sql<{ n: number }>`
    select count(*)::int as n from club_tx where kind = ${"deposit"} and status = ${"pending"}
  `;
  const cash = await sql<{ n: number }>`
    select count(*)::int as n from club_tx where kind = ${"cashout"} and status = ${"pending"}
  `;
  const sums = await sql<{ d: number; c: number }>`
    select coalesce(sum(deposited_toman),0)::int as d, coalesce(sum(cashed_toman),0)::int as c
    from club_users
  `;
  const fees = await sql<{ n: number }>`
    select coalesce(sum(toman),0)::int as n from club_tx
    where kind = ${"cashout"} and status in (${"pending"}, ${"approved"}, ${"done"})
  `;
  const expenses = await sql<{ n: number }>`select coalesce(sum(toman),0)::int as n from club_expenses`;
  const rake = Number(await cfg(sql, "rake_chips", "0")) || 0;
  const deposited = sums[0]?.d ?? 0;
  const cashed = sums[0]?.c ?? 0;
  const exp = expenses[0]?.n ?? 0;
  const paidNet = cashed;
  const feeEstimate = Math.round(paidNet * (1 / 9));
  return {
    users: users[0]?.n ?? 0,
    pendingDeposits: dep[0]?.n ?? 0,
    pendingCashouts: cash[0]?.n ?? 0,
    depositedToman: deposited,
    cashedToman: cashed,
    cashoutFees: feeEstimate || (fees[0]?.n ?? 0),
    rakeChips: rake,
    expensesToman: exp,
    vaultToman: deposited - cashed - exp,
  };
}

export async function handleClub(op: string, body: Record<string, unknown>, token: string | null) {
  const sql = await getSql();
  await seedPayee(sql);

  if (op === "health" || op === "config") {
    const window = cashoutWindow();
    return {
      ok: true,
      cardName: await cfg(sql, "card_name", CLUB_PAY_NAME),
      cashout: window,
    };
  }

  if (op === "register") {
    const username = String(body.username ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const password = String(body.password ?? "");
    if (!/^[\u0600-\u06FFa-zA-Z0-9_]{3,20}$/.test(username)) {
      throw new Error("نام کاربری ۳ تا ۲۰ حرف باشد.");
    }
    if (!/^09\d{9}$/.test(phone)) throw new Error("شماره موبایل را با ۰۹ وارد کنید.");
    if (password.length < 4) throw new Error("رمز حداقل ۴ کاراکتر.");
    const exists = await sql<{ id: string }>`select id from club_users where username = ${username}`;
    if (exists[0]) throw new Error("این نام کاربری قبلاً ثبت شده.");
    const id = newId("u");
    const salt = newSalt();
    await sql`
      insert into club_users (id, username, phone, pass_salt, pass_hash, chips, cashable, deposited_toman, cashed_toman)
      values (${id}, ${username}, ${phone}, ${salt}, ${hashPass(password, salt)}, ${WELCOME_CHIPS}, ${0}, ${0}, ${0})
    `;
    const tok = newId("tok");
    await sql`insert into club_sessions (token, user_id) values (${tok}, ${id})`;
    await sql`
      insert into club_tx (id, user_id, kind, chips, toman, status, note)
      values (${newId("tx")}, ${id}, ${"bonus"}, ${WELCOME_CHIPS}, ${0}, ${"done"}, ${"ژتون خوش‌آمد — غیرقابل برداشت"})
    `;
    const user = (await sql<UserRow>`
      select id, username, phone, pass_salt, pass_hash, chips, cashable,
             coalesce(deposited_toman,0) as deposited_toman,
             coalesce(cashed_toman,0) as cashed_toman,
             room_id, coalesce(table_buyin,0) as table_buyin
      from club_users where id = ${id}
    `)[0]!;
    return { token: tok, user: pub(user) };
  }

  if (op === "login") {
    const username = String(body.username ?? "").trim();
    const password = String(body.password ?? "");
    const rows = await sql<UserRow>`
      select id, username, phone, pass_salt, pass_hash, chips, cashable,
             coalesce(deposited_toman,0) as deposited_toman,
             coalesce(cashed_toman,0) as cashed_toman,
             room_id, coalesce(table_buyin,0) as table_buyin
      from club_users where username = ${username}
    `;
    const u = rows[0];
    if (!u) throw new Error("نام کاربری یا رمز نادرست است.");
    const good = hashPass(password, u.pass_salt);
    const a = Buffer.from(good, "hex");
    const b = Buffer.from(u.pass_hash, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new Error("نام کاربری یا رمز نادرست است.");
    }
    const tok = newId("tok");
    await sql`insert into club_sessions (token, user_id) values (${tok}, ${u.id})`;
    return { token: tok, user: pub(u) };
  }

  if (op === "me") {
    if (!token) throw new Error("وارد نشده‌اید.");
    return pub(await userByToken(sql, token));
  }

  if (op === "payInfo") {
    if (!token) throw new Error("وارد نشده‌اید.");
    await userByToken(sql, token);
    return {
      cardName: await cfg(sql, "card_name", CLUB_PAY_NAME),
      cardNumber: await cfg(sql, "card_number", CLUB_PAY_CARD),
    };
  }

  if (op === "deposit") {
    if (!token) throw new Error("وارد نشده‌اید.");
    const u = await userByToken(sql, token);
    const packId = String(body.packId ?? "");
    const track = String(body.track ?? "").trim();
    const pack = PACKAGES.find((p) => p.id === packId);
    if (!pack) throw new Error("بسته نامعتبر.");
    if (track.length < 4) throw new Error("کد پیگیری را وارد کنید.");
    const chipsAdd = pack.chips + pack.bonus;
    const cashableAdd = pack.chips;
    const chips = u.chips + chipsAdd;
    const cashable = u.cashable + cashableAdd;
    const deposited = (u.deposited_toman || 0) + pack.toman;
    await sql`
      update club_users
      set chips = ${chips}, cashable = ${cashable}, deposited_toman = ${deposited}
      where id = ${u.id}
    `;
    const id = newId("tx");
    const note = `کارت‌به‌کارت · کد ${track} · ${pack.label} · واریز آنی`;
    await sql`
      insert into club_tx (id, user_id, kind, chips, toman, status, note, pack_id)
      values (${id}, ${u.id}, ${"deposit"}, ${chipsAdd}, ${pack.toman}, ${"done"}, ${note}, ${packId})
    `;
    const row = (await sql<TxRow>`select * from club_tx where id = ${id}`)[0]!;
    return {
      tx: mapTx(row),
      user: { ...pub(u), chips, cashable, depositedToman: deposited },
    };
  }

  if (op === "cashout") {
    if (!token) throw new Error("وارد نشده‌اید.");
    const u = await userByToken(sql, token);
    const window = cashoutWindow();
    if (!window.open) throw new Error(window.label);
    const chips = Math.trunc(Number(body.chips) || 0);
    const card = String(body.card ?? "").trim();
    if (chips < MIN_CASHOUT_CHIPS) throw new Error("حداقل برداشت ۱۰٬۰۰۰ ژتون است.");
    if (chips > u.cashable) throw new Error("ژتون قابل‌برداشت کافی نیست.");
    if (card.replace(/\D/g, "").length < 16) throw new Error("شماره کارت مقصد را کامل وارد کنید.");
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const today = await sql<{ n: number }>`
      select coalesce(sum(abs(chips)),0)::int as n from club_tx
      where user_id = ${u.id} and kind = ${"cashout"} and status <> ${"rejected"}
        and created_at >= ${start.toISOString()}
    `;
    if ((today[0]?.n ?? 0) + chips > DAILY_CASHOUT_CAP) {
      throw new Error("سقف برداشت روزانه پر شده است.");
    }
    const money = cashoutToman(chips);
    const cap = (u.deposited_toman || 0) * CASHOUT_MAX_MULTIPLIER;
    if ((u.cashed_toman || 0) + money.net > cap) {
      throw new Error("سقف برداشت نسبت به واریزی‌ها پر شده. اول ژتون بخرید.");
    }
    await sql`update club_users set chips = ${u.chips - chips}, cashable = ${u.cashable - chips} where id = ${u.id}`;
    const id = newId("tx");
    const note = `کارت مقصد: ${card} · مالیات باشگاه ۱۰٪ (${money.fee} تومان)`;
    await sql`
      insert into club_tx (id, user_id, kind, chips, toman, status, note)
      values (${id}, ${u.id}, ${"cashout"}, ${-chips}, ${money.net}, ${"pending"}, ${note})
    `;
    const row = (await sql<TxRow>`select * from club_tx where id = ${id}`)[0]!;
    return {
      tx: mapTx(row),
      user: { ...pub(u), chips: u.chips - chips, cashable: u.cashable - chips },
      money,
      window,
    };
  }

  if (op === "daily") {
    if (!token) throw new Error("وارد نشده‌اید.");
    const u = await userByToken(sql, token);
    const today = new Date().toISOString().slice(0, 10);
    const taken = await sql<{ v: string }>`select value as v from club_config where key = ${"daily_" + u.id}`;
    if (taken[0]?.v === today) throw new Error("جایزه امروز را گرفته‌اید.");
    await sql`update club_users set chips = ${u.chips + DAILY_BONUS} where id = ${u.id}`;
    await sql`
      insert into club_config (key, value) values (${"daily_" + u.id}, ${today})
      on conflict (key) do update set value = ${today}
    `;
    await sql`
      insert into club_tx (id, user_id, kind, chips, toman, status, note)
      values (${newId("tx")}, ${u.id}, ${"bonus"}, ${DAILY_BONUS}, ${0}, ${"done"}, ${"جایزه روزانه — غیرقابل برداشت"})
    `;
    return { ...pub(u), chips: u.chips + DAILY_BONUS };
  }

  if (op === "history") {
    if (!token) throw new Error("وارد نشده‌اید.");
    const u = await userByToken(sql, token);
    const rows = await sql<TxRow>`
      select * from club_tx where user_id = ${u.id} order by created_at desc limit 80
    `;
    return rows.map((r) => mapTx(r));
  }

  if (op === "lobby") {
    return { tables: await lobbyTables(), cashout: cashoutWindow() };
  }

  if (op === "sit") {
    if (!token) throw new Error("وارد نشده‌اید.");
    const u = await userByToken(sql, token);
    return sitAtTable(u, String(body.stakeId ?? ""));
  }

  if (op === "tablePoll") {
    if (!token) throw new Error("وارد نشده‌اید.");
    const u = await userByToken(sql, token);
    return pollTable(u);
  }

  if (op === "tableAct") {
    if (!token) throw new Error("وارد نشده‌اید.");
    const u = await userByToken(sql, token);
    const raw = body.action as { type?: string; amount?: number };
    const allowed = ["fold", "check", "call", "raise", "allin"];
    if (!raw || !allowed.includes(String(raw.type))) throw new Error("حرکت نامعتبر.");
    const action: Action =
      raw.type === "raise"
        ? { type: "raise", amount: Math.trunc(Number(raw.amount) || 0) }
        : { type: raw.type as Exclude<Action["type"], "raise"> };
    return { table: await actAtTable(u, action) };
  }

  if (op === "tableNext") {
    if (!token) throw new Error("وارد نشده‌اید.");
    const u = await userByToken(sql, token);
    return { table: await nextHandAtTable(u) };
  }

  if (op === "tableLeave") {
    if (!token) throw new Error("وارد نشده‌اید.");
    const u = await userByToken(sql, token);
    const left = await leaveTable(u);
    return { user: { ...pub(u), ...left } };
  }

  if (op === "adminLogin") {
    const password = String(body.password ?? "");
    const stored = await cfg(sql, "admin_hash", "");
    if (!stored) {
      const salt = newSalt();
      const hash = hashPass(CLUB_ADMIN_BOOTSTRAP, salt);
      await sql`insert into club_config (key, value) values (${"admin_salt"}, ${salt}) on conflict (key) do update set value = ${salt}`;
      await sql`insert into club_config (key, value) values (${"admin_hash"}, ${hash}) on conflict (key) do update set value = ${hash}`;
      if (password !== CLUB_ADMIN_BOOTSTRAP) throw new Error("رمز مدیریت نادرست است.");
    } else {
      const salt = await cfg(sql, "admin_salt", "");
      const good = hashPass(password, salt);
      const a = Buffer.from(good, "hex");
      const b = Buffer.from(stored, "hex");
      if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("رمز مدیریت نادرست است.");
    }
    const tok = newId("adm");
    await sql`insert into club_sessions (token, user_id) values (${tok}, ${"__admin__"})`;
    return { ok: true, token: tok };
  }

  if (op === "adminQueue") {
    await requireAdmin(sql, token);
    const pending = await sql<TxRow>`select * from club_tx where status = ${"pending"} order by created_at asc`;
    const cashouts = await sql<TxRow>`
      select * from club_tx where kind = ${"cashout"} order by created_at desc limit 40
    `;
    const deposits = await sql<TxRow>`
      select * from club_tx where kind = ${"deposit"} order by created_at desc limit 40
    `;
    const users = await sql<UserRow>`
      select id, username, phone, pass_salt, pass_hash, chips, cashable,
             coalesce(deposited_toman,0) as deposited_toman,
             coalesce(cashed_toman,0) as cashed_toman,
             room_id, coalesce(table_buyin,0) as table_buyin
      from club_users order by username
    `;
    const nameById = Object.fromEntries(users.map((u) => [u.id, u.username]));
    const expenses = await sql<{
      id: string;
      category: string;
      title: string;
      toman: number;
      note: string;
      created_at: string | Date;
    }>`select * from club_expenses order by created_at desc limit 80`;
    return {
      pending: pending.map((t) => mapTx(t, nameById[t.user_id])),
      users: users.map(pub),
      config: {
        cardNumber: await cfg(sql, "card_number", CLUB_PAY_CARD),
        cardName: await cfg(sql, "card_name", CLUB_PAY_NAME),
      },
      stats: await statsOf(sql),
      expenses: expenses.map((e) => ({
        id: e.id,
        category: e.category,
        title: e.title,
        toman: e.toman,
        note: e.note,
        createdAt:
          typeof e.created_at === "string" ? Date.parse(e.created_at) : e.created_at.getTime(),
      })),
      cashouts: cashouts.map((t) => mapTx(t, nameById[t.user_id])),
      deposits: deposits.map((t) => mapTx(t, nameById[t.user_id])),
      categories: EXPENSE_CATEGORIES,
      cashout: cashoutWindow(),
    };
  }

  if (op === "adminDecide") {
    await requireAdmin(sql, token);
    const txId = String(body.txId ?? "");
    const approve = Boolean(body.approve);
    const rows = await sql<TxRow>`select * from club_tx where id = ${txId}`;
    const tx = rows[0];
    if (!tx) throw new Error("تراکنش پیدا نشد.");
    const users = await sql<UserRow>`
      select id, username, phone, pass_salt, pass_hash, chips, cashable,
             coalesce(deposited_toman,0) as deposited_toman,
             coalesce(cashed_toman,0) as cashed_toman,
             room_id, coalesce(table_buyin,0) as table_buyin
      from club_users where id = ${tx.user_id}
    `;
    const u = users[0];
    if (!u) throw new Error("کاربر پیدا نشد.");
    if (tx.kind === "deposit") {
      if (!approve) {
        const chips = Math.max(0, u.chips - tx.chips);
        const pack = PACKAGES.find((p) => p.id === tx.pack_id);
        const cashCut = pack ? pack.chips : tx.chips;
        await sql`
          update club_users
          set chips = ${chips},
              cashable = ${Math.max(0, u.cashable - cashCut)},
              deposited_toman = ${Math.max(0, u.deposited_toman - tx.toman)}
          where id = ${u.id}
        `;
        await sql`update club_tx set status = ${"rejected"} where id = ${txId}`;
      } else {
        await sql`update club_tx set status = ${"approved"} where id = ${txId}`;
      }
    } else if (tx.kind === "cashout") {
      if (approve) {
        await sql`
          update club_users set cashed_toman = ${u.cashed_toman + tx.toman} where id = ${u.id}
        `;
        await sql`update club_tx set status = ${"approved"} where id = ${txId}`;
      } else {
        await sql`
          update club_users
          set chips = ${u.chips + Math.abs(tx.chips)},
              cashable = ${u.cashable + Math.abs(tx.chips)}
          where id = ${u.id}
        `;
        await sql`update club_tx set status = ${"rejected"} where id = ${txId}`;
      }
    }
    const next = (await sql<TxRow>`select * from club_tx where id = ${txId}`)[0]!;
    return mapTx(next);
  }

  if (op === "saveConfig") {
    await requireAdmin(sql, token);
    const cardNumber = String(body.cardNumber ?? "").replace(/\D/g, "");
    const cardName = String(body.cardName ?? "").trim();
    const adminPass = String(body.adminPass ?? "");
    if (cardNumber.length >= 16) {
      await sql`insert into club_config (key, value) values (${"card_number"}, ${cardNumber}) on conflict (key) do update set value = ${cardNumber}`;
    }
    if (cardName) {
      await sql`insert into club_config (key, value) values (${"card_name"}, ${cardName}) on conflict (key) do update set value = ${cardName}`;
    }
    if (adminPass.length >= 4) {
      const salt = newSalt();
      const hash = hashPass(adminPass, salt);
      await sql`insert into club_config (key, value) values (${"admin_salt"}, ${salt}) on conflict (key) do update set value = ${salt}`;
      await sql`insert into club_config (key, value) values (${"admin_hash"}, ${hash}) on conflict (key) do update set value = ${hash}`;
    }
    return {
      cardNumber: await cfg(sql, "card_number", CLUB_PAY_CARD),
      cardName: await cfg(sql, "card_name", CLUB_PAY_NAME),
    };
  }

  if (op === "addExpense") {
    await requireAdmin(sql, token);
    const category = String(body.category ?? "other");
    const title = String(body.title ?? "").trim();
    const toman = Math.max(0, Math.trunc(Number(body.toman) || 0));
    const note = String(body.note ?? "").slice(0, 200);
    if (!title) throw new Error("عنوان هزینه را بنویسید.");
    if (toman <= 0) throw new Error("مبلغ را وارد کنید.");
    const id = newId("ex");
    await sql`
      insert into club_expenses (id, category, title, toman, note)
      values (${id}, ${category}, ${title}, ${toman}, ${note})
    `;
    const row = (
      await sql<{
        id: string;
        category: string;
        title: string;
        toman: number;
        note: string;
        created_at: string | Date;
      }>`select * from club_expenses where id = ${id}`
    )[0]!;
    return {
      id: row.id,
      category: row.category,
      title: row.title,
      toman: row.toman,
      note: row.note,
      createdAt:
        typeof row.created_at === "string" ? Date.parse(row.created_at) : row.created_at.getTime(),
    };
  }

  if (op === "removeExpense") {
    await requireAdmin(sql, token);
    const id = String(body.id ?? "");
    await sql`delete from club_expenses where id = ${id}`;
    return { ok: true };
  }

  throw new Error("عملیات ناشناخته.");
}
