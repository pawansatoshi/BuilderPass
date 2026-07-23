import { hexToString, stringToHex, type Hex } from "viem";

/** A `bytes32` slot with no skill in it — matches the contract's default. */
export const EMPTY_SKILL_SLOT: Hex = `0x${"00".repeat(32)}`;

/**
 * Encodes a short skill tag (e.g. "Solidity") into the right-padded
 * `bytes32` the contract expects. Silently truncates anything over 32 ASCII
 * bytes — callers doing form validation should enforce that limit
 * themselves (see `MAX_SKILLS`/field-length constants on the contract) so
 * the truncation is never a surprise to the user.
 */
export function skillTagToBytes32(tag: string): Hex {
  return stringToHex(tag, { size: 32 });
}

/**
 * Decodes a `bytes32` slot back into a readable skill tag. Returns an empty
 * string for an unused slot (`EMPTY_SKILL_SLOT`), matching how the contract
 * represents "no skill here" rather than throwing.
 */
export function skillTagFromBytes32(slot: Hex): string {
  if (slot === EMPTY_SKILL_SLOT) return "";
  // hexToString stops at the first null byte by default, which correctly
  // strips the right-padding stringToHex added.
  return hexToString(slot);
}

/** Builds a full 5-slot `bytes32[5]` array from up to 5 plain skill tags. */
export function skillsToBytes32Array(
  tags: string[]
): readonly [Hex, Hex, Hex, Hex, Hex] {
  const encoded = tags.slice(0, 5).map(skillTagToBytes32);
  while (encoded.length < 5) encoded.push(EMPTY_SKILL_SLOT);
  return encoded as [Hex, Hex, Hex, Hex, Hex];
}

/** Decodes a full 5-slot `bytes32[5]` array, dropping empty slots. */
export function skillsFromBytes32Array(
  slots: readonly [Hex, Hex, Hex, Hex, Hex]
): string[] {
  return slots.map(skillTagFromBytes32).filter((tag) => tag.length > 0);
}
