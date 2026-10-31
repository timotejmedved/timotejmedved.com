"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";

export type Card = { src: string; caption: string; tag: string; pos?: string };

const LEFT_REPLIES = [
  "Levo? Sistem je to zabeležil kot 🩵",
  "Funkcija »ne« je še v razvoju 🛠️",
  "Hmm, levo pri meni ne deluje. Še en like.",
  "Ok, to je bil pa definitivno like 😄",
];

const RIGHT_REPLIES = ["Dober okus 😎", "Vedel sem 🩵", "Ja, tudi meni je ta všeč", "🩵"];

const THRESHOLD = 90;

export default function SwipeDeck({
  cards,
  name,
  onDone,
}: {
  cards: Card[];
  name: string;
  onDone: (leftSwipes: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [leaving, setLeaving] = useState<-1 | 1 | 0>(0);
  const [reply, setReply] = useState<{ text: string; id: number } | null>(null);
  const [lefts, setLefts] = useState(0);
  const startX = useRef(0);

  const fling = (dir: -1 | 1) => {
    if (leaving || index >= cards.length) return;
    setLeaving(dir);
    const nextLefts = dir === -1 ? lefts + 1 : lefts;
    const pool = dir === -1 ? LEFT_REPLIES : RIGHT_REPLIES;
    setReply({ text: pool[(dir === -1 ? lefts : index) % pool.length], id: Date.now() });
    setLefts(nextLefts);
    setTimeout(() => {
      setLeaving(0);
      setDx(0);
      if (index + 1 >= cards.length) onDone(nextLefts);
      setIndex((i) => i + 1);
    }, 280);
  };

  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (leaving) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    setDragging(true);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging) setDx(e.clientX - startX.current);
  };
  const up = () => {
    if (!dragging) return;
    setDragging(false);
    if (Math.abs(dx) > THRESHOLD) fling(dx > 0 ? 1 : -1);
    else setDx(0);
  };

  const offset = leaving ? leaving * 600 : dx;
  const tilt = Math.max(-1, Math.min(1, offset / 300));
  const card = cards[index];
  const next = cards[index + 1];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[3/4] w-full">
        {next && (
          <div className="absolute inset-0 scale-95 overflow-hidden rounded-3xl bg-zinc-800 opacity-60">
            <Image src={next.src} alt="" fill sizes="384px" className="object-cover" style={{ objectPosition: next.pos }} />
          </div>
        )}

        {card && (
          <div
            key={card.src}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            className="absolute inset-0 cursor-grab touch-pan-y overflow-hidden rounded-3xl bg-zinc-800 shadow-2xl select-none active:cursor-grabbing"
            style={{
              transform: `translateX(${offset}px) rotate(${tilt * 14}deg)`,
              transition: dragging ? "none" : "transform 0.28s ease-out",
            }}
          >
            <Image
              src={card.src}
              alt={card.caption}
              fill
              sizes="384px"
              priority
              draggable={false}
              className="pointer-events-none object-cover"
              style={{ objectPosition: card.pos }}
            />

            <div className="absolute inset-x-3 top-3 flex gap-1">
              {cards.map((c, i) => (
                <span key={c.src} className={`h-1 flex-1 rounded-full ${i <= index ? "bg-white" : "bg-white/30"}`} />
              ))}
            </div>

            <span
              className="absolute top-10 left-5 -rotate-12 rounded-lg border-4 border-baby-400 px-3 py-1 font-display text-4xl font-extrabold text-baby-400 uppercase"
              style={{ opacity: Math.max(0, tilt) * 1.6 }}
            >
              Like
            </span>
            <span
              className="absolute top-10 right-5 rotate-12 rounded-lg border-4 border-pink-400 px-3 py-1 font-display text-4xl leading-none font-extrabold text-pink-400 uppercase"
              style={{ opacity: Math.max(0, -tilt) * 1.6 }}
            >
              Tudi
              <br />
              like
            </span>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-5 pt-20 pb-5">
              <p className="font-display text-4xl font-extrabold uppercase leading-none">{name}</p>
              <p className="mt-1 text-sm text-white/60">{card.tag}</p>
              <p className="mt-2 leading-snug">{card.caption}</p>
            </div>
          </div>
        )}
      </div>

      <p key={reply?.id} className="fade-up min-h-6 text-center text-white/80">
        {reply?.text ?? "Swipaj levo ali desno. Kakorkoli, ni napačnega odgovora."}
      </p>

      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => fling(-1)}
          aria-label="Ne"
          className="flex size-16 items-center justify-center rounded-full text-2xl text-pink-400 ring-1 ring-white/15 transition-all hover:scale-105 hover:bg-white/5"
        >
          ✕
        </button>
        <button
          onClick={() => fling(1)}
          aria-label="Všeč mi je"
          className="flex size-20 items-center justify-center rounded-full bg-baby-400 text-3xl text-black transition-all hover:scale-105"
        >
          ❤️
        </button>
      </div>
    </div>
  );
}
