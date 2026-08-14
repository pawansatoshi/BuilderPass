import { Link } from "react-router-dom";
import { CopyButton } from "../components/ui/CopyButton";
import { BUILDER_PASSPORT_ADDRESS } from "../lib/contract";
import { giwaSepolia } from "../lib/chains";

interface ResourceLinkProps {
  label: string;
  href: string;
  description: string;
  featured?: boolean;
}

function ResourceLink({ label, href, description, featured = false }: ResourceLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex min-h-[92px] flex-col justify-between rounded-md border bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
        featured ? "border-brass-500/60 ring-1 ring-brass-500/10" : "border-line"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-display text-sm font-semibold text-ink group-hover:underline group-hover:underline-offset-2">
          {label}
        </span>
        <span aria-hidden="true" className="font-mono text-xs text-slate transition-transform group-hover:translate-x-1">↗</span>
      </div>
      <span className="mt-2 text-xs leading-5 text-slate">{description}</span>
    </a>
  );
}

function InfoRow({ label, value, copyValue }: { label: string; value: string; copyValue?: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-xs text-slate sm:text-sm">{label}</span>
      <div className="flex min-w-0 items-center gap-2">
        <span className="min-w-0 break-all text-right font-mono text-xs text-ink sm:text-sm">{value}</span>
        {copyValue && <CopyButton value={copyValue} label={label} />}
      </div>
    </div>
  );
}

export function DeveloperResourcesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 sm:space-y-10">
      <section className="relative overflow-hidden rounded-lg border border-line bg-ink px-5 py-7 text-paper sm:px-8 sm:py-9">
        <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-brass-500/10 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brass-300">BuilderPass developer hub</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Build on GIWA with confidence.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-paper/70 sm:text-base">
            Official GIWA links, network configuration, explorer proof and BuilderPass contract details — organized so builders and evaluators can find the right resource immediately.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href="https://docs.giwa.io/giwa-chain/en" target="_blank" rel="noopener noreferrer" className="rounded-full bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-ink hover:bg-white">Read GIWA Docs ↗</a>
            <a href={`https://sepolia-explorer.giwa.io/address/${BUILDER_PASSPORT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-paper/20 px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-paper hover:bg-paper/10">Verify Contract ↗</a>
            <Link to="/" className="rounded-full border border-paper/20 px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-paper hover:bg-paper/10">Back to Passport</Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass-700">01 · Official sources</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">GIWA ecosystem</h2>
          <p className="mt-1 text-sm text-slate">First-party links only in this section.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ResourceLink label="Official Website" href="https://giwa.io" description="GIWA's main site" featured />
          <ResourceLink label="Official Docs" href="https://docs.giwa.io/giwa-chain/en" description="Full GIWA chain documentation" featured />
          <ResourceLink label="GIWA Playground" href="https://sepolia-playground.giwa.io/" description="Official issuance and testing playground" />
          <ResourceLink label="Blockscout Explorer" href="https://sepolia-explorer.giwa.io" description="Official GIWA Sepolia block explorer" />
          <ResourceLink label="GIWA Faucet" href="https://faucet.giwa.io/" description="Official first-party Sepolia faucet" />
          <ResourceLink label="GASOK Builder Program" href="https://giwa.io/gasok" description="Official builder grant and incubation program" featured />
          <ResourceLink label="Official GitHub" href="https://github.com/giwa-io" description="GIWA's official GitHub organization" />
          <ResourceLink label="Official X" href="https://x.com/GIWA_by_Upbit" description="GIWA's official X account" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass-700">02 · Network</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-ink">GIWA Sepolia configuration</h2>
          </div>
          <div className="rounded-md border border-line bg-white px-4">
            <InfoRow label="Chain ID" value={giwaSepolia.id.toString()} copyValue={giwaSepolia.id.toString()} />
            <InfoRow label="RPC URL" value={giwaSepolia.rpcUrls.default.http[0]} copyValue={giwaSepolia.rpcUrls.default.http[0]} />
            <InfoRow label="Native Currency" value="ETH" />
            <InfoRow label="Explorer" value={giwaSepolia.blockExplorers.default.url} copyValue={giwaSepolia.blockExplorers.default.url} />
            <InfoRow label="BuilderPass Contract" value={BUILDER_PASSPORT_ADDRESS} copyValue={BUILDER_PASSPORT_ADDRESS} />
          </div>
        </div>

        <div className="rounded-md border border-line bg-white p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass-700">03 · Proof</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink">Verify the identity primitive</h2>
          <p className="mt-2 text-sm leading-6 text-slate">The contract and its transactions are independently inspectable on GIWA Sepolia.</p>
          <a href={`https://sepolia-explorer.giwa.io/address/${BUILDER_PASSPORT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="mt-5 block rounded-md bg-ink px-4 py-3 text-center font-mono text-[11px] uppercase tracking-wide text-paper hover:bg-ink/90">Open contract in Blockscout ↗</a>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass-700">04 · Community</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink">Additional tools</h2>
          <p className="mt-1 text-xs text-slate">Third-party tools, not operated by GIWA/Dunamu. Use your own judgment.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-3xl">
          <ResourceLink label="Nodit Faucet" href="https://faucet.lambda256.io/giwa-sepolia" description="Community faucet operated by Nodit/Lambda256" />
          <ResourceLink label="Faucet.Trade" href="https://faucet.trade/giwa-sepolia-eth-faucet" description="Independent multi-chain faucet aggregator" />
        </div>
      </section>

      <section className="rounded-md border border-line bg-white p-5 text-sm text-slate sm:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass-700">For builders & evaluators</p>
        <p className="mt-2 leading-6">Need to verify something quickly? Start with the <strong className="text-ink">official docs</strong>, then inspect the <strong className="text-ink">GIWA Sepolia explorer</strong>, and finally compare the live contract address above with the deployed BuilderPass implementation.</p>
      </section>
    </div>
  );
}
