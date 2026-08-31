type SfxKind = "chip" | "card" | "win" | "fold" | "click" | "sit" | "deal";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfxBus: GainNode | null = null;
let unlocked = false;
let muted = false;

function ensure() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    try {
      ctx = new AC({ latencyHint: "interactive" });
    } catch {
      ctx = new AC();
    }
    master = ctx.createGain();
    sfxBus = ctx.createGain();
    sfxBus.connect(master);
    master.connect(ctx.destination);
    master.gain.value = muted ? 0 : 0.9;
    sfxBus.gain.value = 0.7;
  }
  return ctx;
}

export function unlockAudio() {
  const audio = ensure();
  if (!audio) return;
  if (audio.state === "suspended") void audio.resume();
  unlocked = true;
}

export function isMuted() {
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
  if (typeof window !== "undefined") localStorage.setItem("aceclub.mute", next ? "1" : "0");
  if (master && ctx) {
    master.gain.setTargetAtTime(next ? 0 : 0.9, ctx.currentTime, 0.02);
  }
}

export function loadMute() {
  if (typeof window === "undefined") return false;
  muted = localStorage.getItem("aceclub.mute") === "1";
  return muted;
}

function tone(
  type: OscillatorType,
  freq: number,
  dur: number,
  gain = 0.05,
  slide?: number,
) {
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
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g);
  g.connect(sfxBus);
  o.start(t);
  o.stop(t + dur + 0.02);
  o.onended = () => {
    o.disconnect();
    g.disconnect();
  };
}

export function playSfx(kind: SfxKind) {
  if (!unlocked && kind !== "click") {
    unlockAudio();
  }
  const jitter = 1 + (Math.random() * 0.08 - 0.04);
  if (kind === "card" || kind === "deal") {
    tone("triangle", 420 * jitter, 0.09, 0.045, 170);
  } else if (kind === "chip") {
    tone("square", 880 * jitter, 0.07, 0.035, 420);
    tone("triangle", 1320 * jitter, 0.04, 0.02);
  } else if (kind === "fold") {
    tone("sine", 210 * jitter, 0.14, 0.04, 110);
  } else if (kind === "win") {
    tone("sine", 523, 0.12, 0.05);
    tone("sine", 659, 0.16, 0.045);
    tone("sine", 784, 0.28, 0.05);
  } else if (kind === "sit") {
    tone("triangle", 330, 0.12, 0.04, 520);
  } else {
    tone("sine", 640 * jitter, 0.05, 0.03);
  }
}

if (typeof window !== "undefined") {
  const boot = () => unlockAudio();
  window.addEventListener("pointerdown", boot, { once: true });
  window.addEventListener("keydown", boot, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") unlockAudio();
  });
}
