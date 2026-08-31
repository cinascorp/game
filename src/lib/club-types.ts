export interface ClubUser {
  id: string;
  username: string;
  phone: string;
  chips: number;
  cashable: number;
  depositedToman: number;
  cashedToman: number;
  roomId?: string | null;
}

export interface Tx {
  id: string;
  userId: string;
  kind: "deposit" | "cashout" | "bonus" | "win" | "lose" | "rake" | "expense";
  chips: number;
  toman: number;
  status: "pending" | "approved" | "rejected" | "done";
  note: string;
  createdAt: number;
  packId?: string;
  username?: string;
}

export interface ClubConfig {
  cardName: string;
  cardNumber?: string;
}

export interface PayInfo {
  cardName: string;
  cardNumber: string;
}

export interface ClubStats {
  users: number;
  pendingDeposits: number;
  pendingCashouts: number;
  depositedToman: number;
  cashedToman: number;
  cashoutFees: number;
  rakeChips: number;
  expensesToman: number;
  vaultToman: number;
}

export interface Expense {
  id: string;
  category: string;
  title: string;
  toman: number;
  note: string;
  createdAt: number;
}

export interface CashoutWindow {
  open: boolean;
  weekday: string;
  hour: number;
  minute: number;
  label: string;
}

export interface LobbyTable {
  id: string;
  name: string;
  tag: string;
  sb: number;
  bb: number;
  min: number;
  max: number;
  seats: number;
  humans: number;
  openSeats: number;
}

export interface AuthPayload {
  token: string;
  user: ClubUser;
}

export interface AdminQueue {
  pending: Tx[];
  users: ClubUser[];
  config: ClubConfig;
  stats: ClubStats;
  expenses: Expense[];
  cashouts: Tx[];
  deposits: Tx[];
}
