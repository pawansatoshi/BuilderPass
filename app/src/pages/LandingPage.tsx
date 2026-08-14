import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "../components/ui/Button";
import { useHasMinted, useTotalSupply } from "../hooks/useBuilderPassport";
import { BuilderPortfolio } from "../components/BuilderPortfolio";
import { AnimatedBuilderFlow } from "../components/AnimatedBuilderFlow";
import { VoiceGuide } from "../components/VoiceGuide";
import { DemoShowcase } from "../components/DemoShowcase";
import { useLanguage } from "../lib/i18n";

export function LandingPage() {
  const { address, isConnected } = useAccount();
  const hasMintedQuery = useHasMinted(address);
  const totalSupplyQuery = useTotalSupply();
  const { t } = useLanguage();

  return (
    <div className="space-y-10">
      <section className="hero-glow relative overflow-hidden rounded-md border border-line bg-paper px-5 py-8 text-center sm:px-8 sm:py-12">
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />
        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate">
            <span className="rounded-full border border-line bg-white px-3 py-1">🇮🇳 {t.builtIndia}</span>
            <span className="rounded-full border border-line bg-white px-3 py-1">🇰🇷 GIWA ecosystem</span>
            <span className="rounded-full border border-line bg-white px-3 py-1">🌍 {t.forGlobal}</span>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass-700">GIWA Sepolia · GASOK Builder Program</p>
          <div className="mx-auto max-w-4xl">
            <h1 className="hero-title font-display text-4xl font-semibold text-ink sm:text-6xl">{t.title}</h1>
            <div className="mx-auto mt-4 h-px w-24 bg-brass-500/70" />
          </div>
          <p className="mx-auto max-w-2xl text-base leading-7 text-slate sm:text-lg">{t.subtitle}</p>
          <VoiceGuide />
          <div className="mx-auto grid max-w-3xl gap-3 text-left sm:grid-cols-3">
            <div className="hero-card border border-line bg-white p-4"><p className="font-mono text-[10px] uppercase tracking-wide text-brass-700">{t.problem}</p><p className="mt-2 text-sm text-slate">Builder identity is fragmented across wallets, GitHub, social profiles and programs.</p></div>
            <div className="hero-card border border-line bg-white p-4"><p className="font-mono text-[10px] uppercase tracking-wide text-brass-700">{t.primitive}</p><p className="mt-2 text-sm text-slate">A soulbound passport anchors core builder metadata directly to an on-chain identity.</p></div>
            <div className="hero-card border border-line bg-white p-4"><p className="font-mono text-[10px] uppercase tracking-wide text-brass-700">{t.proof}</p><p className="mt-2 text-sm text-slate">Wallet, contract, passport and transaction evidence can be independently verified.</p></div>
          </div>
          {totalSupplyQuery.data !== undefined && totalSupplyQuery.data > 0n && <p className="font-mono text-xs text-slate">{totalSupplyQuery.data.toString()} builder{totalSupplyQuery.data === 1n ? "" : "s"} minted so far</p>}
          <div className="flex flex-wrap justify-center gap-3">
            {!isConnected && <ConnectButton />}
            <Link to="/technical"><Button variant="secondary">{t.technical}</Button></Link>
            <Link to="/resources"><Button variant="secondary">{t.explore}</Button></Link>
          </div>
          {isConnected && hasMintedQuery.isLoading && <p className="text-slate">Checking your wallet…</p>}
          {isConnected && hasMintedQuery.data === true && address && <div className="flex justify-center"><Link to={`/profile/${address}`}><Button>View your Builder Passport</Button></Link></div>}
          {isConnected && hasMintedQuery.data === false && <div className="flex justify-center"><Link to="/mint"><Button>Mint your Builder Passport</Button></Link></div>}
        </div>
      </section>

      <section className="rounded-lg border border-brass-500/25 bg-brass-500/5 p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass-700">GIWA ecosystem fit</p><h2 className="mt-1 font-display text-2xl font-semibold">{t.ecosystem}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate">BuilderPass is a reusable identity primitive designed for ecosystem discovery, future wallet surfaces and machine-readable builder evidence.</p></div>
          <Link to="/technical" className="shrink-0 rounded-full border border-ink/15 bg-white px-4 py-2 text-center font-mono text-[10px] uppercase tracking-wide text-ink shadow-sm hover:-translate-y-0.5">Explore fit →</Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="border border-line bg-white p-4"><p className="font-mono text-[10px] text-brass-700">GIWA NATIVE</p><p className="mt-1 text-sm font-semibold">Deployed on GIWA Sepolia</p></div><div className="border border-line bg-white p-4"><p className="font-mono text-[10px] text-brass-700">WALLET READY</p><p className="mt-1 text-sm font-semibold">Designed for portable identity surfaces</p></div><div className="border border-line bg-white p-4"><p className="font-mono text-[10px] text-brass-700">AGENT READY</p><p className="mt-1 text-sm font-semibold">Evidence structured for future applications</p></div></div>
      </section>

      <AnimatedBuilderFlow />

      <section className="rounded-md border border-line bg-ink p-6 text-paper">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">Design principle</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Evidence before reputation.</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-paper/70">BuilderPass does not manufacture a subjective score. The foundation is verifiable identity; future attestations can connect skills, projects, deployments and contributions to that identity.</p>
      </section>

      <DemoShowcase />
      <BuilderPortfolio />

      <section className="border-t border-line pt-8 text-left">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass-700">Future direction</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink">Identity → Credentials → Reputation → Builder Graph → Agents</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate">The long-term model makes builder evidence machine-readable for ecosystems, applications and eventually autonomous agents, without turning the passport into an opaque scoring system.</p>
      </section>
    </div>
  );
}
