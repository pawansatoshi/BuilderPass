import type { ContractFunctionReturnType } from "viem";
import { BUILDER_PASSPORT_ABI } from "../lib/contract";

/**
 * The on-chain BuilderPassport struct, derived directly from the deployed
 * ABI's `getPassport` return type rather than hand-written.
 *
 * This replaces an earlier hand-written interface from before the contract
 * existed, which had drifted from reality in two ways once the real ABI
 * arrived: it was missing `updatedAt`, and it typed `skills` as `string[]`
 * when the contract actually stores (and the ABI actually returns)
 * `bytes32[5]` — five fixed hex-encoded slots, not plain strings. Deriving
 * the type from `BUILDER_PASSPORT_ABI` instead of maintaining it by hand
 * means it can't drift again: if the ABI changes, this type updates with it
 * and any mismatched usage becomes a compile error.
 *
 * Field shape (matches on-chain struct order):
 *   version: number        — schema version, see CURRENT_DATA_VERSION
 *   mintedAt: bigint       — unix timestamp (seconds), set once at mint
 *   updatedAt: bigint      — unix timestamp (seconds), refreshed on each update
 *   name, bio, github, x, website: string
 *   skills: readonly [Hex, Hex, Hex, Hex, Hex] — five bytes32 slots, unused
 *     ones are `0x0000...0000`; decode with `skillTagFromBytes32` in
 *     `../lib/skills.ts`.
 */
export type BuilderPassportData = ContractFunctionReturnType<
  typeof BUILDER_PASSPORT_ABI,
  "view",
  "getPassport"
>;
