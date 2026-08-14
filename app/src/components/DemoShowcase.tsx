import { useState } from "react";
import { useLanguage } from "../lib/i18n";

const VIDEO_ID = "1FeeqEIcfU4";
const VIDEO_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;
const CHANNEL_URL = "https://youtube.com/@PawanSatoshi";

export function DemoShowcase() {
  const [playing, setPlaying] = useState(false);
  const { t } = useLanguage();

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass-700">Product walkthrough</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink">{t.video}</h2>
        </div>
        <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-slate shadow-sm transition hover:-translate-y-0.5 hover:text-ink">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#FF0000] text-[9px] font-bold text-white" aria-hidden="true">▶</span>
          {t.channel}
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="group relative overflow-hidden rounded-lg border border-line bg-ink shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
        <div className="relative aspect-video w-full">
          {playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="GIWA Builder Passport technical demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button type="button" onClick={() => setPlaying(true)} className="absolute inset-0 h-full w-full text-left" aria-label="Play BuilderPass demo video">
              <img src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`} alt="GIWA Builder Passport demo" className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-100" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" aria-hidden="true" />
              <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-2xl transition duration-200 group-hover:scale-110">
                <span className="ml-1 text-xl" aria-hidden="true">▶</span>
              </span>
              <span className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
                <span>
                  <span className="block font-display text-lg font-semibold">GIWA Builder Passport</span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-white/70">Technical walkthrough · YouTube</span>
                </span>
                <span className="hidden rounded-full border border-white/20 bg-black/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide backdrop-blur sm:block">{t.watch}</span>
              </span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/20 px-4 py-3">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            {t.live}
          </div>
          <a href={VIDEO_URL} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] uppercase tracking-wide text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">Open on YouTube ↗</a>
        </div>

        <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="absolute right-3 top-3 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-2.5 py-1.5 text-white shadow-lg backdrop-blur-md transition hover:bg-black/65" aria-label="Visit Pawan Satoshi YouTube channel">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#FF0000] text-[8px] font-bold" aria-hidden="true">▶</span>
          <span className="hidden font-mono text-[9px] uppercase tracking-wide sm:inline">Pawan Satoshi</span>
        </a>
      </div>
    </section>
  );
}
