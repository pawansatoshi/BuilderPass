import type { Address } from "viem";
import {
  explorerAddressUrl,
  explorerContractTransactionsUrl,
  explorerTokenInstanceUrl,
} from "../lib/explorer";
import { BUILDER_PASSPORT_ADDRESS } from "../lib/contract";

interface ExplorerLinksProps {
  walletAddress: Address;
  tokenId?: bigint;
}

function ExplorerLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:border-ink/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {children}
    </a>
  );
}

/**
 * Quick links to the official GIWA Sepolia Blockscout explorer. Deliberately
 * just links — no backend/indexer, no Blockscout API calls beyond what a
 * plain hyperlink needs, per the "don't build an indexer" scope decision.
 */
export function ExplorerLinks({ walletAddress, tokenId }: ExplorerLinksProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <ExplorerLink href={explorerAddressUrl(walletAddress)}>
        View Wallet
      </ExplorerLink>
      <ExplorerLink href={explorerAddressUrl(BUILDER_PASSPORT_ADDRESS)}>
        View Contract
      </ExplorerLink>
      <ExplorerLink href={explorerContractTransactionsUrl(BUILDER_PASSPORT_ADDRESS)}>
        View Transactions
      </ExplorerLink>
      {tokenId !== undefined && (
        <ExplorerLink
          href={explorerTokenInstanceUrl(BUILDER_PASSPORT_ADDRESS, tokenId)}
        >
          View Token
        </ExplorerLink>
      )}
    </div>
  );
}
