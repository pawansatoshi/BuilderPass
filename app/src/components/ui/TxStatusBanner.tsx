import type { TxFlowStatus } from "../../hooks/useContractWriteFlow";
import { explorerTxUrl } from "../../lib/explorer";

interface TxStatusBannerProps {
  status: TxFlowStatus;
  error?: string | null;
  hash?: `0x${string}`;
  pendingLabel: string;
}

/**
 * Renders nothing at rest (`idle`) or on `success` — both current callers
 * (MintForm, EditProfileForm) intercept `success` earlier and render
 * `TxReceiptSummary` instead, which shows far more than a one-line banner
 * could. This component only ever needs to cover signing/mining/error.
 */
export function TxStatusBanner({
  status,
  error,
  hash,
  pendingLabel,
}: TxStatusBannerProps) {
  if (status === "idle" || status === "success") return null;

  const explorerUrl = hash ? explorerTxUrl(hash) : undefined;

  if (status === "error") {
    return (
      <div
        role="alert"
        className="rounded-sm border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger"
      >
        {error ?? "Something went wrong. Please try again."}
      </div>
    );
  }

  // signing | mining
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-sm border border-line bg-white px-4 py-3 text-sm text-ink">
      <span
        className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-brass"
        aria-hidden="true"
      />
      <span>
        {status === "signing" ? "Confirm in your wallet…" : pendingLabel}
      </span>
      {explorerUrl && status === "mining" && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto underline text-slate"
        >
          View on explorer
        </a>
      )}
    </div>
  );
}
