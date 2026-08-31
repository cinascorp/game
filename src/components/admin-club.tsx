import { useState } from "react";
import { Landmark, Spade, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearAdmin, clubApi } from "@/lib/club-client";
import type { AdminQueue, ClubUser, Expense, Tx } from "@/lib/club-types";
import { EXPENSE_CATEGORIES } from "@/lib/economy";
import { faNum, formatCard } from "@/lib/utils";

type Tab = "vault" | "payouts" | "members" | "costs" | "settings";

export function AdminClub() {
  const [pass, setPass] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("vault");
  const [queue, setQueue] = useState<AdminQueue | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [newAdmin, setNewAdmin] = useState("");
  const [exp, setExp] = useState({
    category: "vps",
    title: "",
    toman: "",
    note: "",
  });

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

  const refresh = async () => {
    const q = await clubApi.adminQueue();
    setQueue(q);
    setCardNumber(q.config.cardNumber ?? "");
    setCardName(q.config.cardName);
  };

  if (!ok) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center bg-bg px-6 text-fg">
        <Spade className="size-8 text-accent" strokeWidth={1.5} />
        <h1 className="mt-4 text-3xl font-medium">صندوق باشگاه</h1>
        <p className="mt-2 text-sm text-muted">ورود سازنده برای هزینه نگهداری، برداشت جمعه و موجودی.</p>
        <form
          className="mt-8 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => {
              await clubApi.adminLogin(pass);
              await refresh();
              setOk(true);
            });
          }}
        >
          <label className="block text-sm text-muted">
            رمز مدیریت
            <Input
              className="mt-1"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </label>
          <Button className="w-full" disabled={busy} type="submit">
            ورود به صندوق
          </Button>
        </form>
      </main>
    );
  }

  const stats = queue?.stats;
  const pendingCash = queue?.pending.filter((t) => t.kind === "cashout") ?? [];
  const recentDep = queue?.deposits ?? [];

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-bg text-fg">
      <header className="flex items-center justify-between px-4 pt-[max(0.9rem,env(safe-area-inset-top))] pb-3">
        <div className="flex items-center gap-2">
          <Wallet className="size-5 text-accent" />
          <span className="font-medium">صندوق آس کلاب</span>
        </div>
        <button
          type="button"
          className="h-11 text-sm text-muted"
          onClick={() => {
            clearAdmin();
            setOk(false);
          }}
        >
          خروج
        </button>
      </header>

      <nav className="flex gap-1 overflow-x-auto px-4 pb-3">
        {(
          [
            ["vault", "صندوق"],
            ["payouts", "برداشت"],
            ["members", "اعضا"],
            ["costs", "هزینه"],
            ["settings", "تنظیم"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`h-10 shrink-0 rounded-md px-3 text-sm ${
              tab === id ? "bg-surface-2" : "text-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="px-4 pb-24">
        {tab === "vault" && stats && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="اعضا" value={faNum(stats.users)} />
              <Stat label="رِیک ژتون" value={faNum(stats.rakeChips)} />
              <Stat label="واریزی بازیکن" value={`${faNum(stats.depositedToman)} ت`} />
              <Stat label="پرداخت شده" value={`${faNum(stats.cashedToman)} ت`} />
              <Stat label="مالیات ۱۰٪" value={`${faNum(stats.cashoutFees)} ت`} />
              <Stat label="هزینه نگهداری" value={`${faNum(stats.expensesToman)} ت`} />
            </div>
            <div className="mt-3 rounded-xl border border-border bg-surface p-4">
              <p className="text-xs text-muted">مانده صندوق</p>
              <p className="mt-1 text-3xl font-medium tabular-nums">{faNum(stats.vaultToman)} تومان</p>
              <p className="mt-2 text-xs leading-6 text-muted">
                واریزی بازیکنان منهای پرداخت جمعه و هزینه‌های سرور، هاست و دامنه.
              </p>
            </div>
            <h2 className="mt-8 text-sm text-muted">آخرین خرید ژتون</h2>
            <TxList items={recentDep} />
          </>
        )}

        {tab === "payouts" && (
          <>
            <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted">
              نقد کردن فقط جمعه ۱۲ ظهر تا ۱۲ شب. بعد از واریز کارت بازیکن، تأیید کنید.
            </div>
            <h2 className="mt-6 text-sm text-muted">در صف پرداخت</h2>
            <ul className="mt-3 space-y-2">
              {pendingCash.length === 0 && <p className="text-sm text-muted">صف خالی است.</p>}
              {pendingCash.map((t) => (
                <li key={t.id} className="rounded-lg border border-border bg-surface p-4">
                  <p className="text-sm">
                    {t.username ?? "بازیکن"} · {faNum(Math.abs(t.chips))} ژتون · {faNum(t.toman)} تومان
                  </p>
                  <p className="mt-1 text-xs text-muted" dir="ltr">
                    {t.note}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={busy}
                      onClick={() =>
                        run(async () => {
                          await clubApi.adminDecide(t.id, true);
                          await refresh();
                          toast.success("پرداخت ثبت شد");
                        })
                      }
                    >
                      واریز شد
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      disabled={busy}
                      onClick={() =>
                        run(async () => {
                          await clubApi.adminDecide(t.id, false);
                          await refresh();
                        })
                      }
                    >
                      برگرداندن ژتون
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <h2 className="mt-8 text-sm text-muted">تاریخچه برداشت</h2>
            <TxList items={queue?.cashouts ?? []} />
          </>
        )}

        {tab === "members" && (
          <ul className="space-y-2">
            {(queue?.users ?? []).map((u: ClubUser) => (
              <li key={u.id} className="rounded-lg border border-border bg-surface px-4 py-3">
                <div className="flex justify-between text-sm">
                  <span>{u.username}</span>
                  <span className="tabular-nums text-chip">{faNum(u.chips)}</span>
                </div>
                <p className="mt-1 text-xs text-muted" dir="ltr">
                  {u.phone} · واریز {faNum(u.depositedToman)} · برداشت {faNum(u.cashedToman)}
                </p>
              </li>
            ))}
          </ul>
        )}

        {tab === "costs" && (
          <>
            <p className="text-sm leading-6 text-muted">
              هزینه سرور، هاست، دامنه و نگهداری را اینجا ثبت کنید تا مانده صندوق واقعی باشد.
            </p>
            <div className="mt-4 space-y-3 rounded-xl border border-border bg-surface p-4">
              <label className="block text-sm text-muted">
                دسته
                <select
                  className="mt-1 h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
                  value={exp.category}
                  onChange={(e) => setExp({ ...exp, category: e.target.value })}
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm text-muted">
                عنوان
                <Input
                  className="mt-1"
                  placeholder="مثلاً تمدید دامنه"
                  value={exp.title}
                  onChange={(e) => setExp({ ...exp, title: e.target.value })}
                />
              </label>
              <label className="block text-sm text-muted">
                مبلغ تومان
                <Input
                  className="mt-1"
                  inputMode="numeric"
                  value={exp.toman}
                  onChange={(e) => setExp({ ...exp, toman: e.target.value })}
                />
              </label>
              <label className="block text-sm text-muted">
                یادداشت
                <Input
                  className="mt-1"
                  value={exp.note}
                  onChange={(e) => setExp({ ...exp, note: e.target.value })}
                />
              </label>
              <Button
                className="w-full"
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    await clubApi.addExpense({
                      category: exp.category,
                      title: exp.title,
                      toman: Math.trunc(Number(exp.toman) || 0),
                      note: exp.note,
                    });
                    setExp({ ...exp, title: "", toman: "", note: "" });
                    await refresh();
                    toast.success("هزینه ثبت شد");
                  })
                }
              >
                ثبت هزینه نگهداری
              </Button>
            </div>
            <ul className="mt-4 space-y-2">
              {(queue?.expenses ?? []).map((e: Expense) => (
                <li key={e.id} className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
                  <div>
                    <p className="text-sm">{e.title}</p>
                    <p className="text-xs text-muted">
                      {catFa(e.category)} · {faNum(e.toman)} تومان
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex size-11 items-center justify-center text-muted"
                    onClick={() =>
                      run(async () => {
                        await clubApi.removeExpense(e.id);
                        await refresh();
                      })
                    }
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === "settings" && (
          <>
            <label className="block text-sm text-muted">
              شماره کارت واریز بازیکنان
              <Input
                className="mt-1"
                dir="ltr"
                value={formatCard(cardNumber)}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
              />
            </label>
            <label className="mt-3 block text-sm text-muted">
              نام صاحب کارت
              <Input className="mt-1" value={cardName} onChange={(e) => setCardName(e.target.value)} />
            </label>
            <label className="mt-3 block text-sm text-muted">
              رمز جدید مدیریت
              <Input
                className="mt-1"
                type="password"
                value={newAdmin}
                onChange={(e) => setNewAdmin(e.target.value)}
              />
            </label>
            <Button
              className="mt-4 w-full"
              variant="secondary"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await clubApi.saveConfig({
                    cardNumber,
                    cardName,
                    adminPass: newAdmin,
                  });
                  await refresh();
                  toast.success("ذخیره شد");
                })
              }
            >
              ذخیره
            </Button>
            <p className="mt-4 text-xs leading-6 text-muted">
              شماره کارت فقط بعد از ورود بازیکن در صفحه خرید نشان داده می‌شود. آدرس سرور در اپ بازیکن نیست.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted">
              <Landmark className="size-4" />
              مالیات برداشت ۱۰٪ · نقد فقط جمعه
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm tabular-nums">{value}</p>
    </div>
  );
}

function TxList({ items }: { items: Tx[] }) {
  if (!items.length) return <p className="mt-3 text-sm text-muted">موردی نیست.</p>;
  return (
    <ul className="mt-3 space-y-2">
      {items.map((t) => (
        <li key={t.id} className="rounded-lg border border-border bg-surface px-4 py-3">
          <div className="flex justify-between text-sm">
            <span>{t.username ?? t.kind}</span>
            <span className="tabular-nums">{faNum(t.toman || t.chips)}</span>
          </div>
          <p className="mt-1 text-xs text-muted">{t.note}</p>
        </li>
      ))}
    </ul>
  );
}

function catFa(id: string) {
  return EXPENSE_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
