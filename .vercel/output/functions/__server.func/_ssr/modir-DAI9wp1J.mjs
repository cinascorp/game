import { o as __toESM } from "../_runtime.mjs";
import { L as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as clubApi, n as Input, o as faNum, r as clearAdmin, s as formatCard, t as Button } from "./club-client-BoKEZhto.mjs";
import { c as Spade, o as Trash2, t as Wallet, u as Landmark } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as EXPENSE_CATEGORIES } from "./router-D0MwSgvH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/modir-DAI9wp1J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminClub() {
	const [pass, setPass] = (0, import_react.useState)("");
	const [ok, setOk] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("vault");
	const [queue, setQueue] = (0, import_react.useState)(null);
	const [cardNumber, setCardNumber] = (0, import_react.useState)("");
	const [cardName, setCardName] = (0, import_react.useState)("");
	const [newAdmin, setNewAdmin] = (0, import_react.useState)("");
	const [exp, setExp] = (0, import_react.useState)({
		category: "vps",
		title: "",
		toman: "",
		note: ""
	});
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
	const refresh = async () => {
		const q = await clubApi.adminQueue();
		setQueue(q);
		setCardNumber(q.config.cardNumber ?? "");
		setCardName(q.config.cardName);
	};
	if (!ok) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-lg flex-col justify-center bg-bg px-6 text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spade, {
				className: "size-8 text-accent",
				strokeWidth: 1.5
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-3xl font-medium",
				children: "صندوق باشگاه"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "ورود سازنده برای هزینه نگهداری، برداشت جمعه و موجودی."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					run(async () => {
						await clubApi.adminLogin(pass);
						await refresh();
						setOk(true);
					});
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm text-muted",
					children: ["رمز مدیریت", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						type: "password",
						value: pass,
						onChange: (e) => setPass(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					disabled: busy,
					type: "submit",
					children: "ورود به صندوق"
				})]
			})
		]
	});
	const stats = queue?.stats;
	const pendingCash = queue?.pending.filter((t) => t.kind === "cashout") ?? [];
	const recentDep = queue?.deposits ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto min-h-dvh max-w-lg bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between px-4 pt-[max(0.9rem,env(safe-area-inset-top))] pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: "صندوق آس کلاب"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-11 text-sm text-muted",
					onClick: () => {
						clearAdmin();
						setOk(false);
					},
					children: "خروج"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex gap-1 overflow-x-auto px-4 pb-3",
				children: [
					["vault", "صندوق"],
					["payouts", "برداشت"],
					["members", "اعضا"],
					["costs", "هزینه"],
					["settings", "تنظیم"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(id),
					className: `h-10 shrink-0 rounded-md px-3 text-sm ${tab === id ? "bg-surface-2" : "text-muted"}`,
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "px-4 pb-24",
				children: [
					tab === "vault" && stats && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "اعضا",
									value: faNum(stats.users)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "رِیک ژتون",
									value: faNum(stats.rakeChips)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "واریزی بازیکن",
									value: `${faNum(stats.depositedToman)} ت`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "پرداخت شده",
									value: `${faNum(stats.cashedToman)} ت`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "مالیات ۱۰٪",
									value: `${faNum(stats.cashoutFees)} ت`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "هزینه نگهداری",
									value: `${faNum(stats.expensesToman)} ت`
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-xl border border-border bg-surface p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "مانده صندوق"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-3xl font-medium tabular-nums",
									children: [faNum(stats.vaultToman), " تومان"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs leading-6 text-muted",
									children: "واریزی بازیکنان منهای پرداخت جمعه و هزینه‌های سرور، هاست و دامنه."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-8 text-sm text-muted",
							children: "آخرین خرید ژتون"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TxList, { items: recentDep })
					] }),
					tab === "payouts" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted",
							children: "نقد کردن فقط جمعه ۱۲ ظهر تا ۱۲ شب. بعد از واریز کارت بازیکن، تأیید کنید."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-6 text-sm text-muted",
							children: "در صف پرداخت"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-2",
							children: [pendingCash.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "صف خالی است."
							}), pendingCash.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-border bg-surface p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm",
										children: [
											t.username ?? "بازیکن",
											" · ",
											faNum(Math.abs(t.chips)),
											" ژتون · ",
											faNum(t.toman),
											" تومان"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted",
										dir: "ltr",
										children: t.note
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											className: "flex-1",
											disabled: busy,
											onClick: () => run(async () => {
												await clubApi.adminDecide(t.id, true);
												await refresh();
												toast.success("پرداخت ثبت شد");
											}),
											children: "واریز شد"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "secondary",
											className: "flex-1",
											disabled: busy,
											onClick: () => run(async () => {
												await clubApi.adminDecide(t.id, false);
												await refresh();
											}),
											children: "برگرداندن ژتون"
										})]
									})
								]
							}, t.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-8 text-sm text-muted",
							children: "تاریخچه برداشت"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TxList, { items: queue?.cashouts ?? [] })
					] }),
					tab === "members" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: (queue?.users ?? []).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg border border-border bg-surface px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: u.username }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums text-chip",
									children: faNum(u.chips)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								dir: "ltr",
								children: [
									u.phone,
									" · واریز ",
									faNum(u.depositedToman),
									" · برداشت ",
									faNum(u.cashedToman)
								]
							})]
						}, u.id))
					}),
					tab === "costs" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-6 text-muted",
							children: "هزینه سرور، هاست، دامنه و نگهداری را اینجا ثبت کنید تا مانده صندوق واقعی باشد."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-3 rounded-xl border border-border bg-surface p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-sm text-muted",
									children: ["دسته", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "mt-1 h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg",
										value: exp.category,
										onChange: (e) => setExp({
											...exp,
											category: e.target.value
										}),
										children: EXPENSE_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: c.id,
											children: c.label
										}, c.id))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-sm text-muted",
									children: ["عنوان", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "mt-1",
										placeholder: "مثلاً تمدید دامنه",
										value: exp.title,
										onChange: (e) => setExp({
											...exp,
											title: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-sm text-muted",
									children: ["مبلغ تومان", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "mt-1",
										inputMode: "numeric",
										value: exp.toman,
										onChange: (e) => setExp({
											...exp,
											toman: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-sm text-muted",
									children: ["یادداشت", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "mt-1",
										value: exp.note,
										onChange: (e) => setExp({
											...exp,
											note: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "w-full",
									disabled: busy,
									onClick: () => run(async () => {
										await clubApi.addExpense({
											category: exp.category,
											title: exp.title,
											toman: Math.trunc(Number(exp.toman) || 0),
											note: exp.note
										});
										setExp({
											...exp,
											title: "",
											toman: "",
											note: ""
										});
										await refresh();
										toast.success("هزینه ثبت شد");
									}),
									children: "ثبت هزینه نگهداری"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-2",
							children: (queue?.expenses ?? []).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									children: e.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										catFa(e.category),
										" · ",
										faNum(e.toman),
										" تومان"
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "flex size-11 items-center justify-center text-muted",
									onClick: () => run(async () => {
										await clubApi.removeExpense(e.id);
										await refresh();
									}),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
							}, e.id))
						})
					] }),
					tab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm text-muted",
							children: ["شماره کارت واریز بازیکنان", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								dir: "ltr",
								value: formatCard(cardNumber),
								onChange: (e) => setCardNumber(e.target.value.replace(/\D/g, ""))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 block text-sm text-muted",
							children: ["نام صاحب کارت", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								value: cardName,
								onChange: (e) => setCardName(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 block text-sm text-muted",
							children: ["رمز جدید مدیریت", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								type: "password",
								value: newAdmin,
								onChange: (e) => setNewAdmin(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4 w-full",
							variant: "secondary",
							disabled: busy,
							onClick: () => run(async () => {
								await clubApi.saveConfig({
									cardNumber,
									cardName,
									adminPass: newAdmin
								});
								await refresh();
								toast.success("ذخیره شد");
							}),
							children: "ذخیره"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs leading-6 text-muted",
							children: "شماره کارت فقط بعد از ورود بازیکن در صفحه خرید نشان داده می‌شود. آدرس سرور در اپ بازیکن نیست."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-center gap-2 text-sm text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "size-4" }), "مالیات برداشت ۱۰٪ · نقد فقط جمعه"]
						})
					] })
				]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm tabular-nums",
			children: value
		})]
	});
}
function TxList({ items }) {
	if (!items.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-3 text-sm text-muted",
		children: "موردی نیست."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-3 space-y-2",
		children: items.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-lg border border-border bg-surface px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.username ?? t.kind }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums",
					children: faNum(t.toman || t.chips)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: t.note
			})]
		}, t.id))
	});
}
function catFa(id) {
	return EXPENSE_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
function AdminPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminClub, {});
}
//#endregion
export { AdminPage as component };
