import { useEffect, useState } from "react";
import {
  ArrowRight,
  Copy,
  CreditCard,
  Landmark,
  LogOut,
  Spade,
  Store,
  Trophy,
  Volume2,
  VolumeX,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { TableView } from "@/components/table-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clubApi, getToken, setToken } from "@/lib/club-client";
import type { CashoutWindow, ClubUser, LobbyTable, PayInfo, Tx } from "@/lib/club-types";
import {
  MIN_CASHOUT_CHIPS,
  PACKAGES,
  SELL_TOMAN_PER_1000,
  WELCOME_CHIPS,
  cashoutToman,
} from "@/lib/economy";
import type { Action, TableState } from "@/lib/poker";
import { isMuted, loadMute, playSfx, setMuted, unlockAudio } from "@/lib/sfx";
import { faNum, formatCard } from "@/lib/utils";

type View = "splash" | "auth" | "lobby" | "table" | "shop" | "wallet" | "cashout" | "settings";

export function AceClub() {
  const [view, setView] = useState<View>("splash");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [user, setUser] = useState<ClubUser | null>(null);
  const [online, setOnline] = useState(false);
  const [busy, setBusy] = useState(false);
  const [table, setTable] = useState<TableState | null>(null);
  const [tables, setTables] = useState<LobbyTable[]>([]);
  const [pay, setPay] = useState<PayInfo | null>(null);
  const [windowInfo, setWindowInfo] = useState<CashoutWindow | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [mute, setMute] = useState(false);
  const [form, setForm] = useState({
    username: "",
    phone: "",
    password: "",
    track: "",
    packId: PACKAGES[0].id as string,
    cashChips: String(MIN_CASHOUT_CHIPS),
    destCard: "",
  });

  useEffect(() => {
    setMute(loadMute());
    clubApi.ping().then(setOnline);
    clubApi
      .config()
      .then((c) => setWindowInfo(c.cashout))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (view !== "lobby") return;
    let alive = true;
    const load = () => {
      clubApi
        .lobby()
        .then((d) => {
          if (!alive) return;
          setTables(d.tables);
          setWindowInfo(d.cashout);
        })
        .catch(() => {});
    };
    load();
    const id = window.setInterval(load, 4000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [view]);

  useEffect(() => {
    if (view !== "table") return;
    let alive = true;
    const tick = async () => {
      try {
        const { table: next, userPatch } = await clubApi.tablePoll();
        if (!alive) return;
        if (!next) {
          setTable(null);
          setView("lobby");
          if (userPatch) setUser((u) => (u ? { ...u, ...userPatch } : u));
          return;
        }
        setTable(next);
      } catch {
        /* keep last frame */
      }
    };
    const id = window.setInterval(tick, 800);
    void tick();
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [view]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا");
    } finally {
      setBusy(false);
    }
  };

  const sit = (t: LobbyTable) => {
    if (!user) return;
    run(async () => {
      playSfx("sit");
      const res = await clubApi.sit(t.id);
      setUser((u) => (u ? { ...u, ...res.user } : u));
      setTable(res.table);
      setView("table");
      if (res.humans > 1) toast.success(`${faNum(res.humans)} بازیکن زنده سر میز هستند`);
    });
  };

  if (view === "splash") {
    return (
      <button
        type="button"
        className="flex min-h-dvh w-full flex-col items-center justify-center bg-bg text-fg"
        onClick={() => {
          unlockAudio();
          playSfx("click");
          if (getToken()) {
            clubApi
              .me()
              .then(({ user: u }) => {
                setUser(u);
                setOnline(true);
                setView("lobby");
              })
              .catch(() => {
                setToken(null);
                setView("auth");
              });
          } else setView("auth");
        }}
      >
        <Spade className="size-10 text-accent" strokeWidth={1.5} />
        <h1 className="mt-4 text-3xl font-medium tracking-tight">آس کلاب</h1>
        <p className="mt-2 text-sm text-muted">باشگاه تگزاس هولدم</p>
        <p className="mt-8 text-xs text-muted">برای ورود و فعال شدن صدا لمس کنید</p>
      </button>
    );
  }

  if (view === "table" && table) {
    return (
      <TableView
        table={table}
        onAct={(action: Action) => {
          run(async () => {
            const { table: next } = await clubApi.tableAct(action);
            setTable(next);
          });
        }}
        onLeave={() => {
          run(async () => {
            const { user: u } = await clubApi.tableLeave();
            setUser(u);
            setTable(null);
            setView("lobby");
            playSfx("fold");
          });
        }}
        onNext={() => {
          run(async () => {
            playSfx("deal");
            const { table: next } = await clubApi.tableNext();
            setTable(next);
          });
        }}
      />
    );
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-bg text-fg">
      {view !== "auth" && user && (
        <header className="flex items-center justify-between px-4 pt-[max(0.9rem,env(safe-area-inset-top))] pb-3">
          <button type="button" onClick={() => setView("lobby")} className="flex h-11 items-center gap-2">
            <Spade className="size-5 text-accent" strokeWidth={1.6} />
            <span className="font-medium">آس کلاب</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex size-11 items-center justify-center text-muted"
              onClick={() => {
                const next = !isMuted();
                setMuted(next);
                setMute(next);
                if (!next) playSfx("click");
              }}
              aria-label={mute ? "صدا روشن" : "صدا خاموش"}
            >
              {mute ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
            <span className={`size-1.5 rounded-full ${online ? "bg-win" : "bg-muted"}`} />
            <span className="text-sm tabular-nums text-chip">{faNum(user.chips)}</span>
          </div>
        </header>
      )}

      {view === "auth" && (
        <main className="flex min-h-dvh flex-col justify-center px-6">
          <Spade className="size-8 text-accent" strokeWidth={1.5} />
          <h1 className="mt-4 text-3xl font-medium">آس کلاب</h1>
          <p className="mt-2 text-sm text-muted">ورود به باشگاه زنده. میزها آنلاین‌اند.</p>
          <div className="mt-8 flex gap-2 rounded-lg bg-surface p-1">
            <button
              type="button"
              className={`h-10 flex-1 rounded-md text-sm ${mode === "login" ? "bg-surface-2" : "text-muted"}`}
              onClick={() => setMode("login")}
            >
              ورود
            </button>
            <button
              type="button"
              className={`h-10 flex-1 rounded-md text-sm ${mode === "register" ? "bg-surface-2" : "text-muted"}`}
              onClick={() => setMode("register")}
            >
              عضویت
            </button>
          </div>
          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              unlockAudio();
              run(async () => {
                const res =
                  mode === "register"
                    ? await clubApi.register(form.username, form.phone, form.password)
                    : await clubApi.login(form.username, form.password);
                setUser(res.user);
                setOnline(true);
                setView("lobby");
                playSfx("sit");
                toast.success("خوش آمدید");
              });
            }}
          >
            <label className="block text-sm text-muted">
              نام کاربری
              <Input
                className="mt-1"
                value={form.username}
                autoComplete="username"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </label>
            {mode === "register" && (
              <label className="block text-sm text-muted">
                موبایل
                <Input
                  className="mt-1"
                  inputMode="numeric"
                  placeholder="09xxxxxxxxx"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
            )}
            <label className="block text-sm text-muted">
              رمز
              <Input
                className="mt-1"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>
            <Button className="mt-2 w-full" disabled={busy} type="submit">
              {mode === "login" ? "ورود" : "ساخت حساب"}
            </Button>
          </form>
          <p className="mt-6 text-xs leading-6 text-muted">
            با عضویت {faNum(WELCOME_CHIPS)} ژتون تمرینی می‌گیرید. ژتون خوش‌آمد قابل نقد شدن نیست.
          </p>
        </main>
      )}

      {view === "lobby" && user && (
        <main className="px-4 pb-24">
          <section className="rounded-xl bg-surface p-4">
            <p className="text-xs text-muted">موجودی ژتون</p>
            <p className="mt-1 text-3xl font-medium tabular-nums">{faNum(user.chips)}</p>
            <p className="mt-1 text-xs text-muted">
              قابل برداشت {faNum(user.cashable)} · {user.username}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                onClick={() => {
                  playSfx("click");
                  run(async () => {
                    setPay(await clubApi.payInfo());
                    setView("shop");
                  });
                }}
              >
                <Store className="size-4" /> خرید ژتون
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  playSfx("click");
                  setView("cashout");
                }}
              >
                <Landmark className="size-4" /> فروش ژتون
              </Button>
            </div>
          </section>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                run(async () => {
                  const { user: u } = await clubApi.daily();
                  setUser(u);
                  playSfx("chip");
                  toast.success("جایزه روزانه واریز شد");
                })
              }
            >
              <Trophy className="size-4" /> روزانه
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                run(async () => {
                  const { txs: list } = await clubApi.history();
                  setTxs(list);
                  setView("wallet");
                })
              }
            >
              <Wallet className="size-4" /> گردش
            </Button>
            <Button variant="secondary" onClick={() => setView("settings")}>
              حساب
            </Button>
          </div>

          <h2 className="mt-8 text-sm text-muted">میزهای زنده</h2>
          <div className="mt-3 space-y-2">
            {(tables.length ? tables : []).map((t) => {
              const locked = user.chips < t.min;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => sit(t)}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-right disabled:opacity-50"
                  disabled={locked || busy}
                >
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-muted">
                      {t.tag} · بلایند {faNum(t.sb)}/{faNum(t.bb)} · {faNum(t.humans)} بازیکن آنلاین
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted">{locked ? "ژتون کم" : "ورود به میز"}</p>
                    <p className="text-sm tabular-nums">{faNum(t.min)}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs leading-6 text-muted">
            بازیکنان واقعی سر یک میز می‌نشینند. صندلی خالی با حریف باشگاه پر می‌شود. نقد کردن فقط جمعه
            ۱۲ ظهر تا ۱۲ شب با مالیات ۱۰٪ باشگاه.
          </p>
        </main>
      )}

      {view === "shop" && user && (
        <main className="px-4 pb-24">
          <Back onClick={() => setView("lobby")} />
          <h1 className="text-2xl font-medium">خرید ژتون</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            مبلغ بسته را کارت‌به‌کارت کنید، کد پیگیری را بفرستید. ژتون همان لحظه به حساب بازی می‌نشیند.
          </p>
          <div className="mt-4 rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-muted">شماره کارت باشگاه</p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <p className="font-medium tracking-wide" dir="ltr">
                {pay ? formatCard(pay.cardNumber) : "پس از ورود نمایش داده می‌شود"}
              </p>
              <button
                type="button"
                className="flex size-11 items-center justify-center text-muted"
                onClick={() => {
                  if (!pay) return;
                  void navigator.clipboard?.writeText(pay.cardNumber.replace(/\s/g, ""));
                  playSfx("click");
                  toast.success("شماره کارت کپی شد");
                }}
              >
                <Copy className="size-4" />
              </button>
            </div>
            <p className="text-xs text-muted">{pay?.cardName}</p>
          </div>
          <div className="mt-4 space-y-2">
            {PACKAGES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setForm({ ...form, packId: p.id })}
                className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 ${
                  form.packId === p.id ? "border-accent bg-surface" : "border-border bg-surface"
                }`}
              >
                <div>
                  <p>{p.label}</p>
                  <p className="text-xs text-muted">
                    {faNum(p.chips)} ژتون
                    {p.bonus ? ` + ${faNum(p.bonus)} هدیه` : ""}
                  </p>
                </div>
                <p className="text-sm tabular-nums">{faNum(p.toman)} تومان</p>
              </button>
            ))}
          </div>
          <label className="mt-4 block text-sm text-muted">
            کد پیگیری / چهار رقم آخر واریز
            <Input
              className="mt-1"
              value={form.track}
              onChange={(e) => setForm({ ...form, track: e.target.value })}
            />
          </label>
          <Button
            className="mt-4 w-full"
            disabled={busy}
            onClick={() =>
              run(async () => {
                const { user: u } = await clubApi.deposit(form.packId, form.track);
                setUser(u);
                playSfx("win");
                toast.success("ژتون‌ها همین الان به حساب شما نشست");
                setView("lobby");
              })
            }
          >
            <CreditCard className="size-4" /> واریز کردم، ژتون بده
          </Button>
        </main>
      )}

      {view === "cashout" && user && (
        <main className="px-4 pb-24">
          <Back onClick={() => setView("lobby")} />
          <h1 className="text-2xl font-medium">فروش ژتون</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            هر ۱۰۰۰ ژتون قابل‌برداشت معادل {faNum(SELL_TOMAN_PER_1000)} تومان است. مالیات باشگاه ۱۰٪ کسر
            می‌شود. فقط جمعه ۱۲ ظهر تا ۱۲ شب به وقت ایران.
          </p>
          <div
            className={`mt-3 rounded-lg border px-4 py-3 text-sm ${
              windowInfo?.open ? "border-win/40 bg-surface text-win" : "border-border bg-surface text-muted"
            }`}
          >
            {windowInfo?.label ?? "در حال بررسی پنجره نقد…"}
          </div>
          <p className="mt-3 text-sm">قابل برداشت: {faNum(user.cashable)}</p>
          <label className="mt-4 block text-sm text-muted">
            تعداد ژتون
            <Input
              className="mt-1"
              inputMode="numeric"
              value={form.cashChips}
              onChange={(e) => setForm({ ...form, cashChips: e.target.value })}
            />
          </label>
          {(() => {
            const n = Math.trunc(Number(form.cashChips) || 0);
            const m = cashoutToman(n);
            return (
              <p className="mt-2 text-sm text-muted">
                خالص دریافتی {faNum(m.net)} تومان (مالیات باشگاه {faNum(m.fee)})
              </p>
            );
          })()}
          <label className="mt-4 block text-sm text-muted">
            شماره کارت شما
            <Input
              className="mt-1"
              dir="ltr"
              value={form.destCard}
              onChange={(e) => setForm({ ...form, destCard: e.target.value })}
            />
          </label>
          <Button
            className="mt-4 w-full"
            disabled={busy || windowInfo?.open === false}
            onClick={() =>
              run(async () => {
                const { user: u } = await clubApi.cashout(
                  Math.trunc(Number(form.cashChips) || 0),
                  form.destCard,
                );
                setUser(u);
                playSfx("chip");
                toast.success("درخواست نقد ثبت شد. تا ۱۲ شب جمعه واریز می‌شود.");
                setView("lobby");
              })
            }
          >
            ثبت برداشت جمعه
          </Button>
        </main>
      )}

      {view === "wallet" && (
        <main className="px-4 pb-24">
          <Back onClick={() => setView("lobby")} />
          <h1 className="text-2xl font-medium">گردش حساب</h1>
          <ul className="mt-4 space-y-2">
            {txs.length === 0 && <p className="text-sm text-muted">هنوز تراکنشی نیست.</p>}
            {txs.map((t) => (
              <li key={t.id} className="rounded-lg border border-border bg-surface px-4 py-3">
                <div className="flex justify-between text-sm">
                  <span>{kindFa(t.kind)}</span>
                  <span className="tabular-nums">{faNum(t.chips)}</span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {statusFa(t.status)} · {t.note}
                </p>
              </li>
            ))}
          </ul>
        </main>
      )}

      {view === "settings" && (
        <main className="px-4 pb-24">
          <Back onClick={() => setView("lobby")} />
          <h1 className="text-2xl font-medium">حساب</h1>
          <p className="mt-2 text-sm text-muted">{user?.username}</p>
          <Button
            className="mt-6 w-full"
            variant="ghost"
            onClick={() => {
              setToken(null);
              setUser(null);
              setView("auth");
            }}
          >
            <LogOut className="size-4" /> خروج از حساب
          </Button>
        </main>
      )}
    </div>
  );
}

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="mb-4 flex h-11 items-center gap-1 text-sm text-muted" onClick={onClick}>
      <ArrowRight className="size-4" /> لابی
    </button>
  );
}

function kindFa(k: Tx["kind"]) {
  switch (k) {
    case "deposit":
      return "خرید";
    case "cashout":
      return "برداشت";
    case "bonus":
      return "جایزه";
    case "win":
      return "برد";
    case "lose":
      return "باخت";
    default:
      return k;
  }
}
function statusFa(s: Tx["status"]) {
  switch (s) {
    case "pending":
      return "در انتظار واریز";
    case "approved":
      return "پرداخت شد";
    case "rejected":
      return "رد شده";
    default:
      return "انجام شد";
  }
}
