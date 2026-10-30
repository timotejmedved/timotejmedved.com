import Image from "next/image";

// Kontakti – prazno pomeni, da se povezava ne prikaže
const EMAIL = "";
const LINKEDIN = "";
const GITHUB = "https://github.com/timotejmedved";

const VALUES = [
  { title: "Inovativnost", line: "Build better.", icon: "M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" },
  {
    title: "Osredotočenost",
    line: "Focus. Finish.",
    icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01",
  },
  {
    title: "Poštenost",
    line: "Do it right.",
    icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1",
  },
  { title: "Rast", line: "1 % vsak dan.", icon: "M3 17l6-6 4 4 8-8M15 7h6v6" },
  { title: "Vizija", line: "Milijon do 2028.", icon: "M3 20l6-10 4 6 3-4 5 8zM9 10V3l5 2-5 2" },
];

const PILLARS = ["Builder of digital solutions.", "Focused on impact.", "Driven by purpose."];

const LINKS = [
  { label: "Email", href: EMAIL && `mailto:${EMAIL}` },
  { label: "LinkedIn", href: LINKEDIN },
  { label: "GitHub", href: GITHUB },
].filter((l) => l.href);

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-7 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <span aria-hidden className="pointer-events-none absolute hidden md:block -left-24 top-40 h-[2px] w-[480px] -rotate-[60deg] bg-accent/70" />
      <span aria-hidden className="pointer-events-none absolute hidden md:block -right-20 top-[30rem] h-[2px] w-[420px] -rotate-[60deg] bg-accent/70" />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-8">
        <a href="#" className="text-sm font-semibold uppercase leading-tight tracking-[0.2em]">
          Timotej
          <br />
          Medved
        </a>
        <nav className="flex gap-5 text-xs font-medium uppercase tracking-[0.2em] text-ink-soft sm:gap-8">
          <a href="#o-meni" className="hover:text-accent">O meni</a>
          <a href="#vrednote" className="hover:text-accent">Vrednote</a>
          <a href="#kontakt" className="hover:text-accent">Kontakt</a>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-8">
        <section className="grid items-center gap-10 pb-20 pt-6 md:grid-cols-[1.1fr_1fr] md:pt-12">
          <div className="relative z-10">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-ink-soft">
              Software architect <span className="text-accent">&amp;</span> founder
            </p>
            <h1 className="mt-4 font-display text-[clamp(4.5rem,15vw,10rem)] font-extrabold uppercase leading-[0.82] tracking-tight">
              Timotej
              <br />
              <span className="text-stroke">Medved</span>
            </h1>
            <span className="mt-8 block h-[2px] w-24 bg-accent" />
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-soft">
              Gradim digitalne rešitve, ki rešujejo prave probleme. Arhitektura, koda in produkt, od ideje do
              zadnjega deploya.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-sm md:max-w-none">
            <div className="absolute -inset-3 -z-0 border border-accent/40 sm:-inset-5" />
            <Image
              src="/images/portrait.webp"
              alt="Portret Timoteja Medveda"
              width={1493}
              height={2000}
              priority
              sizes="(max-width: 768px) 90vw, 480px"
              className="relative w-full mix-blend-multiply"
            />
          </div>
        </section>

        <section id="o-meni" className="grid gap-10 border-t border-ink/10 py-20 md:grid-cols-[1fr_1.4fr]">
          <h2 className="font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">O meni</h2>
          <div className="flex flex-col gap-8">
            <p className="text-xl leading-relaxed">
              Sem programer in ustanovitelj. Rad imam sisteme, ki so preprosti na zunaj in premišljeni znotraj. Najraje
              delam na produktih, kjer je koda samo orodje, rezultat pa nekaj, kar ljudje res uporabljajo.
            </p>
            <ul className="flex flex-col">
              {PILLARS.map((p) => (
                <li
                  key={p}
                  className="border-b border-ink/10 py-4 text-sm font-semibold uppercase tracking-[0.2em] last:border-0"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="vrednote" className="border-t border-ink/10 py-20">
          <h2 className="font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">Vrednote</h2>
          <div className="mt-12 grid gap-px overflow-hidden bg-ink/10 sm:grid-cols-2 xl:grid-cols-5">
            {VALUES.map((v) => (
              <div key={v.title} className="flex flex-col gap-4 bg-paper p-6">
                <Icon d={v.icon} />
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.15em]">{v.title}</p>
                  <p className="mt-1 text-ink-soft">{v.line}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20">
          <div className="border border-accent px-6 py-12 sm:px-12 sm:py-16">
            <span className="block h-[2px] w-10 bg-accent" />
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.35em] text-ink-soft">Moto</p>
            <p className="mt-4 font-display text-[clamp(2.75rem,9vw,6rem)] font-extrabold uppercase leading-[0.9]">
              Disciplina danes.
              <br />
              <span className="text-accent">Svoboda jutri.</span>
            </p>
          </div>
        </section>

        <section id="kontakt" className="grid gap-10 border-t border-ink/10 py-20 md:grid-cols-[1fr_1.4fr]">
          <h2 className="font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">Kontakt</h2>
          <div className="flex flex-col gap-6">
            <p className="text-xl leading-relaxed">Imaš projekt, idejo ali samo vprašanje? Piši mi.</p>
            <div className="flex flex-wrap gap-3">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 border border-ink px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-paper"
                >
                  {l.label}
                  <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl items-end justify-between px-4 pb-8 pt-4 text-xs uppercase tracking-[0.3em] text-ink-soft sm:px-8">
        <span>© Timotej Medved</span>
        <span className="text-right leading-relaxed">
          Code · Design
          <br />
          Impact · Future
        </span>
      </footer>
    </div>
  );
}
