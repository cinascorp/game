import { L as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/club-client-BoKEZhto.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function faNum(n) {
	return new Intl.NumberFormat("fa-IR").format(Math.floor(n));
}
function formatCard(n) {
	return n.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1-");
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-transform transition-opacity duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] select-none", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-surface-2 text-fg border border-border hover:bg-surface",
			ghost: "bg-transparent text-fg hover:bg-surface-2",
			danger: "bg-danger text-fg hover:opacity-90",
			felt: "bg-felt text-fg hover:bg-felt-deep"
		},
		size: {
			sm: "h-9 px-3 text-sm rounded-sm",
			md: "h-11 px-4 text-sm rounded-md",
			lg: "h-12 px-5 text-base rounded-md",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg placeholder:text-muted outline-none transition-opacity duration-150 focus:border-accent", className),
		...props
	});
}
var TOKEN_KEY = "aceclub.token";
var ADMIN_KEY = "aceclub.admin";
function getToken() {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(TOKEN_KEY);
}
function setToken(t) {
	if (t) localStorage.setItem(TOKEN_KEY, t);
	else localStorage.removeItem(TOKEN_KEY);
}
function getAdminToken() {
	return localStorage.getItem(ADMIN_KEY);
}
function setAdminToken(t) {
	if (t) localStorage.setItem(ADMIN_KEY, t);
	else localStorage.removeItem(ADMIN_KEY);
}
function clearAdmin() {
	setAdminToken(null);
}
async function remote(op, payload = {}, asAdmin = false) {
	const token = asAdmin ? getAdminToken() : getToken();
	const res = await fetch("/api/club", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...token ? { Authorization: `Bearer ${token}` } : {}
		},
		body: JSON.stringify({
			op,
			...payload
		})
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data.error || "خطای سرور");
	return data;
}
var clubApi = {
	async ping() {
		try {
			return (await fetch("/api/club", {
				method: "GET",
				headers: { Accept: "application/json" }
			})).ok;
		} catch {
			return false;
		}
	},
	async register(username, phone, password) {
		const data = await remote("register", {
			username,
			phone,
			password
		});
		setToken(data.token);
		return {
			...data,
			online: true
		};
	},
	async login(username, password) {
		const data = await remote("login", {
			username,
			password
		});
		setToken(data.token);
		return {
			...data,
			online: true
		};
	},
	async me() {
		return {
			user: await remote("me"),
			online: true
		};
	},
	async payInfo() {
		return remote("payInfo");
	},
	async deposit(packId, track) {
		return remote("deposit", {
			packId,
			track
		});
	},
	async cashout(chips, card) {
		return remote("cashout", {
			chips,
			card
		});
	},
	async daily() {
		return { user: await remote("daily") };
	},
	async history() {
		return { txs: await remote("history") };
	},
	async config() {
		return remote("config");
	},
	async lobby() {
		return remote("lobby");
	},
	async sit(stakeId) {
		return remote("sit", { stakeId });
	},
	async tablePoll() {
		return remote("tablePoll");
	},
	async tableAct(action) {
		return remote("tableAct", { action });
	},
	async tableNext() {
		return remote("tableNext");
	},
	async tableLeave() {
		return remote("tableLeave");
	},
	async adminLogin(password) {
		const data = await remote("adminLogin", { password });
		setAdminToken(data.token);
		return data;
	},
	async adminQueue() {
		return remote("adminQueue", {}, true);
	},
	async adminDecide(txId, approve) {
		return { tx: await remote("adminDecide", {
			txId,
			approve
		}, true) };
	},
	async saveConfig(patch) {
		return { config: await remote("saveConfig", patch, true) };
	},
	async addExpense(input) {
		return remote("addExpense", input, true);
	},
	async removeExpense(id) {
		return remote("removeExpense", { id }, true);
	}
};
//#endregion
export { cn as a, getToken as c, clubApi as i, setToken as l, Input as n, faNum as o, clearAdmin as r, formatCard as s, Button as t };
