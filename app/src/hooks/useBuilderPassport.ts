import { useReadContract } from "wagmi";
import type { Address } from "viem";
import { BUILDER_PASSPORT_ADDRESS, BUILDER_PASSPORT_ABI } from "../lib/contract";

const contractConfig = {
  address: BUILDER_PASSPORT_ADDRESS,
  abi: BUILDER_PASSPORT_ABI,
} as const;

/** Whether `address` has already minted a Builder Passport. */
export function useHasMinted(address: Address | undefined) {
  return useReadContract({
    ...contractConfig,
    functionName: "hasMinted",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });
}

/** The tokenId owned by `address`, or `0n` if it has none. */
export function useTokenIdOf(address: Address | undefined) {
  return useReadContract({
    ...contractConfig,
    functionName: "tokenIdOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });
}

/**
 * Full passport data for `address`. Callers should only enable this once
 * they already know (via `useHasMinted`) that a passport exists — calling
 * `getPassportByAddress` for a wallet with none reverts with
 * `PassportDoesNotExist`, which is an expected state, not an error worth
 * surfacing as one. Pass `undefined` to leave the query disabled.
 */
export function usePassportByAddress(address: Address | undefined) {
  return useReadContract({
    ...contractConfig,
    functionName: "getPassportByAddress",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address), retry: false },
  });
}

/** Total number of passports minted so far, across all wallets. */
export function useTotalSupply() {
  return useReadContract({
    ...contractConfig,
    functionName: "totalSupply",
  });
}
