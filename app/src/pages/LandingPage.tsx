import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "../components/ui/Button";
import { useHasMinted, useTotalSupply } from "../hooks/useBuilderPassport";
import { BuilderPortfolio } from "../components/BuilderPortfolio";
import { AnimatedBuilderFlow } from "../components/AnimatedBuilderFlow";
import { VoiceGuide } from "../components/VoiceGuide";

export function LandingPage() {
  const { address, isConnected } = useAccount();
  const hasMintedQuery = useHasMinted(address);
  const totalSupplyQuery = useTotalSupply();

  return (
    <div className="space-y-10">
      <section className="hero-glow relative overflow-hidden rounded-md border border-line bg-paper px-5 py-8 text-center sm:px-8 sm:py-12">
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />
        <div className="relative z-10 space-y-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass-700">GIWA Sepolia · GASOK Builder Program</p>
          <div className="mx-auto max-w-4xl">
            <h1 className="hero-title font-display text-4xl font-semibold text-ink sm:text-6xl">GIWA Builder Passport</h1>
            <div className="mx-auto mt-4 h-px w-24 bg-brass-500/70" />
          </div>
          <p className="mx-auto max-w-2xl text-base leading-7 text-slate sm:text-lg">A portable, verifiable on-chain identity primitive for builders — connecting identity, skills, projects and contribution proofs into an ecosystem-readable builder profile.</p>
          <VoiceGuide />
          <div className="mx-auto grid max-w-3xl gap-3 text-left sm:grid-cols-3">
            <div className="hero-card border border-line bg-white p-4"><p className="font-mono text-[10px] uppercase tracking-wide text-brass-700">Problem</p><p className="mt-2 text-sm text-slate">Builder identity is fragmented across wallets, GitHub, social profiles and programs.</p></div>
            <div className="hero-card border border-line bg-white p-4"><p className="font-mono text-[10px] uppercase tracking-wide text-brass-700">Primitive</p><p className="mt-2 text-sm text-slate">A soulbound passport anchors core builder metadata directly to an on-chain identity.</p></div>
            <div className="hero-card border border-line bg-white p-4"><p className="font-mono text-[10px] uppercase tracking-wide text-brass-700">Proof</p><p className="mt-2 text-sm text-slate">Wallet, contract, passport and transaction evidence can be independently verified.</p></div>
          </div>
          {totalSupplyQuery.data !== undefined && totalSupplyQuery.data > 0n && <p className="font-mono text-xs text-slate">{totalSupplyQuery.data.toString()} builder{totalSupplyQuery.data === 1n ? "" : "s"} minted so far</p>}
          <div className="flex flex-wrap justify-center gap-3">
            {!isConnected && <ConnectButton />}
            <Link to="/resources"><Button variant="secondary">Explore Developer Resources</Button></Link>
          </div>
          {isConnected && hasMintedQuery.isLoading && <p className="text-slate">Checking your wallet…</p>}
          {isConnected && hasMintedQuery.data === true && address && <div className="flex justify-center"><Link to={`/profile/${address}`}><Button>View your Builder Passport</Button></Link></div>}
          {isConnected && hasMintedQuery.data === false && <div className="flex justify-center"><Link to="/mint"><Button>Mint your Builder Passport</Button></Link></div>}
        </div>
      </section>

      <AnimatedBuilderFlow />

      <section className="rounded-md border border-line bg-ink p-6 text-paper">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">Design principle</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Evidence before reputation.</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-paper/70">BuilderPass does not manufacture a subjective score. The foundation is verifiable identity; future attestations can connect skills, projects, deployments and contributions to that identity.</p>
      </section>

      <BuilderPortfolio />

      <section className="border-t border-line pt-8 text-left">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass-700">Future direction</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink">A builder graph agents can understand.</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate">The long-term model is Identity → Credentials → Reputation → Builder Graph. That makes builder evidence machine-readable for ecosystems, applications and eventually autonomous agents, without turning the passport into an opaque scoring system.</p>
      </section>
    </div>
  );
}
