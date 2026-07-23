import type { Address, Hex } from "viem";

/**
 * Official GIWA Sepolia Blockscout explorer, per
 * docs.giwa.io/giwa-chain/en/get-started/connect-to-giwa. Centralized here
 * so no component hardcodes the domain directly — if GIWA ever changes
 * explorer providers, this is the one place to update.
 */
export const EXPLORER_BASE_URL = "https://sepolia-explorer.giwa.io";

export function explorerAddressUrl(address: Address | string): string {
  return `${EXPLORER_BASE_URL}/address/${address}`;
}

export function explorerTxUrl(hash: Hex | string): string {
  return `${EXPLORER_BASE_URL}/tx/${hash}`;
}

/** The contract's own page, deep-linked to its Transactions tab. */
export function explorerContractTransactionsUrl(address: Address | string): string {
  return `${EXPLORER_BASE_URL}/address/${address}?tab=txs`;
}

/**
 * Blockscout's NFT-instance page for a specific tokenId. Note: since
 * BuilderPassport.sol deliberately never sets a `tokenURI` (all data lives
 * in the on-chain struct, not ERC-721 JSON metadata — see the Milestone 2
 * design doc), this page will show the token's existence and owner but no
 * image/metadata preview. That's an accepted, documented trade-off of the
 * fully-on-chain-struct design, not a bug in this link.
 */
export function explorerTokenInstanceUrl(
  contractAddress: Address | string,
  tokenId: bigint | string
): string {
  return `${EXPLORER_BASE_URL}/token/${contractAddress}/instance/${tokenId}`;
}
