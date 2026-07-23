import type { Address, TransactionReceipt } from "viem";
import { CopyButton } from "./ui/CopyButton";
import { Button } from "./ui/Button";
import { useBlockTimestamp } from "../hooks/useBlockTimestamp";
import { formatAddress, formatTimestamp } from "../lib/format";
import { explorerAddressUrl, explorerTxUrl } from "../lib/explorer";
import { BUILDER_PASSPORT_ADDRESS } from "../lib/contract";

interface TxReceiptSummaryProps {
  receipt: TransactionReceipt;
  walletAddress: Address;
  onShare?: () => void;
  continueLabel: string;
  onContinue: () => void;
}

/**
 * Replaces a bare "Success" message after mint/update with the detail a
 * builder actually wants to see and share: hash, block, timestamp, gas
 * used, explorer link, both relevant addresses with one-tap copy, and a
 * share action. Navigation onward (e.g. to the profile page) is an
 * explicit button tap here rather than an automatic redirect, so there's
 * time to actually read/copy this before moving on.
 */
export function TxReceiptSummary({
  receipt,
  walletAddress,
  onShare,
  continueLabel,
  onContinue,
}: TxReceiptSummaryProps) {
  const blockQuery = useBlockTimestamp(receipt.blockNumber);

  return (
    <div className="space-y-4 rounded-sm border border-success/40 bg-success/5 p-4">
      <p className="text-sm font-semibold text-success">✅ Success</p>

      <dl className="grid grid-cols-1 gap-x-4 gap-y-2 font-mono text-xs text-ink sm:grid-cols-2">
        <div>
          <dt className="text-slate">Transaction Hash</dt>
          <dd className="flex items-center gap-2">
            <span>{formatAddress(receipt.transactionHash)}</span>
            <CopyButton value={receipt.transactionHash} label="hash" />
          </dd>
        </div>
        <div>
          <dt className="text-slate">Block Number</dt>
          <dd>{receipt.blockNumber.toString()}</dd>
        </div>
        <div>
          <dt className="text-slate">Timestamp</dt>
          <dd>
            {blockQuery.data
              ? formatTimestamp(blockQuery.data.timestamp)
              : "Loading…"}
          </dd>
        </div>
        <div>
          <dt className="text-slate">Gas Used</dt>
          <dd>{receipt.gasUsed.toString()}</dd>
        </div>
        <div>
          <dt className="text-slate">Contract Address</dt>
          <dd className="flex items-center gap-2">
            <span>{formatAddress(BUILDER_PASSPORT_ADDRESS)}</span>
            <CopyButton value={BUILDER_PASSPORT_ADDRESS} label="contract" />
          </dd>
        </div>
        <div>
          <dt className="text-slate">Wallet Address</dt>
          <dd className="flex items-center gap-2">
            <span>{formatAddress(walletAddress)}</span>
            <CopyButton value={walletAddress} label="wallet" />
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2 border-t border-success/30 pt-3">
        <a
          href={explorerTxUrl(receipt.transactionHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:border-ink/40"
        >
          Explorer Link
        </a>
        <a
          href={explorerAddressUrl(BUILDER_PASSPORT_ADDRESS)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:border-ink/40"
        >
          View Contract
        </a>
        {onShare && (
          <button
            type="button"
            onClick={onShare}
            className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:border-ink/40"
          >
            Share Profile
          </button>
        )}
      </div>

      <Button onClick={onContinue}>{continueLabel}</Button>
    </div>
  );
}
