import type { Address } from "viem";
import { BUILDER_PASSPORT_ADDRESS } from "../lib/contract";
import { formatAddress } from "../lib/format";
import { CopyButton } from "./ui/CopyButton";

interface BuilderProofProps {
  owner: Address;
  tokenId?: bigint;
  mintedAt?: bigint;
  updatedAt?: bigint;
}

/** Evaluator-friendly proof trail: wallet → passport contract → on-chain record → explorer. */
export function BuilderProof({ owner, tokenId, mintedAt, updatedAt }: BuilderProofProps) {
  const explorerBase = "https://explorer.giwa.io";

  return (
    <section className="rounded-md border border-line bg-paper p-5">
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass-700">
          Verification layer
        </p>
        <h3 className="font-display text-xl font-semibold text-ink">On-chain proof</h3>
        <p className="mt-1 max-w-2xl text-sm text-slate">
          The passport is anchored to a wallet and contract on GIWA Sepolia. Anyone can
          independently verify the identity record and its transaction history.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["01", "Wallet", formatAddress(owner)],
          ["02", "Passport", tokenId !== undefined ? `#${tokenId.toString()}` : "On-chain token"],
          ["03", "Contract", formatAddress(BUILDER_PASSPORT_ADDRESS)],
          ["04", "Network", "GIWA Sepolia"],
        ].map(([step, label, value]) => (
          <div key={step} className="border border-line bg-white p-3">
            <div className="font-mono text-[10px] text-slate">{step}</div>
            <div className="mt-2 text-xs uppercase tracking-wide text-slate">{label}</div>
            <div className="mt-1 break-all font-mono text-sm text-ink">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate">Contract</p>
          <div className="mt-1 flex items-center gap-2 font-mono text-xs">
            <span>{formatAddress(BUILDER_PASSPORT_ADDRESS)}</span>
            <CopyButton value={BUILDER_PASSPORT_ADDRESS} label="contract" />
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate">Owner</p>
          <div className="mt-1 flex items-center gap-2 font-mono text-xs">
            <span>{formatAddress(owner)}</span>
            <CopyButton value={owner} label="wallet" />
          </div>
        </div>
      </div>

      {(mintedAt !== undefined || updatedAt !== undefined) && (
        <p className="mt-3 font-mono text-[11px] text-slate">
          Lifecycle events are recorded on-chain; mint and update timestamps are read from
          the passport contract rather than inferred from the UI.
        </p>
      )}

      <a
        href={`${explorerBase}/address/${owner}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex text-sm font-medium text-ink underline decoration-brass/50 underline-offset-4"
      >
        Verify wallet activity on the GIWA explorer →
      </a>
    </section>
  );
}
