import { CopyButton } from "../components/ui/CopyButton";
import { BUILDER_PASSPORT_ADDRESS } from "../lib/contract";
import { giwaSepolia } from "../lib/chains";

interface ResourceLinkProps {
  label: string;
  href: string;
  description: string;
}

function ResourceLink({ label, href, description }: ResourceLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-0.5 rounded-sm border border-line bg-white px-4 py-3 hover:border-ink/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <span className="font-display text-sm font-semibold text-ink">
        {label}
      </span>
      <span className="text-xs text-slate">{description}</span>
    </a>
  );
}

function InfoRow({
  label,
  value,
  copyValue,
}: {
  label: string;
  value: string;
  copyValue?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-line py-2.5 last:border-0">
      <span className="text-sm text-slate">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-ink">{value}</span>
        {copyValue && <CopyButton value={copyValue} label={label} />}
      </div>
    </div>
  );
}

/**
 * Developer Resources — every official link here was verified directly
 * against docs.giwa.io, giwa.io/gasok, and github.com/giwa-io during this
 * project's audit passes, not carried over from memory. Official X
 * (x.com/GIWA_by_Upbit) and the giwa.io homepage were supplied directly by
 * the project owner in this session; every other link was independently
 * checked. Official and community resources are kept in visually distinct
 * sections — never mixed — so nobody mistakes one for the other.
 */
export function DeveloperResourcesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Developer Resources
        </h1>
        <p className="text-slate">
          Everything you need to build on GIWA, verified against official
          sources.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-ink">
          Official
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ResourceLink
            label="Official Website"
            href="https://giwa.io"
            description="giwa.io — GIWA's main site"
          />
          <ResourceLink
            label="Official Docs"
            href="https://docs.giwa.io/giwa-chain/en"
            description="Full GIWA chain documentation"
          />
          <ResourceLink
            label="GIWA Playground"
            href="https://sepolia-playground.giwa.io/"
            description="Official issuance/testing playground"
          />
          <ResourceLink
            label="Blockscout Explorer"
            href="https://sepolia-explorer.giwa.io"
            description="Official GIWA Sepolia block explorer"
          />
          <ResourceLink
            label="GIWA Faucet"
            href="https://faucet.giwa.io/"
            description="0.005 ETH / 24h — official first-party faucet"
          />
          <ResourceLink
            label="GASOK Builder Program"
            href="https://giwa.io/gasok"
            description="Official builder grant/incubation program"
          />
          <ResourceLink
            label="Official GitHub"
            href="https://github.com/giwa-io"
            description="giwa-io org — node, faucet, chain-operations repos"
          />
          <ResourceLink
            label="Official X"
            href="https://x.com/GIWA_by_Upbit"
            description="GIWA's official X (Twitter) account"
          />
        </div>

        <div className="rounded-sm border border-line bg-white px-4 py-1">
          <InfoRow
            label="Chain ID"
            value={giwaSepolia.id.toString()}
            copyValue={giwaSepolia.id.toString()}
          />
          <InfoRow
            label="RPC URL"
            value="sepolia-rpc.giwa.io"
            copyValue={giwaSepolia.rpcUrls.default.http[0]}
          />
          <InfoRow label="Native Currency" value="ETH" />
          <InfoRow
            label="Explorer"
            value="sepolia-explorer.giwa.io"
            copyValue={giwaSepolia.blockExplorers.default.url}
          />
          <InfoRow
            label="Contract Address"
            value={`${BUILDER_PASSPORT_ADDRESS.slice(0, 10)}…`}
            copyValue={BUILDER_PASSPORT_ADDRESS}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-ink">
          Community
        </h2>
        <p className="text-xs text-slate">
          Third-party tools, not operated by GIWA/Dunamu. Use your own
          judgment.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ResourceLink
            label="Nodit Faucet"
            href="https://faucet.lambda256.io/giwa-sepolia"
            description="0.01 ETH / 24h — listed directly on GIWA's official faucet page, operated by Nodit/Lambda256"
          />
          <ResourceLink
            label="Faucet.Trade"
            href="https://faucet.trade/giwa-sepolia-eth-faucet"
            description="Independent multi-chain faucet aggregator"
          />
        </div>
      </section>
    </div>
  );
}
