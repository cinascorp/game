import type {
  AdminQueue,
  AuthPayload,
  CashoutWindow,
  ClubConfig,
  ClubUser,
  Expense,
  LobbyTable,
  PayInfo,
  Tx,
} from "@/lib/club-types";
import type { Action, TableState } from "@/lib/poker";

const TOKEN_KEY = "aceclub.token";
const ADMIN_KEY = "aceclub.admin";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string | null) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

function getAdminToken() {
  return localStorage.getItem(ADMIN_KEY);
}
function setAdminToken(t: string | null) {
  if (t) localStorage.setItem(ADMIN_KEY, t);
  else localStorage.removeItem(ADMIN_KEY);
}

export function clearAdmin() {
  setAdminToken(null);
}

async function remote<T>(
  op: string,
  payload: Record<string, unknown> = {},
  asAdmin = false,
): Promise<T> {
  const token = asAdmin ? getAdminToken() : getToken();
  const res = await fetch("/api/club", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ op, ...payload }),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string } & T;
  if (!res.ok) throw new Error(data.error || "خطای سرور");
  return data;
}

export const clubApi = {
  async ping(): Promise<boolean> {
    try {
      const res = await fetch("/api/club", { method: "GET", headers: { Accept: "application/json" } });
      return res.ok;
    } catch {
      return false;
    }
  },
  async register(username: string, phone: string, password: string) {
    const data = await remote<AuthPayload>("register", { username, phone, password });
    setToken(data.token);
    return { ...data, online: true };
  },
  async login(username: string, password: string) {
    const data = await remote<AuthPayload>("login", { username, password });
    setToken(data.token);
    return { ...data, online: true };
  },
  async me() {
    const user = await remote<ClubUser>("me");
    return { user, online: true };
  },
  async payInfo() {
    return remote<PayInfo>("payInfo");
  },
  async deposit(packId: string, track: string) {
    return remote<{ tx: Tx; user: ClubUser }>("deposit", { packId, track });
  },
  async cashout(chips: number, card: string) {
    return remote<{
      tx: Tx;
      user: ClubUser;
      money: { net: number; fee: number; gross: number };
      window: CashoutWindow;
    }>("cashout", { chips, card });
  },
  async daily() {
    const user = await remote<ClubUser>("daily");
    return { user };
  },
  async history() {
    const txs = await remote<Tx[]>("history");
    return { txs };
  },
  async config() {
    return remote<{ ok: boolean; cardName: string; cashout: CashoutWindow }>("config");
  },
  async lobby() {
    return remote<{ tables: LobbyTable[]; cashout: CashoutWindow }>("lobby");
  },
  async sit(stakeId: string) {
    return remote<{ table: TableState; user: Partial<ClubUser>; humans: number }>("sit", { stakeId });
  },
  async tablePoll() {
    return remote<{ table: TableState | null; userPatch: Partial<ClubUser> | null }>("tablePoll");
  },
  async tableAct(action: Action) {
    return remote<{ table: TableState }>("tableAct", { action });
  },
  async tableNext() {
    return remote<{ table: TableState }>("tableNext");
  },
  async tableLeave() {
    return remote<{ user: ClubUser }>("tableLeave");
  },
  async adminLogin(password: string) {
    const data = await remote<{ ok: boolean; token: string }>("adminLogin", { password });
    setAdminToken(data.token);
    return data;
  },
  async adminQueue() {
    return remote<AdminQueue>("adminQueue", {}, true);
  },
  async adminDecide(txId: string, approve: boolean) {
    const tx = await remote<Tx>("adminDecide", { txId, approve }, true);
    return { tx };
  },
  async saveConfig(patch: Partial<ClubConfig> & { adminPass?: string }) {
    const config = await remote<ClubConfig>("saveConfig", patch, true);
    return { config };
  },
  async addExpense(input: { category: string; title: string; toman: number; note: string }) {
    return remote<Expense>("addExpense", input, true);
  },
  async removeExpense(id: string) {
    return remote<{ ok: boolean }>("removeExpense", { id }, true);
  },
};
