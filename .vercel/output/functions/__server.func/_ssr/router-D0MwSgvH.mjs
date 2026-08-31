import { o as __toESM } from "../_runtime.mjs";
import { L as require_jsx_runtime, _ as useRouter, f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/economy-DACAL4TE.js
var WELCOME_CHIPS = 5e3;
var CASHOUT_FEE_BPS = 1e3;
var SELL_TOMAN_PER_1000 = 4e3;
var MIN_CASHOUT_CHIPS = 1e4;
var WIN_CASHABLE_BPS = 3e3;
var PACKAGES = [
	{
		id: "p1",
		label: "شروع",
		chips: 1e4,
		bonus: 0,
		toman: 5e4
	},
	{
		id: "p2",
		label: "نقره‌ای",
		chips: 5e4,
		bonus: 8e3,
		toman: 2e5
	},
	{
		id: "p3",
		label: "طلایی",
		chips: 12e4,
		bonus: 25e3,
		toman: 4e5
	},
	{
		id: "p4",
		label: "الماس",
		chips: 35e4,
		bonus: 9e4,
		toman: 1e6
	},
	{
		id: "p5",
		label: "رویال",
		chips: 8e5,
		bonus: 28e4,
		toman: 2e6
	}
];
var TABLES = [
	{
		id: "micro",
		name: "میکرو",
		tag: "تمرین",
		sb: 25,
		bb: 50,
		min: 1500,
		max: 8e3,
		seats: 6
	},
	{
		id: "low",
		name: "پایین",
		tag: "پررفت‌وآمد",
		sb: 100,
		bb: 200,
		min: 6e3,
		max: 4e4,
		seats: 6
	},
	{
		id: "turbo",
		name: "توربو",
		tag: "پات سریع",
		sb: 250,
		bb: 500,
		min: 16e3,
		max: 8e4,
		seats: 6
	},
	{
		id: "mid",
		name: "متوسط",
		tag: "باشگاه",
		sb: 500,
		bb: 1e3,
		min: 4e4,
		max: 2e5,
		seats: 6
	},
	{
		id: "high",
		name: "های‌رولر",
		tag: "وی‌آی‌پی",
		sb: 2500,
		bb: 5e3,
		min: 2e5,
		max: 1e6,
		seats: 6
	}
];
var EXPENSE_CATEGORIES = [
	{
		id: "vps",
		label: "سرور"
	},
	{
		id: "host",
		label: "هاست"
	},
	{
		id: "domain",
		label: "دامنه"
	},
	{
		id: "ssl",
		label: "گواهی امنیتی"
	},
	{
		id: "ads",
		label: "تبلیغات"
	},
	{
		id: "other",
		label: "سایر"
	}
];
function rakeAmount(pot, bb) {
	const raw = Math.floor(pot * 500 / 1e4);
	const cap = bb * 10;
	return Math.min(raw, cap, Math.max(0, pot - 1));
}
function cashoutToman(chips) {
	const gross = Math.floor(chips / 1e3 * SELL_TOMAN_PER_1000);
	const fee = Math.floor(gross * CASHOUT_FEE_BPS / 1e4);
	return {
		gross,
		fee,
		net: gross - fee
	};
}
function winCashable(delta) {
	if (delta <= 0) return 0;
	return Math.floor(delta * WIN_CASHABLE_BPS / 1e4);
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-D0MwSgvH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-JHhPN3U-.css";
var APP_NAME = "آس کلاب";
var Route$3 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#0c0f0d"
			},
			{
				name: "description",
				content: "باشگاه پوکر تگزاس هولدم آس کلاب"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "fa",
		dir: "rtl",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "top-center",
				toastOptions: { style: {
					background: "#141a17",
					color: "#efe8d8",
					border: "1px solid #2a332e",
					fontFamily: "Vazirmatn, Tahoma, sans-serif"
				} }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$1 = () => import("./routes-4VSfim_N.mjs");
var Route$2 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./modir-DAI9wp1J.mjs");
var Route$1 = createFileRoute("/modir")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var WEEK_FA = {
	Sun: "یکشنبه",
	Mon: "دوشنبه",
	Tue: "سه‌شنبه",
	Wed: "چهارشنبه",
	Thu: "پنجشنبه",
	Fri: "جمعه",
	Sat: "شنبه"
};
function tehranParts(ms) {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Tehran",
		weekday: "short",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).formatToParts(new Date(ms));
	const get = (type) => parts.find((p) => p.type === type)?.value ?? "";
	return {
		weekday: get("weekday"),
		hour: Number(get("hour")),
		minute: Number(get("minute"))
	};
}
function cashoutWindow(now = Date.now()) {
	const { weekday, hour, minute } = tehranParts(now);
	const open = weekday === "Fri" && hour >= 12;
	const dayFa = WEEK_FA[weekday] ?? weekday;
	return {
		open,
		weekday,
		hour,
		minute,
		label: open ? "پنجره نقد کردن باز است — تا ۱۲ شب جمعه به وقت ایران" : `نقد کردن فقط جمعه ۱۲ ظهر تا ۱۲ شب. الان ${dayFa} ساعت ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} به وقت ایران است.`
	};
}
var _0002_club_default = "create table if not exists club_users (\n  id         text primary key,\n  username   text not null unique,\n  phone      text not null,\n  pass_salt  text not null,\n  pass_hash  text not null,\n  chips      integer not null default 0,\n  cashable   integer not null default 0,\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists club_sessions (\n  token      text primary key,\n  user_id    text not null,\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists club_tx (\n  id         text primary key,\n  user_id    text not null,\n  kind       text not null,\n  chips      integer not null,\n  toman      integer not null default 0,\n  status     text not null,\n  note       text not null default '',\n  pack_id    text,\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists club_config (\n  key   text primary key,\n  value text not null\n);\n\ncreate index if not exists club_tx_user_idx on club_tx (user_id, created_at desc);\ncreate index if not exists club_tx_status_idx on club_tx (status);\n";
var _0003_club_economy_default = "alter table club_users add column if not exists deposited_toman integer not null default 0;\nalter table club_users add column if not exists cashed_toman integer not null default 0;\n\ninsert into club_config (key, value) values ('rake_chips', '0')\n  on conflict (key) do nothing;\n";
var _0004_rooms_expenses_default = "alter table club_users add column if not exists room_id text;\nalter table club_users add column if not exists table_buyin integer not null default 0;\n\ncreate table if not exists club_rooms (\n  id         text primary key,\n  stake_id   text not null,\n  state      jsonb not null,\n  version    integer not null default 0,\n  updated_at timestamptz not null default now()\n);\n\ncreate index if not exists club_rooms_stake_idx on club_rooms (stake_id);\n\ncreate table if not exists club_expenses (\n  id         text primary key,\n  category   text not null,\n  title      text not null,\n  toman      integer not null,\n  note       text not null default '',\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists club_expenses_created_idx on club_expenses (created_at desc);\n\ninsert into club_config (key, value) values ('rake_chips', '0')\n  on conflict (key) do nothing;\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({
			"/migrations/0002_club.sql": _0002_club_default,
			"/migrations/0003_club_economy.sql": _0003_club_economy_default,
			"/migrations/0004_rooms_expenses.sql": _0004_rooms_expenses_default
		});
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
var RANK_LABEL = [
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"J",
	"Q",
	"K",
	"A"
];
var SUIT_LABEL = [
	"s",
	"h",
	"d",
	"c"
];
var HAND_NAMES = [
	"کارت بالا",
	"جفت",
	"دو جفت",
	"سه مشابه",
	"استریت",
	"فلاش",
	"فول هاوس",
	"چهار مشابه",
	"استریت فلاش",
	"رویال فلاش"
];
var BOT_ROSTER = [
	{
		name: "رضا",
		style: "tight"
	},
	{
		name: "سارا",
		style: "loose"
	},
	{
		name: "نیما",
		style: "aggro"
	},
	{
		name: "مهسا",
		style: "station"
	},
	{
		name: "کامران",
		style: "maniac"
	}
];
function cardRank(c) {
	return c % 13;
}
function cardSuit(c) {
	return Math.floor(c / 13);
}
function isRed(c) {
	const s = cardSuit(c);
	return s === 1 || s === 2;
}
function combos(arr, k) {
	const out = [];
	const acc = [];
	const rec = (start) => {
		if (acc.length === k) {
			out.push(acc.slice());
			return;
		}
		for (let i = start; i < arr.length; i++) {
			acc.push(arr[i]);
			rec(i + 1);
			acc.pop();
		}
	};
	rec(0);
	return out;
}
function eval5(cards) {
	const ranks = cards.map(cardRank).sort((a, b) => b - a);
	const suits = cards.map(cardSuit);
	const counts = new Array(13).fill(0);
	for (const r of ranks) counts[r]++;
	const flush = suits.every((s) => s === suits[0]);
	const uniq = [...new Set(ranks)].sort((a, b) => b - a);
	let straightHigh = -1;
	if (uniq.length === 5) {
		if (uniq[0] - uniq[4] === 4) straightHigh = uniq[0];
		else if (uniq[0] === 12 && uniq[1] === 3 && uniq[2] === 2 && uniq[3] === 1 && uniq[4] === 0) straightHigh = 3;
	}
	const groups = counts.map((n, r) => ({
		n,
		r
	})).filter((g) => g.n > 0).sort((a, b) => b.n - a.n || b.r - a.r);
	const pack = (cat, ks) => {
		const k = [...ks];
		while (k.length < 5) k.push(0);
		let s = cat;
		for (const x of k.slice(0, 5)) s = s * 13 + x;
		return s;
	};
	if (flush && straightHigh >= 0) return pack(straightHigh === 12 ? 9 : 8, [straightHigh]);
	if (groups[0]?.n === 4) return pack(7, [groups[0].r, groups[1].r]);
	if (groups[0]?.n === 3 && groups[1]?.n === 2) return pack(6, [groups[0].r, groups[1].r]);
	if (flush) return pack(5, ranks);
	if (straightHigh >= 0) return pack(4, [straightHigh]);
	if (groups[0]?.n === 3) return pack(3, [
		groups[0].r,
		groups[1].r,
		groups[2].r
	]);
	if (groups[0]?.n === 2 && groups[1]?.n === 2) return pack(2, [
		groups[0].r,
		groups[1].r,
		groups[2].r
	]);
	if (groups[0]?.n === 2) return pack(1, [
		groups[0].r,
		groups[1].r,
		groups[2].r,
		groups[3].r
	]);
	return pack(0, ranks);
}
function eval7(cards) {
	const five = cards.length <= 5 ? [cards] : combos(cards, 5);
	let best = -1;
	for (const c of five) {
		const s = eval5(c);
		if (s > best) best = s;
	}
	let cat = 0;
	let x = best;
	for (let i = 0; i < 5; i++) x = Math.floor(x / 13);
	cat = x;
	return {
		score: best,
		category: Math.min(9, Math.max(0, cat))
	};
}
function handLabel(cards) {
	if (cards.length < 2) return "";
	return HAND_NAMES[eval7(cards).category] ?? "";
}
function makeDeck() {
	const d = Array.from({ length: 52 }, (_, i) => i);
	for (let i = d.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[d[i], d[j]] = [d[j], d[i]];
	}
	return d;
}
function draw(state, n) {
	const out = [];
	for (let i = 0; i < n; i++) out.push(state.deck.pop());
	return out;
}
function nextOccupied(state, from, pred) {
	const n = state.players.length;
	for (let i = 1; i <= n; i++) {
		const idx = (from + i) % n;
		const p = state.players[idx];
		if (p.stack <= 0 && !p.totalBet) continue;
		if (pred && !pred(p)) continue;
		return idx;
	}
	return from;
}
function canAct(p) {
	return !p.folded && !p.allIn && p.stack > 0;
}
function createTable(opts) {
	const humans = opts.humans.map((h) => ({
		id: h.id,
		userId: h.id,
		name: h.name,
		isHero: false,
		isBot: false,
		buyin: h.stack,
		stack: h.stack,
		hole: [],
		folded: false,
		allIn: false,
		bet: 0,
		totalBet: 0,
		hasActed: false,
		style: "tight"
	}));
	const bots = BOT_ROSTER.slice(0, Math.max(0, 6 - humans.length)).map((b, i) => {
		const jitter = .7 + Math.random() * .7;
		const stack = Math.max(opts.bb * 40, Math.floor((humans[0]?.stack ?? opts.bb * 80) * jitter));
		return {
			id: `bot_${i}`,
			name: b.name,
			isHero: false,
			isBot: true,
			buyin: stack,
			stack,
			hole: [],
			folded: false,
			allIn: false,
			bet: 0,
			totalBet: 0,
			hasActed: false,
			style: b.style
		};
	});
	const players = [...humans, ...bots];
	return {
		id: opts.id,
		name: opts.name,
		sb: opts.sb,
		bb: opts.bb,
		players,
		button: 0,
		street: "idle",
		board: [],
		deck: [],
		pot: 0,
		rakeTaken: 0,
		sessionRake: 0,
		toAct: 0,
		currentBet: 0,
		minRaise: opts.bb,
		logs: ["میز زنده آماده است."],
		winners: null,
		handOver: true,
		actAt: 0,
		queued: []
	};
}
function processQueue(prev) {
	const state = JSON.parse(JSON.stringify(prev));
	const q = state.queued ?? [];
	state.queued = [];
	for (const h of q) {
		if (state.players.some((p) => p.userId === h.userId)) continue;
		const idx = state.players.findIndex((p) => p.isBot);
		if (idx < 0) continue;
		state.players[idx] = {
			id: h.userId,
			userId: h.userId,
			name: h.name,
			isHero: false,
			isBot: false,
			buyin: h.stack,
			stack: h.stack,
			hole: [],
			folded: false,
			allIn: false,
			bet: 0,
			totalBet: 0,
			hasActed: false,
			style: "tight"
		};
		state.logs.push(`${h.name} به میز نشست.`);
	}
	return state;
}
function post(state, idx, amount) {
	const p = state.players[idx];
	const put = Math.min(amount, p.stack);
	p.stack -= put;
	p.bet += put;
	p.totalBet += put;
	state.pot += put;
	if (p.stack === 0) p.allIn = true;
}
function startHand(prev) {
	const queued = processQueue(prev);
	const state = JSON.parse(JSON.stringify(queued));
	state.deck = makeDeck();
	state.board = [];
	state.pot = 0;
	state.rakeTaken = 0;
	state.winners = null;
	state.handOver = false;
	state.street = "preflop";
	state.currentBet = 0;
	state.minRaise = state.bb;
	state.logs = [];
	for (const p of state.players) {
		p.hole = [];
		p.folded = p.stack <= 0;
		p.allIn = false;
		p.bet = 0;
		p.totalBet = 0;
		p.hasActed = false;
	}
	if (state.players.filter((p) => p.stack > 0).length < 2) {
		state.handOver = true;
		state.street = "idle";
		state.logs.push("بازیکن کافی برای دست جدید نیست.");
		return state;
	}
	state.button = nextOccupied(state, state.button, (p) => p.stack > 0);
	const sbI = nextOccupied(state, state.button, (p) => p.stack > 0);
	const bbI = nextOccupied(state, sbI, (p) => p.stack > 0);
	post(state, sbI, state.sb);
	post(state, bbI, state.bb);
	state.currentBet = Math.max(state.players[sbI].bet, state.players[bbI].bet);
	state.logs.push(`${state.players[sbI].name} اسمال ${state.sb} · ${state.players[bbI].name} بیگ ${state.bb}`);
	for (let r = 0; r < 2; r++) for (let i = 0; i < state.players.length; i++) {
		const idx = (state.button + 1 + i) % state.players.length;
		const p = state.players[idx];
		if (p.folded) continue;
		p.hole.push(...draw(state, 1));
	}
	state.toAct = nextOccupied(state, bbI, canAct);
	state.actAt = Date.now() + (state.players[state.toAct]?.isBot ? 800 : 18e3);
	return state;
}
function streetOver(state) {
	const actors = state.players.filter(canAct);
	if (actors.length === 0) return true;
	if (state.players.filter((p) => !p.folded).length <= 1) return true;
	const target = state.currentBet;
	return actors.every((p) => p.hasActed && p.bet === target);
}
function nextStreet(state) {
	if (state.players.filter((p) => !p.folded).length <= 1) return settle(state);
	for (const p of state.players) {
		p.bet = 0;
		p.hasActed = false;
	}
	state.currentBet = 0;
	state.minRaise = state.bb;
	if (state.street === "preflop") {
		draw(state, 1);
		state.board.push(...draw(state, 3));
		state.street = "flop";
		state.logs.push("فلاپ");
	} else if (state.street === "flop") {
		draw(state, 1);
		state.board.push(...draw(state, 1));
		state.street = "turn";
		state.logs.push("ترن");
	} else if (state.street === "turn") {
		draw(state, 1);
		state.board.push(...draw(state, 1));
		state.street = "river";
		state.logs.push("ریور");
	} else return settle(state);
	if (state.players.filter(canAct).length < 2) return nextStreet(state);
	state.toAct = nextOccupied(state, state.button, canAct);
	state.actAt = Date.now() + (state.players[state.toAct]?.isBot ? 800 : 18e3);
	return state;
}
function settle(state) {
	state.street = "showdown";
	state.handOver = true;
	const alive = state.players.filter((p) => !p.folded);
	if (alive.length === 1) {
		const w = alive[0];
		const rake = rakeOf(state);
		const award = state.pot - rake;
		w.stack += award;
		state.rakeTaken = rake;
		state.sessionRake = (state.sessionRake ?? 0) + rake;
		state.winners = [{
			ids: [w.id],
			amount: award,
			label: "برنده بدون شوداون"
		}];
		state.logs.push(`${w.name} پات ${award} را برد.`);
		return state;
	}
	const scored = alive.map((p) => ({
		p,
		...eval7([...p.hole, ...state.board])
	}));
	scored.sort((a, b) => b.score - a.score);
	const best = scored[0].score;
	const winners = scored.filter((s) => s.score === best).map((s) => s.p);
	const rake = rakeOf(state);
	const award = state.pot - rake;
	const share = Math.floor(award / winners.length);
	let leftover = award - share * winners.length;
	for (const w of winners) {
		const extra = leftover > 0 ? 1 : 0;
		leftover -= extra;
		w.stack += share + extra;
	}
	state.rakeTaken = rake;
	state.sessionRake = (state.sessionRake ?? 0) + rake;
	const label = HAND_NAMES[scored[0].category] ?? "دست برتر";
	state.winners = [{
		ids: winners.map((w) => w.id),
		amount: award,
		label
	}];
	state.logs.push(`${winners.map((w) => w.name).join(" و ")} با ${label} پات ${award} را برد.`);
	return state;
}
function rakeOf(state) {
	return rakeAmount(state.pot, state.bb);
}
function applyAction(prev, action) {
	const state = JSON.parse(JSON.stringify(prev));
	const i = state.toAct;
	const p = state.players[i];
	if (!canAct(p) || state.handOver) return state;
	const toCall = Math.max(0, state.currentBet - p.bet);
	if (action.type === "fold") {
		p.folded = true;
		p.hasActed = true;
		state.logs.push(`${p.name} فولد`);
	} else if (action.type === "check") {
		if (toCall > 0) return prev;
		p.hasActed = true;
		state.logs.push(`${p.name} چک`);
	} else if (action.type === "call") {
		const put = Math.min(toCall, p.stack);
		p.stack -= put;
		p.bet += put;
		p.totalBet += put;
		state.pot += put;
		p.hasActed = true;
		if (p.stack === 0) p.allIn = true;
		state.logs.push(put === 0 ? `${p.name} چک` : `${p.name} کال ${put}`);
	} else if (action.type === "raise") {
		const target = action.amount;
		const put = Math.min(target - p.bet, p.stack);
		if (put <= 0) return prev;
		const newBet = p.bet + put;
		const raiseSize = newBet - state.currentBet;
		p.stack -= put;
		p.bet = newBet;
		p.totalBet += put;
		state.pot += put;
		if (p.stack === 0) p.allIn = true;
		if (newBet > state.currentBet) {
			if (raiseSize >= state.minRaise) state.minRaise = raiseSize;
			state.currentBet = newBet;
			for (const o of state.players) if (o.id !== p.id && canAct(o)) o.hasActed = false;
		}
		p.hasActed = true;
		state.logs.push(`${p.name} رِیز تا ${newBet}`);
	} else if (action.type === "allin") return applyAction(state, {
		type: "raise",
		amount: p.bet + p.stack
	});
	if (state.players.filter((x) => !x.folded).length <= 1) return settle(state);
	if (streetOver(state)) return nextStreet(state);
	state.toAct = nextOccupied(state, i, canAct);
	state.actAt = Date.now() + (state.players[state.toAct]?.isBot ? 700 + Math.floor(Math.random() * 600) : 18e3);
	return state;
}
function legalFor(state) {
	const p = state.players[state.toAct];
	if (!p || !canAct(p) || state.handOver) return {
		fold: false,
		check: false,
		call: false,
		callAmt: 0,
		raise: false,
		minRaiseTo: 0,
		maxRaiseTo: 0
	};
	const toCall = Math.max(0, state.currentBet - p.bet);
	const minRaiseTo = state.currentBet + state.minRaise;
	const maxRaiseTo = p.bet + p.stack;
	return {
		fold: toCall > 0,
		check: toCall === 0,
		call: toCall > 0 && p.stack > 0,
		callAmt: Math.min(toCall, p.stack),
		raise: maxRaiseTo > state.currentBet,
		minRaiseTo: Math.min(minRaiseTo, maxRaiseTo),
		maxRaiseTo
	};
}
function chenScore(hole) {
	if (hole.length < 2) return 0;
	const r1 = cardRank(hole[0]);
	const r2 = cardRank(hole[1]);
	const hi = Math.max(r1, r2);
	const lo = Math.min(r1, r2);
	let s = [
		1,
		1.5,
		2,
		2.5,
		3,
		3.5,
		4,
		5,
		6,
		7,
		8,
		9,
		10
	][hi];
	if (hi === lo) s = Math.max(5, s * 2);
	if (cardSuit(hole[0]) === cardSuit(hole[1])) s += 2;
	const gap = hi - lo - 1;
	if (gap === 1) s -= 1;
	else if (gap === 2) s -= 2;
	else if (gap === 3) s -= 4;
	else if (gap >= 4) s -= 5;
	if (gap <= 1 && hi < 10 && hi !== lo) s += 1;
	return s;
}
function postflopStrength(hole, board) {
	const { category } = eval7([...hole, ...board]);
	return category / 9;
}
function chooseBotAction(state) {
	const p = state.players[state.toAct];
	const legal = legalFor(state);
	const toCall = legal.callAmt;
	const style = p.style;
	const pre = state.street === "preflop";
	const chen = chenScore(p.hole);
	const str = pre ? Math.min(1, chen / 12) : postflopStrength(p.hole, state.board);
	const potOdds = toCall / Math.max(1, state.pot + toCall);
	const aggro = style === "aggro" || style === "maniac" ? .18 : style === "loose" ? .1 : .05;
	const tight = style === "tight" ? .12 : 0;
	const bluff = Math.random() < aggro * (style === "maniac" ? 2 : 1);
	const callNeed = potOdds + tight - (style === "station" ? .12 : 0);
	if (legal.check && str < .35 && !bluff) return { type: "check" };
	if (str > .72 || bluff && str > .2) {
		if (legal.raise) {
			const potRaise = Math.min(legal.maxRaiseTo, Math.max(legal.minRaiseTo, p.bet + Math.floor(state.pot * (.6 + Math.random() * .5))));
			if (str > .88 && Math.random() < .35) return { type: "allin" };
			return {
				type: "raise",
				amount: potRaise
			};
		}
		if (legal.call) return { type: "call" };
	}
	if (legal.call && str >= callNeed) return { type: "call" };
	if (legal.check) return { type: "check" };
	if (legal.fold) return { type: "fold" };
	if (legal.call) return { type: "call" };
	return { type: "check" };
}
function publicView(state, viewerId) {
	const clone = JSON.parse(JSON.stringify(state));
	clone.deck = [];
	for (const p of clone.players) {
		p.isHero = p.userId === viewerId;
		const reveal = clone.handOver && !p.folded && p.hole.length === 2;
		if (!p.isHero && !reveal) p.hole = [];
	}
	return clone;
}
function humanCount(state) {
	return state.players.filter((p) => !p.isBot).length + (state.queued?.length ?? 0);
}
function timeoutAction(state) {
	const legal = legalFor(state);
	if (legal.check) return { type: "check" };
	if (legal.fold) return { type: "fold" };
	if (legal.call) return { type: "call" };
	return { type: "check" };
}
function advanceBots(prev, now = Date.now()) {
	let state = prev;
	let guard = 0;
	while (!state.handOver && guard++ < 20) {
		const actor = state.players[state.toAct];
		if (!actor) break;
		if (!actor.isBot) {
			if (now < (state.actAt || 0)) break;
			state = applyAction(state, timeoutAction(state));
			continue;
		}
		if (now < (state.actAt || 0)) break;
		state = applyAction(state, chooseBotAction(state));
	}
	return state;
}
function unseat(prev, userId) {
	const state = JSON.parse(JSON.stringify(prev));
	state.queued = (state.queued ?? []).filter((q) => q.userId !== userId);
	const idx = state.players.findIndex((p) => p.userId === userId);
	if (idx < 0) return {
		state,
		stack: 0,
		buyin: 0
	};
	const p = state.players[idx];
	if (!state.handOver && !p.folded && state.players[state.toAct]?.userId === userId) {
		const next = applyAction(state, timeoutAction(state));
		const stack = next.players.find((x) => x.userId === userId)?.stack ?? p.stack;
		const buyin = p.buyin;
		const i2 = next.players.findIndex((x) => x.userId === userId);
		if (i2 >= 0) {
			const fillStack = Math.max(next.bb * 40, buyin);
			next.players[i2] = {
				id: `bot_x_${i2}`,
				name: BOT_ROSTER[i2 % BOT_ROSTER.length].name,
				isHero: false,
				isBot: true,
				buyin: fillStack,
				stack: fillStack,
				hole: [],
				folded: true,
				allIn: false,
				bet: 0,
				totalBet: 0,
				hasActed: true,
				style: BOT_ROSTER[i2 % BOT_ROSTER.length].style
			};
		}
		next.logs.push(`${p.name} میز را ترک کرد.`);
		return {
			state: next,
			stack,
			buyin
		};
	}
	const stack = p.stack;
	const buyin = p.buyin;
	const fillStack = Math.max(state.bb * 40, buyin);
	state.players[idx] = {
		id: `bot_x_${idx}`,
		name: BOT_ROSTER[idx % BOT_ROSTER.length].name,
		isHero: false,
		isBot: true,
		buyin: fillStack,
		stack: fillStack,
		hole: [],
		folded: true,
		allIn: false,
		bet: 0,
		totalBet: 0,
		hasActed: true,
		style: BOT_ROSTER[idx % BOT_ROSTER.length].style
	};
	state.logs.push(`${p.name} میز را ترک کرد.`);
	return {
		state,
		stack,
		buyin
	};
}
function newId$1(prefix) {
	return prefix + "_" + randomBytes(8).toString("hex");
}
function parseState(raw) {
	const state = typeof raw === "string" ? JSON.parse(raw) : raw;
	state.queued ??= [];
	state.actAt ??= 0;
	for (const p of state.players) p.buyin ??= p.stack;
	return state;
}
function buyinFor(stake, chips) {
	return Math.min(chips, stake.max, Math.max(stake.min, stake.bb * 80));
}
async function loadRoom(sql, id) {
	return (await sql.query(`select id, stake_id, state, version from club_rooms where id = $1`, [id]))[0] ?? null;
}
async function saveRoom(sql, room, state) {
	const next = room.version + 1;
	if (!(await sql.query(`update club_rooms set state = $1::jsonb, version = $2, updated_at = now()
     where id = $3 and version = $4 returning id`, [
		JSON.stringify(state),
		next,
		room.id,
		room.version
	]))[0]) throw new Error("میز هم‌زمان تغییر کرد. دوباره تلاش کنید.");
	room.version = next;
}
async function tickRoom(sql, room) {
	const before = parseState(room.state);
	const state = advanceBots(before);
	if (state === before) return state;
	if (!(state.street !== before.street || state.toAct !== before.toAct || state.handOver !== before.handOver || state.pot !== before.pot || state.actAt !== before.actAt || JSON.stringify(state.players) !== JSON.stringify(before.players))) return state;
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
async function lobbyTables() {
	const rooms = await (await getSql()).query(`select stake_id, state from club_rooms`);
	const byStake = {};
	for (const t of TABLES) byStake[t.id] = {
		humans: 0,
		open: t.seats
	};
	for (const r of rooms) {
		const humans = humanCount(parseState(r.state));
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
		openSeats: byStake[t.id]?.open ?? t.seats
	}));
}
async function sitAtTable(user, stakeId) {
	const stake = TABLES.find((t) => t.id === stakeId);
	if (!stake) throw new Error("میز نامعتبر است.");
	if (user.room_id) throw new Error("اول از میز فعلی بلند شوید.");
	if (user.chips < stake.min) throw new Error("ژتون کافی برای این میز ندارید.");
	const buyin = buyinFor(stake, user.chips);
	const sql = await getSql();
	const rooms = await sql.query(`select id, stake_id, state, version from club_rooms where stake_id = $1 order by updated_at desc`, [stakeId]);
	let chosen = null;
	let state = null;
	for (const room of rooms) {
		const s = parseState(room.state);
		if (humanCount(s) >= 6) continue;
		chosen = room;
		state = s;
		break;
	}
	if (!chosen || !state) {
		const id = newId$1("rm");
		state = startHand(createTable({
			id,
			name: stake.name,
			sb: stake.sb,
			bb: stake.bb,
			humans: [{
				id: user.id,
				name: user.username,
				stack: buyin
			}]
		}));
		await sql.query(`insert into club_rooms (id, stake_id, state, version) values ($1, $2, $3::jsonb, 0)`, [
			id,
			stakeId,
			JSON.stringify(state)
		]);
		chosen = {
			id,
			stake_id: stakeId,
			state,
			version: 0
		};
	} else if (state.handOver || state.street === "idle") {
		state.queued = [...state.queued ?? [], {
			userId: user.id,
			name: user.username,
			stack: buyin
		}];
		state = startHand(state);
		await saveRoom(sql, chosen, state);
	} else {
		state.queued = [...state.queued ?? [], {
			userId: user.id,
			name: user.username,
			stack: buyin
		}];
		state.logs.push(`${user.username} در صف نشستن است.`);
		await saveRoom(sql, chosen, state);
	}
	const chips = user.chips - buyin;
	const cashable = Math.min(user.cashable, chips);
	await sql.query(`update club_users set chips = $1, cashable = $2, room_id = $3, table_buyin = $4 where id = $5`, [
		chips,
		cashable,
		chosen.id,
		buyin,
		user.id
	]);
	return {
		table: publicView(state, user.id),
		user: {
			chips,
			cashable,
			roomId: chosen.id
		},
		humans: humanCount(state)
	};
}
async function pollTable(user) {
	if (!user.room_id) return {
		table: null,
		userPatch: null
	};
	const sql = await getSql();
	const room = await loadRoom(sql, user.room_id);
	if (!room) {
		await sql.query(`update club_users set room_id = null, table_buyin = 0 where id = $1`, [user.id]);
		return {
			table: null,
			userPatch: { roomId: null }
		};
	}
	let state;
	try {
		state = await tickRoom(sql, room);
	} catch {
		state = parseState(room.state);
	}
	const seated = state.players.some((p) => p.userId === user.id);
	const queued = (state.queued ?? []).some((q) => q.userId === user.id);
	if (!seated && !queued) {
		await sql.query(`update club_users set room_id = null, table_buyin = 0 where id = $1`, [user.id]);
		return {
			table: null,
			userPatch: { roomId: null }
		};
	}
	return {
		table: publicView(state, user.id),
		userPatch: null
	};
}
async function actAtTable(user, action) {
	if (!user.room_id) throw new Error("سر میز نیستید.");
	const sql = await getSql();
	const room = await loadRoom(sql, user.room_id);
	if (!room) throw new Error("میز پیدا نشد.");
	let state = advanceBots(parseState(room.state));
	const actor = state.players[state.toAct];
	if (!actor || actor.userId !== user.id || state.handOver) throw new Error("نوبت شما نیست.");
	state = applyAction(state, action);
	await saveRoom(sql, room, state);
	return publicView(state, user.id);
}
async function nextHandAtTable(user) {
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
async function leaveTable(user) {
	if (!user.room_id) throw new Error("سر میز نیستید.");
	const sql = await getSql();
	const room = await loadRoom(sql, user.room_id);
	if (!room) {
		await sql.query(`update club_users set room_id = null, table_buyin = 0 where id = $1`, [user.id]);
		return {
			chips: user.chips,
			cashable: user.cashable,
			roomId: null,
			delta: 0,
			rake: 0
		};
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
	if (humansLeft === 0) await sql.query(`delete from club_rooms where id = $1`, [room.id]);
	else await saveRoom(sql, room, state);
	const delta = stack - buyin;
	const chips = user.chips + stack;
	let cashable = user.cashable;
	if (delta > 0) cashable += winCashable(delta);
	cashable = Math.min(cashable, chips);
	await sql.query(`update club_users set chips = $1, cashable = $2, room_id = null, table_buyin = 0 where id = $3`, [
		chips,
		cashable,
		user.id
	]);
	const kind = delta >= 0 ? "win" : "lose";
	const note = `میز ${state.name}`;
	await sql.query(`insert into club_tx (id, user_id, kind, chips, toman, status, note)
     values ($1, $2, $3, $4, 0, 'done', $5)`, [
		newId$1("tx"),
		user.id,
		kind,
		delta,
		note
	]);
	if (state.sessionRake > 0 && humansLeft === 0) {
		const prev = await sql.query(`select value from club_config where key = 'rake_chips'`);
		const next = String((Number(prev[0]?.value) || 0) + state.sessionRake);
		await sql.query(`insert into club_config (key, value) values ('rake_chips', $1)
       on conflict (key) do update set value = $1`, [next]);
	}
	return {
		chips,
		cashable,
		roomId: null,
		delta,
		rake: state.sessionRake
	};
}
/** Server-only club payee. Never import this from a client module. */
var CLUB_PAY_CARD = "6219861868056010";
var CLUB_PAY_NAME = "مدیر باشگاه آس کلاب";
var CLUB_ADMIN_BOOTSTRAP = "aceclub";
function hashPass(password, salt) {
	return scryptSync(password, salt, 32).toString("hex");
}
function newSalt() {
	return randomBytes(16).toString("hex");
}
function newId(prefix) {
	return prefix + "_" + randomBytes(8).toString("hex");
}
function pub(u) {
	return {
		id: u.id,
		username: u.username,
		phone: u.phone,
		chips: u.chips,
		cashable: u.cashable,
		depositedToman: u.deposited_toman ?? 0,
		cashedToman: u.cashed_toman ?? 0,
		roomId: u.room_id
	};
}
function mapTx(t, username) {
	const created = typeof t.created_at === "string" ? Date.parse(t.created_at) : t.created_at.getTime();
	return {
		id: t.id,
		userId: t.user_id,
		kind: t.kind,
		chips: t.chips,
		toman: t.toman,
		status: t.status,
		note: t.note,
		createdAt: Number.isFinite(created) ? created : Date.now(),
		packId: t.pack_id ?? void 0,
		username
	};
}
async function cfg(sql, key, fallback) {
	return (await sql`select value from club_config where key = ${key}`)[0]?.value ?? fallback;
}
async function seedPayee(sql) {
	if (!(await sql`select value from club_config where key = ${"card_number"}`)[0]) {
		await sql`insert into club_config (key, value) values (${"card_number"}, ${CLUB_PAY_CARD}) on conflict (key) do nothing`;
		await sql`insert into club_config (key, value) values (${"card_name"}, ${CLUB_PAY_NAME}) on conflict (key) do nothing`;
	}
}
async function userByToken(sql, token) {
	const u = (await sql`
    select u.id, u.username, u.phone, u.pass_salt, u.pass_hash, u.chips, u.cashable,
           coalesce(u.deposited_toman, 0) as deposited_toman,
           coalesce(u.cashed_toman, 0) as cashed_toman,
           u.room_id, coalesce(u.table_buyin, 0) as table_buyin
    from club_sessions s
    join club_users u on u.id = s.user_id
    where s.token = ${token}
  `)[0];
	if (!u) throw new Error("نشست منقضی شده.");
	return u;
}
async function requireAdmin(sql, token) {
	if (!token) throw new Error("ورود مدیریت لازم است.");
	if ((await sql`
    select user_id from club_sessions where token = ${token}
  `)[0]?.user_id !== "__admin__") throw new Error("ورود مدیریت لازم است.");
}
async function statsOf(sql) {
	const users = await sql`select count(*)::int as n from club_users`;
	const dep = await sql`
    select count(*)::int as n from club_tx where kind = ${"deposit"} and status = ${"pending"}
  `;
	const cash = await sql`
    select count(*)::int as n from club_tx where kind = ${"cashout"} and status = ${"pending"}
  `;
	const sums = await sql`
    select coalesce(sum(deposited_toman),0)::int as d, coalesce(sum(cashed_toman),0)::int as c
    from club_users
  `;
	const fees = await sql`
    select coalesce(sum(toman),0)::int as n from club_tx
    where kind = ${"cashout"} and status in (${"pending"}, ${"approved"}, ${"done"})
  `;
	const expenses = await sql`select coalesce(sum(toman),0)::int as n from club_expenses`;
	const rake = Number(await cfg(sql, "rake_chips", "0")) || 0;
	const deposited = sums[0]?.d ?? 0;
	const cashed = sums[0]?.c ?? 0;
	const exp = expenses[0]?.n ?? 0;
	const feeEstimate = Math.round(cashed * (1 / 9));
	return {
		users: users[0]?.n ?? 0,
		pendingDeposits: dep[0]?.n ?? 0,
		pendingCashouts: cash[0]?.n ?? 0,
		depositedToman: deposited,
		cashedToman: cashed,
		cashoutFees: feeEstimate || (fees[0]?.n ?? 0),
		rakeChips: rake,
		expensesToman: exp,
		vaultToman: deposited - cashed - exp
	};
}
async function handleClub(op, body, token) {
	const sql = await getSql();
	await seedPayee(sql);
	if (op === "health" || op === "config") {
		const window = cashoutWindow();
		return {
			ok: true,
			cardName: await cfg(sql, "card_name", CLUB_PAY_NAME),
			cashout: window
		};
	}
	if (op === "register") {
		const username = String(body.username ?? "").trim();
		const phone = String(body.phone ?? "").trim();
		const password = String(body.password ?? "");
		if (!/^[\u0600-\u06FFa-zA-Z0-9_]{3,20}$/.test(username)) throw new Error("نام کاربری ۳ تا ۲۰ حرف باشد.");
		if (!/^09\d{9}$/.test(phone)) throw new Error("شماره موبایل را با ۰۹ وارد کنید.");
		if (password.length < 4) throw new Error("رمز حداقل ۴ کاراکتر.");
		if ((await sql`select id from club_users where username = ${username}`)[0]) throw new Error("این نام کاربری قبلاً ثبت شده.");
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
		const user = (await sql`
      select id, username, phone, pass_salt, pass_hash, chips, cashable,
             coalesce(deposited_toman,0) as deposited_toman,
             coalesce(cashed_toman,0) as cashed_toman,
             room_id, coalesce(table_buyin,0) as table_buyin
      from club_users where id = ${id}
    `)[0];
		return {
			token: tok,
			user: pub(user)
		};
	}
	if (op === "login") {
		const username = String(body.username ?? "").trim();
		const password = String(body.password ?? "");
		const u = (await sql`
      select id, username, phone, pass_salt, pass_hash, chips, cashable,
             coalesce(deposited_toman,0) as deposited_toman,
             coalesce(cashed_toman,0) as cashed_toman,
             room_id, coalesce(table_buyin,0) as table_buyin
      from club_users where username = ${username}
    `)[0];
		if (!u) throw new Error("نام کاربری یا رمز نادرست است.");
		const good = hashPass(password, u.pass_salt);
		const a = Buffer.from(good, "hex");
		const b = Buffer.from(u.pass_hash, "hex");
		if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("نام کاربری یا رمز نادرست است.");
		const tok = newId("tok");
		await sql`insert into club_sessions (token, user_id) values (${tok}, ${u.id})`;
		return {
			token: tok,
			user: pub(u)
		};
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
			cardNumber: await cfg(sql, "card_number", CLUB_PAY_CARD)
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
		const row = (await sql`select * from club_tx where id = ${id}`)[0];
		return {
			tx: mapTx(row),
			user: {
				...pub(u),
				chips,
				cashable,
				depositedToman: deposited
			}
		};
	}
	if (op === "cashout") {
		if (!token) throw new Error("وارد نشده‌اید.");
		const u = await userByToken(sql, token);
		const window = cashoutWindow();
		if (!window.open) throw new Error(window.label);
		const chips = Math.trunc(Number(body.chips) || 0);
		const card = String(body.card ?? "").trim();
		if (chips < 1e4) throw new Error("حداقل برداشت ۱۰٬۰۰۰ ژتون است.");
		if (chips > u.cashable) throw new Error("ژتون قابل‌برداشت کافی نیست.");
		if (card.replace(/\D/g, "").length < 16) throw new Error("شماره کارت مقصد را کامل وارد کنید.");
		const start = /* @__PURE__ */ new Date();
		start.setHours(0, 0, 0, 0);
		if (((await sql`
      select coalesce(sum(abs(chips)),0)::int as n from club_tx
      where user_id = ${u.id} and kind = ${"cashout"} and status <> ${"rejected"}
        and created_at >= ${start.toISOString()}
    `)[0]?.n ?? 0) + chips > 8e4) throw new Error("سقف برداشت روزانه پر شده است.");
		const money = cashoutToman(chips);
		const cap = (u.deposited_toman || 0) * 2;
		if ((u.cashed_toman || 0) + money.net > cap) throw new Error("سقف برداشت نسبت به واریزی‌ها پر شده. اول ژتون بخرید.");
		await sql`update club_users set chips = ${u.chips - chips}, cashable = ${u.cashable - chips} where id = ${u.id}`;
		const id = newId("tx");
		const note = `کارت مقصد: ${card} · مالیات باشگاه ۱۰٪ (${money.fee} تومان)`;
		await sql`
      insert into club_tx (id, user_id, kind, chips, toman, status, note)
      values (${id}, ${u.id}, ${"cashout"}, ${-chips}, ${money.net}, ${"pending"}, ${note})
    `;
		const row = (await sql`select * from club_tx where id = ${id}`)[0];
		return {
			tx: mapTx(row),
			user: {
				...pub(u),
				chips: u.chips - chips,
				cashable: u.cashable - chips
			},
			money,
			window
		};
	}
	if (op === "daily") {
		if (!token) throw new Error("وارد نشده‌اید.");
		const u = await userByToken(sql, token);
		const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		if ((await sql`select value as v from club_config where key = ${"daily_" + u.id}`)[0]?.v === today) throw new Error("جایزه امروز را گرفته‌اید.");
		await sql`update club_users set chips = ${u.chips + 500} where id = ${u.id}`;
		await sql`
      insert into club_config (key, value) values (${"daily_" + u.id}, ${today})
      on conflict (key) do update set value = ${today}
    `;
		await sql`
      insert into club_tx (id, user_id, kind, chips, toman, status, note)
      values (${newId("tx")}, ${u.id}, ${"bonus"}, ${500}, ${0}, ${"done"}, ${"جایزه روزانه — غیرقابل برداشت"})
    `;
		return {
			...pub(u),
			chips: u.chips + 500
		};
	}
	if (op === "history") {
		if (!token) throw new Error("وارد نشده‌اید.");
		return (await sql`
      select * from club_tx where user_id = ${(await userByToken(sql, token)).id} order by created_at desc limit 80
    `).map((r) => mapTx(r));
	}
	if (op === "lobby") return {
		tables: await lobbyTables(),
		cashout: cashoutWindow()
	};
	if (op === "sit") {
		if (!token) throw new Error("وارد نشده‌اید.");
		return sitAtTable(await userByToken(sql, token), String(body.stakeId ?? ""));
	}
	if (op === "tablePoll") {
		if (!token) throw new Error("وارد نشده‌اید.");
		return pollTable(await userByToken(sql, token));
	}
	if (op === "tableAct") {
		if (!token) throw new Error("وارد نشده‌اید.");
		const u = await userByToken(sql, token);
		const raw = body.action;
		if (!raw || ![
			"fold",
			"check",
			"call",
			"raise",
			"allin"
		].includes(String(raw.type))) throw new Error("حرکت نامعتبر.");
		return { table: await actAtTable(u, raw.type === "raise" ? {
			type: "raise",
			amount: Math.trunc(Number(raw.amount) || 0)
		} : { type: raw.type }) };
	}
	if (op === "tableNext") {
		if (!token) throw new Error("وارد نشده‌اید.");
		return { table: await nextHandAtTable(await userByToken(sql, token)) };
	}
	if (op === "tableLeave") {
		if (!token) throw new Error("وارد نشده‌اید.");
		const u = await userByToken(sql, token);
		const left = await leaveTable(u);
		return { user: {
			...pub(u),
			...left
		} };
	}
	if (op === "adminLogin") {
		const password = String(body.password ?? "");
		const stored = await cfg(sql, "admin_hash", "");
		if (!stored) {
			const salt = newSalt();
			const hash = hashPass(CLUB_ADMIN_BOOTSTRAP, salt);
			await sql`insert into club_config (key, value) values (${"admin_salt"}, ${salt}) on conflict (key) do update set value = ${salt}`;
			await sql`insert into club_config (key, value) values (${"admin_hash"}, ${hash}) on conflict (key) do update set value = ${hash}`;
			if (password !== "aceclub") throw new Error("رمز مدیریت نادرست است.");
		} else {
			const good = hashPass(password, await cfg(sql, "admin_salt", ""));
			const a = Buffer.from(good, "hex");
			const b = Buffer.from(stored, "hex");
			if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("رمز مدیریت نادرست است.");
		}
		const tok = newId("adm");
		await sql`insert into club_sessions (token, user_id) values (${tok}, ${"__admin__"})`;
		return {
			ok: true,
			token: tok
		};
	}
	if (op === "adminQueue") {
		await requireAdmin(sql, token);
		const pending = await sql`select * from club_tx where status = ${"pending"} order by created_at asc`;
		const cashouts = await sql`
      select * from club_tx where kind = ${"cashout"} order by created_at desc limit 40
    `;
		const deposits = await sql`
      select * from club_tx where kind = ${"deposit"} order by created_at desc limit 40
    `;
		const users = await sql`
      select id, username, phone, pass_salt, pass_hash, chips, cashable,
             coalesce(deposited_toman,0) as deposited_toman,
             coalesce(cashed_toman,0) as cashed_toman,
             room_id, coalesce(table_buyin,0) as table_buyin
      from club_users order by username
    `;
		const nameById = Object.fromEntries(users.map((u) => [u.id, u.username]));
		const expenses = await sql`select * from club_expenses order by created_at desc limit 80`;
		return {
			pending: pending.map((t) => mapTx(t, nameById[t.user_id])),
			users: users.map(pub),
			config: {
				cardNumber: await cfg(sql, "card_number", CLUB_PAY_CARD),
				cardName: await cfg(sql, "card_name", CLUB_PAY_NAME)
			},
			stats: await statsOf(sql),
			expenses: expenses.map((e) => ({
				id: e.id,
				category: e.category,
				title: e.title,
				toman: e.toman,
				note: e.note,
				createdAt: typeof e.created_at === "string" ? Date.parse(e.created_at) : e.created_at.getTime()
			})),
			cashouts: cashouts.map((t) => mapTx(t, nameById[t.user_id])),
			deposits: deposits.map((t) => mapTx(t, nameById[t.user_id])),
			categories: EXPENSE_CATEGORIES,
			cashout: cashoutWindow()
		};
	}
	if (op === "adminDecide") {
		await requireAdmin(sql, token);
		const txId = String(body.txId ?? "");
		const approve = Boolean(body.approve);
		const tx = (await sql`select * from club_tx where id = ${txId}`)[0];
		if (!tx) throw new Error("تراکنش پیدا نشد.");
		const u = (await sql`
      select id, username, phone, pass_salt, pass_hash, chips, cashable,
             coalesce(deposited_toman,0) as deposited_toman,
             coalesce(cashed_toman,0) as cashed_toman,
             room_id, coalesce(table_buyin,0) as table_buyin
      from club_users where id = ${tx.user_id}
    `)[0];
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
			} else await sql`update club_tx set status = ${"approved"} where id = ${txId}`;
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
		const next = (await sql`select * from club_tx where id = ${txId}`)[0];
		return mapTx(next);
	}
	if (op === "saveConfig") {
		await requireAdmin(sql, token);
		const cardNumber = String(body.cardNumber ?? "").replace(/\D/g, "");
		const cardName = String(body.cardName ?? "").trim();
		const adminPass = String(body.adminPass ?? "");
		if (cardNumber.length >= 16) await sql`insert into club_config (key, value) values (${"card_number"}, ${cardNumber}) on conflict (key) do update set value = ${cardNumber}`;
		if (cardName) await sql`insert into club_config (key, value) values (${"card_name"}, ${cardName}) on conflict (key) do update set value = ${cardName}`;
		if (adminPass.length >= 4) {
			const salt = newSalt();
			const hash = hashPass(adminPass, salt);
			await sql`insert into club_config (key, value) values (${"admin_salt"}, ${salt}) on conflict (key) do update set value = ${salt}`;
			await sql`insert into club_config (key, value) values (${"admin_hash"}, ${hash}) on conflict (key) do update set value = ${hash}`;
		}
		return {
			cardNumber: await cfg(sql, "card_number", CLUB_PAY_CARD),
			cardName: await cfg(sql, "card_name", CLUB_PAY_NAME)
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
		const row = (await sql`select * from club_expenses where id = ${id}`)[0];
		return {
			id: row.id,
			category: row.category,
			title: row.title,
			toman: row.toman,
			note: row.note,
			createdAt: typeof row.created_at === "string" ? Date.parse(row.created_at) : row.created_at.getTime()
		};
	}
	if (op === "removeExpense") {
		await requireAdmin(sql, token);
		await sql`delete from club_expenses where id = ${String(body.id ?? "")}`;
		return { ok: true };
	}
	throw new Error("عملیات ناشناخته.");
}
function json(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store"
		}
	});
}
var Route = createFileRoute("/api/club")({ server: { handlers: {
	GET: async () => json({
		ok: true,
		name: "Ace Club",
		fa: "آس کلاب"
	}),
	POST: async ({ request }) => {
		try {
			const body = await request.json();
			const op = String(body.op ?? "health");
			const header = request.headers.get("authorization") ?? "";
			return json(await handleClub(op, body, header.startsWith("Bearer ") ? header.slice(7) : null));
		} catch (err) {
			return json({ error: err instanceof Error ? err.message : "خطای سرور" }, 400);
		}
	}
} } });
var rootRouteChildren = {
	IndexRoute: Route$2.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	ModirRoute: Route$1.update({
		id: "/modir",
		path: "/modir",
		getParentRoute: () => Route$3
	}),
	ApiClubRoute: Route.update({
		id: "/api/club",
		path: "/api/club",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { cardSuit as a, legalFor as c, PACKAGES as d, cashoutToman as f, cardRank as i, EXPENSE_CATEGORIES as l, RANK_LABEL as n, handLabel as o, SUIT_LABEL as r, isRed as s, router_exports as t, MIN_CASHOUT_CHIPS as u };
