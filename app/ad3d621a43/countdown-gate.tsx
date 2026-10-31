"use client";

import { useEffect, useState, type ReactNode } from "react";

// Ponedeljek, 2. 11. 2026 ob 9:00 (slovenski čas)
const OPEN_AT = new Date("2026-11-02T09:00:00+01:00").getTime();
const UNLOCK_KEY = "ad3d621a43-unlocked";
const MISSES_KEY = "ad3d621a43-misses";
// Napisano je 3 poskuse, v resnici jih ima 6 (zadnji "poskus" se ponovi)
const SHOWN_TRIES = 3;
const REAL_TRIES = 6;

function triesLabel(n: number) {
  return n === 1 ? "1 poskus" : n === 2 ? "2 poskusa" : `${n} poskuse`;
}

const UNITS = [
  { label: "dni", ms: 86_400_000 },
  { label: "ur", ms: 3_600_000 },
  { label: "min", ms: 60_000 },
  { label: "sek", ms: 1_000 },
];

// Kviz za predčasen dostop – `answer` je indeks pravilnega odgovora
const QUIZ = [
  { q: "Kateri šejk vedno naročim v Unicafeju?", options: ["Čokolada", "Slana karamela", "Vanilija", "Jagoda"], answer: 1 },
  { q: "Kaj naročim, ko ne pijem šejka?", options: ["Ledeni čaj", "Kava", "Coca-Cola Zero", "Voda"], answer: 2 },
  { q: "Kdaj sem rojen?", options: ["5. 1. 1999", "15. 1. 2001", "5. 1. 2001", "1. 5. 2001", "5. 1. 1998", "5. 1. 2000"], answer: 2 },
  { q: "Kje sem se rodil?", options: ["Ljubljana", "Celje", "Ptuj", "Maribor"], answer: 3 },
  { q: "Moje najljubše podjetje?", options: ["Apple", "Deltok", "Tesla", "Google"], answer: 1 },
  { q: "Moja barva?", options: ["Zelena", "Črna", "Baby blue", "Rdeča"], answer: 2 },
];

export default function CountdownGate({ children }: { children: ReactNode }) {
  const [now, setNow] = useState<number | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [quiz, setQuiz] = useState<number | null>(null);
  const [wrong, setWrong] = useState(false);
  const [misses, setMisses] = useState(0);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(() => {
      try {
        if (localStorage.getItem(UNLOCK_KEY)) setUnlocked(true);
        setMisses(Number(localStorage.getItem(MISSES_KEY)) || 0);
      } catch {}
      tick();
    }, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  function answer(i: number) {
    if (quiz === null) return;
    if (i !== QUIZ[quiz].answer) {
      const next = misses + 1;
      setMisses(next);
      try {
        localStorage.setItem(MISSES_KEY, String(next));
      } catch {}
      setWrong(true);
      setQuiz(next >= REAL_TRIES ? null : 0);
      return;
    }
    setWrong(false);
    if (quiz < QUIZ.length - 1) {
      setQuiz(quiz + 1);
      return;
    }
    try {
      localStorage.setItem(UNLOCK_KEY, "1");
    } catch {}
    setUnlocked(true);
  }

  // Pred hidracijo ne vemo, koliko je ura – ne pokaži ničesar
  if (now === null) return <main className="flex-1" />;
  if (unlocked || now >= OPEN_AT) return children;

  const outOfTries = misses >= REAL_TRIES;
  const shownLeft = outOfTries ? 0 : Math.max(1, SHOWN_TRIES - misses);

  if (quiz !== null) {
    const item = QUIZ[quiz];
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div key={`${quiz}-${misses}`} className="fade-up flex w-full max-w-sm flex-col gap-6">
          <div>
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.3em]">
              <span className="text-baby-400">
                Vprašanje {quiz + 1}/{QUIZ.length}
              </span>
              <span className="text-white/40">{shownLeft === 1 ? "Zadnji poskus" : triesLabel(shownLeft)}</span>
              <button onClick={() => setQuiz(null)} className="text-white/40 hover:text-white">
                ✕
              </button>
            </div>
            <div className="mt-3 flex gap-1">
              {QUIZ.map((_, i) => (
                <span key={i} className={`h-1 flex-1 rounded-full ${i < quiz ? "bg-baby-400" : "bg-white/10"}`} />
              ))}
            </div>
            {wrong ? (
              <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/30">
                Napačno 😏 {shownLeft === 1 ? "Zadnji poskus" : `Še ${triesLabel(shownLeft)}`} – gremo od začetka.
              </p>
            ) : null}
            <h2 className="mt-4 font-display text-4xl font-extrabold uppercase leading-none">{item.q}</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {item.options.map((o, i) => (
              <button
                key={o}
                onClick={() => answer(i)}
                className="rounded-xl bg-white/[0.04] px-3 py-4 text-lg ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:ring-baby-400/60"
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  const left = OPEN_AT - now;
  const parts = UNITS.map((u, i) => {
    const rest = i === 0 ? left : left % UNITS[i - 1].ms;
    return { ...u, value: Math.floor(rest / u.ms) };
  });

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="fade-up flex w-full max-w-sm flex-col gap-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-baby-400">🔒 Zaklenjeno</p>
          <h1 className="mt-1 font-display text-5xl font-extrabold uppercase leading-[0.9]">
            Še malo.
            <span className="block text-white/40">Pomembno vprašanje se odklene v ponedeljek ob 9:00.</span>
          </h1>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {parts.map((p) => (
            <div key={p.label} className="flex flex-col items-center rounded-2xl bg-white/[0.04] py-4 ring-1 ring-white/10">
              <span className="font-display text-4xl font-extrabold tabular-nums text-baby-400">
                {String(p.value).padStart(2, "0")}
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{p.label}</span>
            </div>
          ))}
        </div>

        {outOfTries ? (
          <p className="rounded-xl bg-red-500/10 px-4 py-3 text-center text-sm text-red-300 ring-1 ring-red-500/30">
            Porabila si vse poskuse 😏 Zdaj pa lepo počakaj do ponedeljka.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setWrong(false);
                setQuiz(0);
              }}
              className="rounded-xl bg-baby-400 py-3.5 font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              🔓 Zahtevaj dostop zdaj
            </button>
            <p className="text-center text-sm text-white/50">
              Odgovori pravilno na {QUIZ.length} vprašanj o meni in ti ni treba čakati do ponedeljka. Imaš{" "}
              {shownLeft === 1 ? "samo še 1 poskus" : triesLabel(shownLeft)}.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
