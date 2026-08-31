export interface CashoutClock {
  open: boolean;
  weekday: string;
  hour: number;
  minute: number;
  label: string;
}

const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const WEEK_FA: Record<string, string> = {
  Sun: "یکشنبه",
  Mon: "دوشنبه",
  Tue: "سه‌شنبه",
  Wed: "چهارشنبه",
  Thu: "پنجشنبه",
  Fri: "جمعه",
  Sat: "شنبه",
};

function tehranParts(ms: number) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tehran",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(ms));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    weekday: get("weekday"),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

export function cashoutWindow(now = Date.now()): CashoutClock {
  const { weekday, hour, minute } = tehranParts(now);
  const open = weekday === "Fri" && hour >= 12;
  const dayFa = WEEK_FA[weekday] ?? weekday;
  const label = open
    ? "پنجره نقد کردن باز است — تا ۱۲ شب جمعه به وقت ایران"
    : `نقد کردن فقط جمعه ۱۲ ظهر تا ۱۲ شب. الان ${dayFa} ساعت ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} به وقت ایران است.`;
  return { open, weekday, hour, minute, label };
}

export function nextFridayOpen(now = Date.now()): number {
  for (let i = 0; i < 8; i++) {
    const t = now + i * 60 * 60 * 1000;
    const w = cashoutWindow(t);
    if (w.open && (i === 0 || w.hour === 12)) return t;
  }
  const { weekday } = tehranParts(now);
  const idx = WEEK.indexOf(weekday as (typeof WEEK)[number]);
  const days = (5 - idx + 7) % 7 || 7;
  return now + days * 24 * 60 * 60 * 1000;
}
