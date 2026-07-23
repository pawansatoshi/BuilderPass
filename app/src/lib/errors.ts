import { BaseError, ContractFunctionRevertedError } from "viem";
import { LIMITS } from "./limits";

/**
 * Maps this contract's custom error names to plain-language copy. Anything
 * not in this list falls back to viem's own `shortMessage`, which is
 * usually readable enough (e.g. "User rejected the request").
 */
const FRIENDLY_MESSAGES: Record<string, string> = {
  AlreadyMinted:
    "This wallet has already minted a Builder Passport — it's one per wallet, permanently.",
  PassportDoesNotExist: "This wallet hasn't minted a Builder Passport yet.",
  NotPassportOwner: "Only the passport's original owner can update it.",
  NameTooLong: `Name is too long (max ${LIMITS.name} characters).`,
  BioTooLong: `Bio is too long (max ${LIMITS.bio} characters).`,
  GithubTooLong: `GitHub handle is too long (max ${LIMITS.handle} characters).`,
  XTooLong: `X handle is too long (max ${LIMITS.handle} characters).`,
  WebsiteTooLong: `Website URL is too long (max ${LIMITS.website} characters).`,
  SoulboundTokenNonTransferable:
    "Builder Passports are soulbound and can't be transferred or approved.",
};

/**
 * Extracts a plain-language message from a wagmi/viem contract-call error.
 * Walks viem's error cause chain to find a decoded custom-error revert
 * (`ContractFunctionRevertedError`) and maps it to friendly copy where one
 * exists; otherwise falls back to viem's `shortMessage`, then the raw error
 * message, then a generic fallback.
 */
export function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof BaseError) {
    const revertError = error.walk(
      (e) => e instanceof ContractFunctionRevertedError
    );
    if (revertError instanceof ContractFunctionRevertedError) {
      const errorName = revertError.data?.errorName;
      if (errorName && FRIENDLY_MESSAGES[errorName]) {
        return FRIENDLY_MESSAGES[errorName];
      }
      if (errorName) return `Transaction reverted: ${errorName}`;
    }
    return error.shortMessage ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
