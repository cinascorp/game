import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function faNum(n: number): string {
  return new Intl.NumberFormat("fa-IR").format(Math.floor(n));
}

export function formatCard(n: string): string {
  const d = n.replace(/\D/g, "");
  return d.replace(/(\d{4})(?=\d)/g, "$1-");
}

export function uid(prefix = "id"): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return prefix + "_" + [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}
