import { o as __toESM } from "../_runtime.mjs";
import { L as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as cn, c as getToken, i as clubApi, l as setToken, n as Input, o as faNum, s as formatCard, t as Button } from "./club-client-BoKEZhto.mjs";
import { c as Spade, d as CreditCard, f as Copy, i as Trophy, l as LogOut, n as VolumeX, p as ArrowRight, r as Volume2, s as Store, t as Wallet, u as Landmark } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as cardSuit, c as legalFor, d as PACKAGES, f as cashoutToman, i as cardRank, n as RANK_LABEL, o as handLabel, r as SUIT_LABEL, s as isRed, u as MIN_CASHOUT_CHIPS } from "./router-D0MwSgvH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-4VSfim_N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SUIT_PATH = {
	s: "M12 2C12 2 4 9.2 4 14.2 4 17.8 6.7 20 9.5 20c1.6 0 2.5-.8 2.5-2 0 1.2.9 2 2.5 2 2.8 0 5.5-2.2 5.5-5.8C20 9.2 12 2 12 2z",
	h: "M12 21S3 14.4 3 8.8C3 5.6 5.5 3.5 8.2 3.5c1.8 0 3.3 1 3.8 2.4.5-1.4 2-2.4 3.8-2.4C18.5 3.5 21 5.6 21 8.8 21 14.4 12 21 12 21z",
	d: "M12 2L21 12 12 22 3 12z",
	c: "M12 12c0-3.2 2.2-5.5 5-5.5S22 8.8 22 12s-2.2 5.5-5 5.5c-1.2 0-2.2-.4-3-.1.4 1.4 1.6 3.6 4 4.1v1H6v-1c2.4-.5 3.6-2.7 4-4.1-.8-.3-1.8.1-3 .1-2.8 0-5-2.3-5-5.5S6.2 6.5 9 6.5 12 8.8 12 12z"
};
function PlayingCard({ card, hidden, size = "md" }) {
	const dim = size === "lg" ? "w-16 h-[5.6rem]" : size === "sm" ? "w-9 h-[3.2rem]" : "w-12 h-[4.2rem]";
	if (hidden || card === void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn(dim, "rounded-sm border border-border bg-felt-deep shadow-sm relative overflow-hidden shrink-0"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-[3px] rounded-[3px] border border-chip/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 opacity-40 bg-[repeating-linear-gradient(135deg,transparent,transparent_4px,var(--color-chip)_4px,var(--color-chip)_5px)]" })]
	});
	const rank = RANK_LABEL[cardRank(card)];
	const suit = SUIT_LABEL[cardSuit(card)];
	const red = isRed(card);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn(dim, "rounded-sm bg-card shadow-sm shrink-0 relative flex flex-col justify-between p-1", red ? "text-card-red" : "text-card-ink"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col leading-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] font-semibold tabular-nums",
				children: rank
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 24 24",
				className: "size-2.5 fill-current",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: SUIT_PATH[suit] })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 24 24",
			className: "size-4 fill-current self-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: SUIT_PATH[suit] })
		})]
	});
}
var ctx = null;
var master = null;
var sfxBus = null;
var unlocked = false;
var muted = false;
function ensure() {
	if (typeof window === "undefined") return null;
	if (!ctx) {
		const AC = window.AudioContext || window.webkitAudioContext;
		try {
			ctx = new AC({ latencyHint: "interactive" });
		} catch {
			ctx = new AC();
		}
		master = ctx.createGain();
		sfxBus = ctx.createGain();
		sfxBus.connect(master);
		master.connect(ctx.destination);
		master.gain.value = muted ? 0 : .9;
		sfxBus.gain.value = .7;
	}
	return ctx;
}
function unlockAudio() {
	const audio = ensure();
	if (!audio) return;
	if (audio.state === "suspended") audio.resume();
	unlocked = true;
}
function isMuted() {
	return muted;
}
function setMuted(next) {
	muted = next;
	if (typeof window !== "undefined") localStorage.setItem("aceclub.mute", next ? "1" : "0");
	if (master && ctx) master.gain.setTargetAtTime(next ? 0 : .9, ctx.currentTime, .02);
}
function loadMute() {
	if (typeof window === "undefined") return false;
	muted = localStorage.getItem("aceclub.mute") === "1";
	return muted;
}
function tone(type, freq, dur, gain = .05, slide) {
	const audio = ensure();
	if (!audio || !sfxBus || muted) return;
	if (audio.state === "suspended") return;
	const t = audio.currentTime;
	const o = audio.createOscillator();
	const g = audio.createGain();
	o.type = type;
	o.frequency.setValueAtTime(freq, t);
	if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t + dur);
	g.gain.setValueAtTime(gain, t);
	g.gain.exponentialRampToValueAtTime(.001, t + dur);
	o.connect(g);
	g.connect(sfxBus);
	o.start(t);
	o.stop(t + dur + .02);
	o.onended = () => {
		o.disconnect();
		g.disconnect();
	};
}
function playSfx(kind) {
	if (!unlocked && kind !== "click") unlockAudio();
	const jitter = 1 + (Math.random() * .08 - .04);
	if (kind === "card" || kind === "deal") tone("triangle", 420 * jitter, .09, .045, 170);
	else if (kind === "chip") {
		tone("square", 880 * jitter, .07, .035, 420);
		tone("triangle", 1320 * jitter, .04, .02);
	} else if (kind === "fold") tone("sine", 210 * jitter, .14, .04, 110);
	else if (kind === "win") {
		tone("sine", 523, .12, .05);
		tone("sine", 659, .16, .045);
		tone("sine", 784, .28, .05);
	} else if (kind === "sit") tone("triangle", 330, .12, .04, 520);
	else tone("sine", 640 * jitter, .05, .03);
}
if (typeof window !== "undefined") {
	const boot = () => unlockAudio();
	window.addEventListener("pointerdown", boot, { once: true });
	window.addEventListener("keydown", boot, { once: true });
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "visible") unlockAudio();
	});
}
var STREET_FA = {
	preflop: "پیش‌فلاپ",
	flop: "فلاپ",
	turn: "ترن",
	river: "ریور",
	showdown: "شوداون",
	idle: ""
};
var SEAT_POS = [
	{
		left: "16%",
		top: "14%"
	},
	{
		left: "50%",
		top: "4%"
	},
	{
		left: "84%",
		top: "14%"
	},
	{
		left: "10%",
		top: "52%"
	},
	{
		left: "90%",
		top: "52%"
	}
];
function TableView({ table, waiting, onAct, onLeave, onNext }) {
	const [raiseTo, setRaiseTo] = (0, import_react.useState)(0);
	const prevStreet = (0, import_react.useRef)(table.street);
	const prevOver = (0, import_react.useRef)(table.handOver);
	const hero = table.players.find((p) => p.isHero);
	const others = table.players.filter((p) => !p.isHero);
	const legal = legalFor(table);
	const heroTurn = Boolean(hero && table.players[table.toAct]?.isHero && !table.handOver);
	const queued = !hero;
	(0, import_react.useEffect)(() => {
		if (!heroTurn) return;
		setRaiseTo(legal.minRaiseTo || legal.maxRaiseTo);
	}, [
		heroTurn,
		legal.minRaiseTo,
		legal.maxRaiseTo
	]);
	(0, import_react.useEffect)(() => {
		if (table.street !== prevStreet.current) {
			playSfx("card");
			prevStreet.current = table.street;
		}
		if (table.handOver && !prevOver.current) {
			const won = table.winners?.some((w) => hero && w.ids.includes(hero.id));
			playSfx(won ? "win" : "fold");
			prevOver.current = true;
		}
		if (!table.handOver) prevOver.current = false;
	}, [
		table.street,
		table.handOver,
		table.winners,
		hero
	]);
	const act = (action) => {
		if (!heroTurn) return;
		if (action.type === "fold") playSfx("fold");
		else playSfx("chip");
		onAct(action);
	};
	const lastLogs = (0, import_react.useMemo)(() => table.logs.slice(-3), [table.logs]);
	const heroHand = hero && hero.hole.length ? handLabel([...hero.hole, ...table.board]) : "";
	const humans = table.players.filter((p) => !p.isBot).length + (table.queued?.length ?? 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 text-sm text-muted",
						onClick: onLeave,
						children: "ترک میز"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: table.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm tabular-nums",
							children: [
								faNum(table.sb),
								" / ",
								faNum(table.bb)
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm tabular-nums text-chip",
						children: faNum(hero?.stack ?? 0)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-3 h-[min(52dvh,22rem)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-[8%] rounded-[50%] border border-chip/25 bg-felt-deep" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-[11%] rounded-[50%] border border-chip/15 bg-felt shadow-[inset_0_0_40px_rgba(0,0,0,0.35)]" }),
					others.map((p, i) => {
						const pos = SEAT_POS[i] ?? SEAT_POS[0];
						const acting = table.toAct === table.players.indexOf(p) && !table.handOver;
						const show = table.handOver && !p.folded && p.hole.length === 2;
						const dealer = table.button === table.players.indexOf(p);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeatChip, {
							player: p,
							acting,
							show,
							dealer,
							style: {
								left: pos.left,
								top: pos.top
							}
						}, p.id);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute left-1/2 top-[46%] z-10 flex w-[78%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] tracking-wide text-accent/80",
								children: [
									STREET_FA[table.street],
									" · پات ",
									faNum(table.pot),
									" · ",
									faNum(humans),
									" بازیکن زنده"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex min-h-14 items-center justify-center gap-1",
								children: table.board.length ? table.board.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
									card: c,
									size: "md"
								}, c)) : [
									0,
									1,
									2
								].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
									hidden: true,
									size: "md"
								}, i))
							}),
							table.winners && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md bg-bg/70 px-3 py-1.5 text-center text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: table.winners[0]?.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "tabular-nums text-chip",
									children: faNum(table.winners[0]?.amount ?? 0)
								})]
							}),
							queued && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rounded-md bg-bg/70 px-3 py-1.5 text-xs text-muted",
								children: "نشستن در دست بعد…"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 min-h-12 text-[11px] leading-5 text-muted",
					children: lastLogs.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: l }, `${l}-${i}`))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-1 text-xs text-muted",
							children: [hero?.name ?? "در صف", hero && table.button === table.players.indexOf(hero) ? " · دیلر" : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
								card: hero?.hole[0],
								hidden: !hero || hero.hole.length < 1,
								size: "lg"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
								card: hero?.hole[1],
								hidden: !hero || hero.hole.length < 2,
								size: "lg"
							})]
						}),
						heroHand && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-chip",
							children: heroHand
						})
					] }), hero && hero.bet > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm tabular-nums text-chip",
						children: ["شرط ", faNum(hero.bet)]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3",
				children: table.handOver ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "flex-1",
						variant: "secondary",
						onClick: onLeave,
						children: "ترک میز"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "flex-1",
						disabled: !hero || hero.stack < table.bb,
						onClick: onNext,
						children: "دست بعد"
					})]
				}) : heroTurn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [legal.raise && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: legal.minRaiseTo,
							max: legal.maxRaiseTo,
							value: raiseTo,
							onChange: (e) => setRaiseTo(Number(e.target.value)),
							className: "h-11 flex-1 accent-chip"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-16 text-left text-xs tabular-nums",
							children: faNum(raiseTo)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								disabled: !legal.fold,
								onClick: () => act({ type: "fold" }),
								children: "فولد"
							}),
							legal.check ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => act({ type: "check" }),
								children: "چک"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								disabled: !legal.call,
								onClick: () => act({ type: "call" }),
								children: ["کال ", faNum(legal.callAmt)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: !legal.raise,
								onClick: () => act({
									type: "raise",
									amount: raiseTo
								}),
								children: "رِیز"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "felt",
								disabled: !legal.raise,
								onClick: () => act({ type: "allin" }),
								children: "آل‌این"
							})
						]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "flex h-12 items-center justify-center text-sm text-muted",
					children: waiting ? "همگام‌سازی میز…" : queued ? "منتظر دست بعد" : "نوبت حریف…"
				})
			})
		]
	});
}
function SeatChip({ player, acting, show, dealer, style }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute z-10 w-[4.6rem] -translate-x-1/2 -translate-y-1/2",
		style,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("rounded-md border bg-surface px-1.5 py-1.5", player.folded ? "border-border opacity-40" : acting ? "border-accent" : "border-border"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-[11px]",
						children: player.name
					}), dealer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-4 items-center justify-center rounded-full bg-accent text-[9px] text-accent-fg",
						children: "D"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[10px] tabular-nums text-muted",
					children: [faNum(player.stack), !player.isBot ? " · زنده" : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 flex justify-center gap-0.5",
					children: player.folded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-muted",
						children: "فولد"
					}) : show ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
						card: player.hole[0],
						size: "sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
						card: player.hole[1],
						size: "sm"
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
						hidden: true,
						size: "sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
						hidden: true,
						size: "sm"
					})] })
				}),
				player.bet > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-center text-[10px] tabular-nums text-chip",
					children: faNum(player.bet)
				})
			]
		})
	});
}
function AceClub() {
	const [view, setView] = (0, import_react.useState)("splash");
	const [mode, setMode] = (0, import_react.useState)("login");
	const [user, setUser] = (0, import_react.useState)(null);
	const [online, setOnline] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [table, setTable] = (0, import_react.useState)(null);
	const [tables, setTables] = (0, import_react.useState)([]);
	const [pay, setPay] = (0, import_react.useState)(null);
	const [windowInfo, setWindowInfo] = (0, import_react.useState)(null);
	const [txs, setTxs] = (0, import_react.useState)([]);
	const [mute, setMute] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		username: "",
		phone: "",
		password: "",
		track: "",
		packId: PACKAGES[0].id,
		cashChips: String(MIN_CASHOUT_CHIPS),
		destCard: ""
	});
	(0, import_react.useEffect)(() => {
		setMute(loadMute());
		clubApi.ping().then(setOnline);
		clubApi.config().then((c) => setWindowInfo(c.cashout)).catch(() => {});
	}, []);
	(0, import_react.useEffect)(() => {
		if (view !== "lobby") return;
		let alive = true;
		const load = () => {
			clubApi.lobby().then((d) => {
				if (!alive) return;
				setTables(d.tables);
				setWindowInfo(d.cashout);
			}).catch(() => {});
		};
		load();
		const id = window.setInterval(load, 4e3);
		return () => {
			alive = false;
			window.clearInterval(id);
		};
	}, [view]);
	(0, import_react.useEffect)(() => {
		if (view !== "table") return;
		let alive = true;
		const tick = async () => {
			try {
				const { table: next, userPatch } = await clubApi.tablePoll();
				if (!alive) return;
				if (!next) {
					setTable(null);
					setView("lobby");
					if (userPatch) setUser((u) => u ? {
						...u,
						...userPatch
					} : u);
					return;
				}
				setTable(next);
			} catch {}
		};
		const id = window.setInterval(tick, 800);
		tick();
		return () => {
			alive = false;
			window.clearInterval(id);
		};
	}, [view]);
	const run = async (fn) => {
		setBusy(true);
		try {
			await fn();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "خطا");
		} finally {
			setBusy(false);
		}
	};
	const sit = (t) => {
		if (!user) return;
		run(async () => {
			playSfx("sit");
			const res = await clubApi.sit(t.id);
			setUser((u) => u ? {
				...u,
				...res.user
			} : u);
			setTable(res.table);
			setView("table");
			if (res.humans > 1) toast.success(`${faNum(res.humans)} بازیکن زنده سر میز هستند`);
		});
	};
	if (view === "splash") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "flex min-h-dvh w-full flex-col items-center justify-center bg-bg text-fg",
		onClick: () => {
			unlockAudio();
			playSfx("click");
			if (getToken()) clubApi.me().then(({ user: u }) => {
				setUser(u);
				setOnline(true);
				setView("lobby");
			}).catch(() => {
				setToken(null);
				setView("auth");
			});
			else setView("auth");
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spade, {
				className: "size-10 text-accent",
				strokeWidth: 1.5
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-3xl font-medium tracking-tight",
				children: "آس کلاب"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "باشگاه تگزاس هولدم"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-xs text-muted",
				children: "برای ورود و فعال شدن صدا لمس کنید"
			})
		]
	});
	if (view === "table" && table) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableView, {
		table,
		onAct: (action) => {
			run(async () => {
				const { table: next } = await clubApi.tableAct(action);
				setTable(next);
			});
		},
		onLeave: () => {
			run(async () => {
				const { user: u } = await clubApi.tableLeave();
				setUser(u);
				setTable(null);
				setView("lobby");
				playSfx("fold");
			});
		},
		onNext: () => {
			run(async () => {
				playSfx("deal");
				const { table: next } = await clubApi.tableNext();
				setTable(next);
			});
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto min-h-dvh max-w-lg bg-bg text-fg",
		children: [
			view !== "auth" && user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between px-4 pt-[max(0.9rem,env(safe-area-inset-top))] pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setView("lobby"),
					className: "flex h-11 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spade, {
						className: "size-5 text-accent",
						strokeWidth: 1.6
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: "آس کلاب"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex size-11 items-center justify-center text-muted",
							onClick: () => {
								const next = !isMuted();
								setMuted(next);
								setMute(next);
								if (!next) playSfx("click");
							},
							"aria-label": mute ? "صدا روشن" : "صدا خاموش",
							children: mute ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-1.5 rounded-full ${online ? "bg-win" : "bg-muted"}` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm tabular-nums text-chip",
							children: faNum(user.chips)
						})
					]
				})]
			}),
			view === "auth" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex min-h-dvh flex-col justify-center px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spade, {
						className: "size-8 text-accent",
						strokeWidth: 1.5
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 text-3xl font-medium",
						children: "آس کلاب"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "ورود به باشگاه زنده. میزها آنلاین‌اند."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex gap-2 rounded-lg bg-surface p-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `h-10 flex-1 rounded-md text-sm ${mode === "login" ? "bg-surface-2" : "text-muted"}`,
							onClick: () => setMode("login"),
							children: "ورود"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `h-10 flex-1 rounded-md text-sm ${mode === "register" ? "bg-surface-2" : "text-muted"}`,
							onClick: () => setMode("register"),
							children: "عضویت"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-6 space-y-3",
						onSubmit: (e) => {
							e.preventDefault();
							unlockAudio();
							run(async () => {
								const res = mode === "register" ? await clubApi.register(form.username, form.phone, form.password) : await clubApi.login(form.username, form.password);
								setUser(res.user);
								setOnline(true);
								setView("lobby");
								playSfx("sit");
								toast.success("خوش آمدید");
							});
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm text-muted",
								children: ["نام کاربری", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-1",
									value: form.username,
									autoComplete: "username",
									onChange: (e) => setForm({
										...form,
										username: e.target.value
									})
								})]
							}),
							mode === "register" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm text-muted",
								children: ["موبایل", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-1",
									inputMode: "numeric",
									placeholder: "09xxxxxxxxx",
									value: form.phone,
									onChange: (e) => setForm({
										...form,
										phone: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm text-muted",
								children: ["رمز", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-1",
									type: "password",
									autoComplete: mode === "login" ? "current-password" : "new-password",
									value: form.password,
									onChange: (e) => setForm({
										...form,
										password: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-2 w-full",
								disabled: busy,
								type: "submit",
								children: mode === "login" ? "ورود" : "ساخت حساب"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-xs leading-6 text-muted",
						children: [
							"با عضویت ",
							faNum(5e3),
							" ژتون تمرینی می‌گیرید. ژتون خوش‌آمد قابل نقد شدن نیست."
						]
					})
				]
			}),
			view === "lobby" && user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "px-4 pb-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "موجودی ژتون"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-3xl font-medium tabular-nums",
								children: faNum(user.chips)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									"قابل برداشت ",
									faNum(user.cashable),
									" · ",
									user.username
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => {
										playSfx("click");
										run(async () => {
											setPay(await clubApi.payInfo());
											setView("shop");
										});
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "size-4" }), " خرید ژتون"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "secondary",
									onClick: () => {
										playSfx("click");
										setView("cashout");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "size-4" }), " فروش ژتون"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								onClick: () => run(async () => {
									const { user: u } = await clubApi.daily();
									setUser(u);
									playSfx("chip");
									toast.success("جایزه روزانه واریز شد");
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4" }), " روزانه"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								onClick: () => run(async () => {
									const { txs: list } = await clubApi.history();
									setTxs(list);
									setView("wallet");
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4" }), " گردش"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => setView("settings"),
								children: "حساب"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-8 text-sm text-muted",
						children: "میزهای زنده"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-2",
						children: (tables.length ? tables : []).map((t) => {
							const locked = user.chips < t.min;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => sit(t),
								className: "flex w-full items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-right disabled:opacity-50",
								disabled: locked || busy,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: t.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										t.tag,
										" · بلایند ",
										faNum(t.sb),
										"/",
										faNum(t.bb),
										" · ",
										faNum(t.humans),
										" بازیکن آنلاین"
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: locked ? "ژتون کم" : "ورود به میز"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm tabular-nums",
										children: faNum(t.min)
									})]
								})]
							}, t.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs leading-6 text-muted",
						children: "بازیکنان واقعی سر یک میز می‌نشینند. صندلی خالی با حریف باشگاه پر می‌شود. نقد کردن فقط جمعه ۱۲ ظهر تا ۱۲ شب با مالیات ۱۰٪ باشگاه."
					})
				]
			}),
			view === "shop" && user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "px-4 pb-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, { onClick: () => setView("lobby") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-medium",
						children: "خرید ژتون"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-6 text-muted",
						children: "مبلغ بسته را کارت‌به‌کارت کنید، کد پیگیری را بفرستید. ژتون همان لحظه به حساب بازی می‌نشیند."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-lg border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "شماره کارت باشگاه"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium tracking-wide",
									dir: "ltr",
									children: pay ? formatCard(pay.cardNumber) : "پس از ورود نمایش داده می‌شود"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "flex size-11 items-center justify-center text-muted",
									onClick: () => {
										if (!pay) return;
										navigator.clipboard?.writeText(pay.cardNumber.replace(/\s/g, ""));
										playSfx("click");
										toast.success("شماره کارت کپی شد");
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: pay?.cardName
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-2",
						children: PACKAGES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setForm({
								...form,
								packId: p.id
							}),
							className: `flex w-full items-center justify-between rounded-lg border px-4 py-3 ${form.packId === p.id ? "border-accent bg-surface" : "border-border bg-surface"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									faNum(p.chips),
									" ژتون",
									p.bonus ? ` + ${faNum(p.bonus)} هدیه` : ""
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm tabular-nums",
								children: [faNum(p.toman), " تومان"]
							})]
						}, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 block text-sm text-muted",
						children: ["کد پیگیری / چهار رقم آخر واریز", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: form.track,
							onChange: (e) => setForm({
								...form,
								track: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-4 w-full",
						disabled: busy,
						onClick: () => run(async () => {
							const { user: u } = await clubApi.deposit(form.packId, form.track);
							setUser(u);
							playSfx("win");
							toast.success("ژتون‌ها همین الان به حساب شما نشست");
							setView("lobby");
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-4" }), " واریز کردم، ژتون بده"]
					})
				]
			}),
			view === "cashout" && user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "px-4 pb-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, { onClick: () => setView("lobby") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-medium",
						children: "فروش ژتون"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm leading-6 text-muted",
						children: [
							"هر ۱۰۰۰ ژتون قابل‌برداشت معادل ",
							faNum(4e3),
							" تومان است. مالیات باشگاه ۱۰٪ کسر می‌شود. فقط جمعه ۱۲ ظهر تا ۱۲ شب به وقت ایران."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `mt-3 rounded-lg border px-4 py-3 text-sm ${windowInfo?.open ? "border-win/40 bg-surface text-win" : "border-border bg-surface text-muted"}`,
						children: windowInfo?.label ?? "در حال بررسی پنجره نقد…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm",
						children: ["قابل برداشت: ", faNum(user.cashable)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 block text-sm text-muted",
						children: ["تعداد ژتون", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							inputMode: "numeric",
							value: form.cashChips,
							onChange: (e) => setForm({
								...form,
								cashChips: e.target.value
							})
						})]
					}),
					(() => {
						const n = Math.trunc(Number(form.cashChips) || 0);
						const m = cashoutToman(n);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted",
							children: [
								"خالص دریافتی ",
								faNum(m.net),
								" تومان (مالیات باشگاه ",
								faNum(m.fee),
								")"
							]
						});
					})(),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 block text-sm text-muted",
						children: ["شماره کارت شما", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							dir: "ltr",
							value: form.destCard,
							onChange: (e) => setForm({
								...form,
								destCard: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4 w-full",
						disabled: busy || windowInfo?.open === false,
						onClick: () => run(async () => {
							const { user: u } = await clubApi.cashout(Math.trunc(Number(form.cashChips) || 0), form.destCard);
							setUser(u);
							playSfx("chip");
							toast.success("درخواست نقد ثبت شد. تا ۱۲ شب جمعه واریز می‌شود.");
							setView("lobby");
						}),
						children: "ثبت برداشت جمعه"
					})
				]
			}),
			view === "wallet" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "px-4 pb-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, { onClick: () => setView("lobby") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-medium",
						children: "گردش حساب"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2",
						children: [txs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "هنوز تراکنشی نیست."
						}), txs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg border border-border bg-surface px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: kindFa(t.kind) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: faNum(t.chips)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									statusFa(t.status),
									" · ",
									t.note
								]
							})]
						}, t.id))]
					})
				]
			}),
			view === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "px-4 pb-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, { onClick: () => setView("lobby") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-medium",
						children: "حساب"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: user?.username
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-6 w-full",
						variant: "ghost",
						onClick: () => {
							setToken(null);
							setUser(null);
							setView("auth");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), " خروج از حساب"]
					})
				]
			})
		]
	});
}
function Back({ onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "mb-4 flex h-11 items-center gap-1 text-sm text-muted",
		onClick,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" }), " لابی"]
	});
}
function kindFa(k) {
	switch (k) {
		case "deposit": return "خرید";
		case "cashout": return "برداشت";
		case "bonus": return "جایزه";
		case "win": return "برد";
		case "lose": return "باخت";
		default: return k;
	}
}
function statusFa(s) {
	switch (s) {
		case "pending": return "در انتظار واریز";
		case "approved": return "پرداخت شد";
		case "rejected": return "رد شده";
		default: return "انجام شد";
	}
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AceClub, {});
}
//#endregion
export { Home as component };
