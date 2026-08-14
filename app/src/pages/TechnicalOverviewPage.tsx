import { Link } from "react-router-dom";
import { BUILDER_PASSPORT_ADDRESS } from "../lib/contract";
import { useLanguage } from "../lib/i18n";

const EXPLORER = `https://sepolia-explorer.giwa.io/address/${BUILDER_PASSPORT_ADDRESS}`;
const TX = "https://sepolia-explorer.giwa.io/tx/0xd259a13743cbc2a4935f58a58a153a65711357025a9232c5f48f3706cdd96142";

const steps = [
  ["01", "Wallet", "A builder controls the identity anchor."],
  ["02", "Passport", "A soulbound passport records core profile data on-chain."],
  ["03", "Evidence", "Skills, projects and contribution proofs can attach to the identity."],
  ["04", "Builder Graph", "Evidence can become a portable, machine-readable relationship layer."],
  ["05", "Agents", "Future applications and autonomous agents can consume verifiable capabilities."],
];

export function TechnicalOverviewPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <section className="rounded-lg border border-line bg-ink px-5 py-8 text-paper sm:px-8 sm:py-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brass-300">Architecture · verification · ecosystem fit</p>
        <h1 className="mt-2 max-w-3xl font-display text-3xl font-semibold sm:text-5xl">{t.overview}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-paper/70 sm:text-base">A concise technical path through BuilderPass: what it solves, why it is native to GIWA, how the contract is verified, and where the identity primitive can evolve.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link to="/" className="rounded-full bg-paper px-4 py-2 font-mono text-[10px] uppercase tracking-wide text-ink">Try the product</Link>
          <a href={EXPLORER} target="_blank" rel="noopener noreferrer" className="rounded-full border border-paper/20 px-4 py-2 font-mono text-[10px] uppercase tracking-wide text-paper hover:bg-paper/10">Verify contract ↗</a>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-line bg-white p-5"><p className="font-mono text-[10px] uppercase tracking-wide text-brass-700">Problem</p><h2 className="mt-2 font-display text-xl font-semibold">Identity is fragmented.</h2><p className="mt-2 text-sm leading-6 text-slate">Wallets prove control, while projects, skills and contributions live across disconnected platforms.</p></div>
        <div className="rounded-md border border-line bg-white p-5"><p className="font-mono text-[10px] uppercase tracking-wide text-brass-700">Primitive</p><h2 className="mt-2 font-display text-xl font-semibold">Identity is portable.</h2><p className="mt-2 text-sm leading-6 text-slate">A soulbound passport creates a durable on-chain anchor that applications can reference.</p></div>
        <div className="rounded-md border border-line bg-white p-5"><p className="font-mono text-[10px] uppercase tracking-wide text-brass-700">Proof</p><h2 className="mt-2 font-display text-xl font-semibold">Evidence is inspectable.</h2><p className="mt-2 text-sm leading-6 text-slate">Contract state and transactions can be checked independently on GIWA Sepolia.</p></div>
      </section>

      <section className="rounded-lg border border-line bg-white p-5 sm:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass-700">Architecture</p><h2 className="mt-1 font-display text-2xl font-semibold">Identity → evidence → builder graph</h2></div><span className="font-mono text-[10px] uppercase tracking-wide text-slate">on-chain foundation</span></div>
        <div className="mt-7 grid gap-3 sm:grid-cols-5 sm:gap-2">
          {steps.map(([number, title, description]) => <div key={number} className="relative border border-line bg-paper p-4"><span className="font-mono text-[10px] text-brass-700">{number}</span><h3 className="mt-2 font-display text-lg font-semibold">{title}</h3><p className="mt-2 text-xs leading-5 text-slate">{description}</p></div>)}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-line bg-white p-5 sm:p-7"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass-700">Live proof</p><h2 className="mt-1 font-display text-2xl font-semibold">Deployed on GIWA Sepolia</h2><div className="mt-5 space-y-3 font-mono text-xs"><div className="flex justify-between gap-4 border-b border-line pb-3"><span className="text-slate">Chain ID</span><span>91342</span></div><div className="flex justify-between gap-4 border-b border-line pb-3"><span className="text-slate">Contract</span><span className="max-w-[65%] break-all text-right">{BUILDER_PASSPORT_ADDRESS}</span></div><div className="flex justify-between gap-4"><span className="text-slate">Status</span><span className="text-emerald-700">● deployed</span></div></div><div className="mt-5 flex flex-wrap gap-2"><a href={EXPLORER} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ink px-4 py-2 text-[10px] uppercase tracking-wide text-paper">Blockscout ↗</a><a href={TX} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-4 py-2 text-[10px] uppercase tracking-wide text-ink">Deployment tx ↗</a></div></div>
        <div className="rounded-lg border border-line bg-white p-5 sm:p-7"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass-700">Design decisions</p><div className="mt-4 space-y-4 text-sm"><div><strong>Soulbound.</strong><p className="mt-1 text-slate">The passport is identity infrastructure, not a transferable speculative asset.</p></div><div><strong>Evidence before reputation.</strong><p className="mt-1 text-slate">No arbitrary score is assigned. Future attestations can supply evidence.</p></div><div><strong>Minimal trust.</strong><p className="mt-1 text-slate">The core identity anchor is wallet-controlled and independently inspectable.</p></div><div><strong>Extensible.</strong><p className="mt-1 text-slate">Credentials and builder relationships can be layered without replacing the identity primitive.</p></div></div></div>
      </section>

      <section className="rounded-lg border border-brass-500/30 bg-brass-500/5 p-5 sm:p-7"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass-700">GIWA ecosystem fit</p><h2 className="mt-1 font-display text-2xl font-semibold">Built for the network, not merely deployed on it.</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-slate">GASOK explicitly evaluates GIWA chain fit and the potential to be naturally integrated into GIWA Wallet. BuilderPass is designed around that direction: a reusable builder identity primitive that could surface through wallet experiences and connect builders to ecosystem applications.</p><div className="mt-5 grid gap-3 sm:grid-cols-3"><a href="https://giwa.io/gasok" target="_blank" rel="noopener noreferrer" className="border border-line bg-white p-4 transition hover:-translate-y-0.5"><p className="font-mono text-[10px] uppercase text-brass-700">GASOK</p><p className="mt-1 font-display font-semibold">Builder program ↗</p><p className="mt-1 text-xs text-slate">Official program and ecosystem context.</p></a><a href="https://giwa.io/home" target="_blank" rel="noopener noreferrer" className="border border-line bg-white p-4 transition hover:-translate-y-0.5"><p className="font-mono text-[10px] uppercase text-brass-700">GIWA</p><p className="mt-1 font-display font-semibold">Network vision ↗</p><p className="mt-1 text-xs text-slate">GIWA chain, wallet and ecosystem infrastructure.</p></a><a href="https://sepolia-playground.giwa.io/" target="_blank" rel="noopener noreferrer" className="border border-line bg-white p-4 transition hover:-translate-y-0.5"><p className="font-mono text-[10px] uppercase text-brass-700">PLAYGROUND</p><p className="mt-1 font-display font-semibold">Try GIWA ↗</p><p className="mt-1 text-xs text-slate">Official GIWA Sepolia testing environment.</p></a></div><p className="mt-4 font-mono text-[10px] leading-5 text-slate">Note: BuilderPass is not claiming an Upbit partnership or endorsement. GIWA's official site describes GIWA as powered by Upbit; any future integration would require official ecosystem approval.</p></section>

      <section className="rounded-lg border border-line bg-ink p-6 text-paper sm:p-8"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">Future direction</p><h2 className="mt-2 font-display text-2xl font-semibold">Credentials → reputation → builder graph → agents</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-paper/70">The goal is not to force AI into the contract. The goal is to make builder evidence structured enough that future applications and autonomous agents can discover verifiable capabilities without relying on opaque reputation claims.</p></section>
    </div>
  );
}
