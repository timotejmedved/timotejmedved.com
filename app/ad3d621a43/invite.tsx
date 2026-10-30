"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import SwipeDeck, { type Card } from "./swipe-deck";

// Spremeni po svoje 👇
const MY_NAME = "Timotej";
const PLACE = "JackJone";
const MY_INSTAGRAM = ""; // npr. "timotej.medved" – pusti prazno, če ga ne želiš

const ABOUT: Card[] = [
  { src: "/ad3d621a43/photos/gym1.jpg", tag: "📍 fitnes · 4–5× na teden", caption: "Naravni habitat. Tu si me videla." },
  { src: "/ad3d621a43/photos/bike.jpg", tag: "🚵 kolo", caption: "Druga ljubezen: kolo in razgled na koncu klanca." },
  { src: "/ad3d621a43/photos/street.jpg", tag: "👟 izven fitnesa", caption: "Dokaz, da nimam samo trenirke." },
  { src: "/ad3d621a43/photos/elevator.jpg", tag: "🛗 dvigalo", caption: "Kapa z medvedom. Ker… Medved. 🐻" },
  { src: "/ad3d621a43/photos/poster.webp", tag: "💻 programer", caption: "Ja, imam svoj poster. Ne sprašuj.", pos: "50% 20%" },
  { src: "/ad3d621a43/photos/gym2.jpg", tag: "🔒 slačilnica", caption: "Po treningu. Sexy as hell 😏" },
];

// Kje sem na sliki, v % širine/višine (x1, y1, x2, y2)
const ROUNDS = [
  {
    src: "/ad3d621a43/photos/group1.jpg",
    w: 1125,
    h: 1500,
    box: [45, 21, 56, 48],
    hint: "Namig: nekdo je pa zelo navdušen 👏",
  },
  {
    src: "/ad3d621a43/photos/group2.jpg",
    w: 1500,
    h: 1125,
    box: [38, 32, 46, 60],
    hint: "Namig: med strelci za mizo 🏹",
  },
];

const MISSES = [
  "To ni jaz 😅",
  "Simpatičen, ampak ne",
  "Blizu… v bistvu ne",
  "Ta mi dolguje 5 €, ampak to nisem jaz",
  "Hmm, a me res nisi opazila? 🥲",
];

const WEEK = [
  { day: "PON", what: "Prsa + triceps" },
  { day: "TOR", what: "Hrbet + biceps" },
  { day: "SRE", what: "Noge (ja, tudi to)" },
  { day: "ČET", what: "Rame" },
  { day: "PET", what: "Počitek" },
];

const DAYS = ["Petek", "Sobota", "Nedelja", "Drug dan"];

type Step = "intro" | "spot" | "spotted" | "plan" | "day" | "done";
type Mark = { x: number; y: number; hit: boolean; id: number };

export default function Invite() {
  const [step, setStep] = useState<Step>("intro");
  const [round, setRound] = useState(0);
  const [misses, setMisses] = useState(0);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [missText, setMissText] = useState<string | null>(null);
  const [times, setTimes] = useState<number[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);
  const [found, setFound] = useState(false);
  const [checked, setChecked] = useState(0);
  const [day, setDay] = useState<string | null>(null);
  const [lefts, setLefts] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (step !== "spot" || found) return;
    const t = setInterval(() => setElapsed((performance.now() - startRef.current) / 1000), 100);
    return () => clearInterval(t);
  }, [step, found]);

  useEffect(() => {
    if (step !== "plan" || checked >= WEEK.length) return;
    const t = setTimeout(() => setChecked((c) => c + 1), checked === 0 ? 600 : 300);
    return () => clearTimeout(t);
  }, [step, checked]);

  const startGame = () => {
    setRound(0);
    setMisses(0);
    setMarks([]);
    setTimes([]);
    setElapsed(0);
    setFound(false);
    startRef.current = performance.now();
    setStep("spot");
  };

  const tap = (e: MouseEvent<HTMLDivElement>) => {
    if (found) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const [x1, y1, x2, y2] = ROUNDS[round].box;
    const pad = 2.5;
    const hit = x >= x1 - pad && x <= x2 + pad && y >= y1 - pad && y <= y2 + pad;
    const mark = { x: hit ? (x1 + x2) / 2 : x, y: hit ? (y1 + y2) / 2 : y, hit, id: Date.now() };

    if (hit) {
      const t = (performance.now() - startRef.current) / 1000;
      setElapsed(t);
      setFound(true);
      setMarks([mark]);
      setMissText(null);
      setTimes((ts) => [...ts, t]);
      setTimeout(() => {
        if (round + 1 < ROUNDS.length) {
          setRound(round + 1);
          setMisses(0);
          setMarks([]);
          setElapsed(0);
          setFound(false);
          startRef.current = performance.now();
        } else {
          setStep("spotted");
        }
      }, 1500);
    } else {
      setMarks((m) => [...m.slice(-2), mark]);
      setMissText(MISSES[misses % MISSES.length]);
      setMisses((m) => m + 1);
    }
  };

  const total = times.reduce((a, b) => a + b, 0);
  const current = ROUNDS[round];
  const [bx1, by1, bx2, by2] = current.box;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div key={step === "spot" ? `spot-${round}` : step} className="fade-up">
          {step === "intro" && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-lime-400">Hej 👋</p>
                <h1 className="mt-1 font-display text-5xl font-extrabold uppercase leading-[0.9]">
                  Jaz sem {MY_NAME}.
                  <span className="block text-white/40">Iščem spotterja.</span>
                </h1>
              </div>

              {lefts === null ? (
                <SwipeDeck cards={ABOUT} name={MY_NAME} onDone={setLefts} />
              ) : (
                <div className="fade-up flex flex-col gap-6">
                  <div className="flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-b from-lime-400/20 to-transparent px-5 py-8 text-center ring-1 ring-lime-400/30">
                    <div className="flex items-center">
                      <span className="flex size-20 items-center justify-center rounded-full bg-zinc-800 text-3xl ring-4 ring-black">
                        🫵
                      </span>
                      <span className="relative -ml-4 size-20 overflow-hidden rounded-full ring-4 ring-black">
                        <Image src="/ad3d621a43/photos/gym1.jpg" alt={MY_NAME} fill sizes="80px" className="object-cover object-top" />
                      </span>
                    </div>
                    <p className="font-display text-5xl font-extrabold uppercase italic leading-none text-lime-400">
                      It&apos;s a match
                    </p>
                    <p className="text-white/70">
                      {ABOUT.length}/{ABOUT.length} všečkov
                      {lefts > 0 && `, tudi ${lefts === 1 ? "tisti, ki si ga swipala" : "tisti, ki si jih swipala"} levo 😄`}
                    </p>
                  </div>

                  <p className="text-lg leading-snug">
                    Zdaj pa ena hitra igra.
                    <span className="font-semibold"> Me lahko spottaš? 👀</span>
                  </p>
                  <button
                    onClick={startGame}
                    className="rounded-xl bg-lime-400 py-3.5 font-display text-2xl font-bold uppercase text-black transition-all hover:-translate-y-0.5 hover:bg-lime-300"
                  >
                    Igraj: Spot me 👀
                  </button>
                  <p className="-mt-3 text-center text-xs text-white/40">Najdi me na 2 slikah. Merim čas.</p>
                </div>
              )}
            </div>
          )}

          {step === "spot" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-lime-400">
                    Spot me · {round + 1}/{ROUNDS.length}
                  </p>
                  <h2 className="mt-1 font-display text-4xl font-extrabold uppercase leading-none">Kje sem?</h2>
                </div>
                <span className="font-mono text-2xl tabular-nums text-lime-400">{elapsed.toFixed(1)}s</span>
              </div>

              <div
                onClick={tap}
                className="relative cursor-crosshair overflow-hidden rounded-2xl ring-1 ring-white/10 select-none"
                style={{ aspectRatio: `${current.w} / ${current.h}` }}
              >
                <Image
                  src={current.src}
                  alt="Najdi me"
                  fill
                  sizes="(max-width: 400px) 100vw, 384px"
                  className="pointer-events-none object-cover"
                  priority
                  draggable={false}
                />
                {misses >= 4 && !found && (
                  <span
                    className="hint-ring pointer-events-none absolute rounded-full border-2 border-lime-400/70"
                    style={{
                      left: `${bx1 - 6}%`,
                      top: `${by1 - 4}%`,
                      width: `${bx2 - bx1 + 12}%`,
                      height: `${by2 - by1 + 8}%`,
                    }}
                  />
                )}
                {marks.map((m) =>
                  m.hit ? (
                    <span
                      key={m.id}
                      className="pop pointer-events-none absolute rounded-full border-4 border-lime-400 shadow-[0_0_30px_rgb(163_230_53/0.8)]"
                      style={{
                        left: `${bx1 - 3}%`,
                        top: `${by1 - 2}%`,
                        width: `${bx2 - bx1 + 6}%`,
                        height: `${by2 - by1 + 4}%`,
                      }}
                    />
                  ) : (
                    <span
                      key={m.id}
                      className="pop pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-2xl font-black text-red-500 drop-shadow"
                      style={{ left: `${m.x}%`, top: `${m.y}%` }}
                    >
                      ✕
                    </span>
                  ),
                )}
              </div>

              <p className={`min-h-6 text-center ${found ? "font-semibold text-lime-400" : "text-white/70"}`}>
                {found
                  ? `Našla! ${elapsed.toFixed(1)} s 🎯`
                  : missText
                    ? `${missText}${misses >= 2 ? ` · ${current.hint}` : ""}`
                    : "Tapni name."}
              </p>
            </div>
          )}

          {step === "spotted" && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-lime-400">Rezultat</p>
                <h2 className="mt-1 font-display text-5xl font-extrabold uppercase leading-none">
                  {total < 8 ? "Hitra si 👀" : total < 20 ? "Opazila si me" : "Na koncu si me le našla"}
                </h2>
              </div>
              <div className="rounded-2xl bg-lime-400 p-5 text-black">
                <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-60">Certifikat</p>
                <p className="mt-1 font-display text-3xl font-extrabold uppercase leading-none">Uradni spotter</p>
                <div className="mt-4 flex items-center justify-between border-t border-black/15 pt-3 font-mono text-sm">
                  <span>{ROUNDS.length}/{ROUNDS.length} najdeno</span>
                  <span>{total.toFixed(1)} s</span>
                </div>
              </div>
              <p className="text-lg leading-snug text-white/80">
                {total < 8
                  ? "Ok, to je bilo pa sumljivo hitro. Ne bom komentiral 😄"
                  : "Dobro, potem je čas, da tudi jaz naredim svoj del."}
              </p>
              <button
                onClick={() => setStep("plan")}
                className="rounded-xl bg-white/[0.06] py-3.5 font-semibold ring-1 ring-white/15 transition-colors hover:bg-white/10"
              >
                Naprej →
              </button>
            </div>
          )}

          {step === "plan" && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-lime-400">Trening plan · {MY_NAME}</p>
                <h1 className="mt-1 font-display text-5xl font-extrabold uppercase leading-none">Ta teden</h1>
              </div>

              <ul className="flex flex-col divide-y divide-white/5 overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
                {WEEK.map((w, i) => (
                  <li key={w.day} className="flex items-center gap-4 px-4 py-3">
                    <span className="w-9 font-mono text-xs text-white/40">{w.day}</span>
                    <span className={`flex-1 transition-colors ${i < checked ? "text-white/40 line-through" : ""}`}>
                      {w.what}
                    </span>
                    <span
                      className={`flex size-6 items-center justify-center rounded-full text-sm transition-all duration-300 ${
                        i < checked ? "scale-100 bg-lime-400 text-black" : "scale-75 bg-white/10 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </li>
                ))}
                <li className="flex items-center gap-4 bg-lime-400/10 px-4 py-4">
                  <span className="w-9 font-mono text-xs text-lime-400">SOB</span>
                  <span className="flex-1">
                    <span className="font-semibold text-lime-300">Cheat meal 🍔</span>
                    <span className="block text-sm text-white/60">kosilo v {PLACE}</span>
                  </span>
                  <span className="blink rounded-full border border-dashed border-lime-400/60 px-2 py-0.5 font-mono text-[10px] uppercase text-lime-400">
                    spotter: ti?
                  </span>
                </li>
              </ul>

              <div
                className={`flex flex-col gap-4 transition-opacity duration-500 ${
                  checked >= WEEK.length ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <p className="text-lg leading-snug">
                  Za vse ostalo sem že poskrbel, samo za cheat meal rabim še spotterja. Certifikat že imaš, zato:
                  <span className="font-semibold"> greš na kosilo z mano?</span>
                </p>
                <button
                  onClick={() => setStep("day")}
                  className="rounded-xl bg-lime-400 py-3.5 font-display text-xl font-bold uppercase text-black transition-all hover:-translate-y-0.5 hover:bg-lime-300"
                >
                  Sem zraven
                </button>
                <p className="-mt-2 text-center text-xs text-white/40">(druge opcije ni 😄)</p>
              </div>
            </div>
          )}

          {step === "day" && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-lime-400">Odlično 💪</p>
                <h2 className="mt-1 font-display text-4xl font-extrabold uppercase leading-none">Kateri dan ti paše?</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDay(d);
                      setStep("done");
                    }}
                    className="rounded-xl bg-white/[0.04] py-4 text-lg ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:ring-lime-400/60"
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "done" && day && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-lime-400">Plan posodobljen</p>
                <h2 className="mt-1 font-display text-5xl font-extrabold uppercase leading-none">Zmenjeno 🤝</h2>
              </div>
              <div className="rounded-2xl bg-lime-400 p-5 text-black">
                <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-60">
                  {day === "Drug dan" ? "Dan: dogovoriva se" : day}
                </p>
                <p className="mt-1 font-display text-3xl font-extrabold uppercase leading-none">Kosilo v {PLACE}</p>
                <div className="mt-4 flex items-center justify-between border-t border-black/15 pt-3 text-sm">
                  <span>Spotter: ✓ ti ({total.toFixed(1)} s)</span>
                  <span>Račun: jaz</span>
                </div>
              </div>
              {MY_INSTAGRAM ? (
                <a
                  href={`https://instagram.com/${MY_INSTAGRAM}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl py-3.5 text-center font-semibold ring-1 ring-white/15 transition-colors hover:bg-white/5"
                >
                  Napiši mi na Instagram, da se zmeniva za uro →
                </a>
              ) : null}
              <p className="text-center text-white/60">
                {MY_INSTAGRAM ? "Ali pa mi" : "Pokaži mi"} ta zaslon, ko se naslednjič vidiva v fitnesu 😄
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-lime-400">P.S.</p>
                <p className="text-lg leading-snug">
                  <span className="font-semibold">Na kosilu točim jaz 💧</span>
                </p>
                <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
                  <video
                    ref={videoRef}
                    src="/ad3d621a43/videos/kozarec.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="aspect-[9/16] max-h-[70vh] w-full bg-zinc-900 object-cover"
                  />
                  <button
                    onClick={() => {
                      const v = videoRef.current;
                      if (!v) return;
                      v.muted = !muted;
                      setMuted(!muted);
                      if (!muted) return;
                      v.currentTime = 0;
                      void v.play();
                    }}
                    className="absolute right-3 bottom-3 rounded-full bg-black/60 px-3 py-1.5 text-sm backdrop-blur"
                  >
                    {muted ? "🔇 vklopi zvok" : "🔊"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="mt-12 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
          v1.1 · sprogramiral namesto treninga
        </p>
      </div>
    </main>
  );
}
