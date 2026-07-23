/**
 * Field-length and skill-count limits, mirrored from `BuilderPassport.sol`'s
 * on-chain constants (`MAX_NAME_LENGTH`, `MAX_BIO_LENGTH`,
 * `MAX_HANDLE_LENGTH`, `MAX_WEBSITE_LENGTH`, `MAX_SKILLS`).
 *
 * These are hardcoded here rather than fetched on-chain on every form load —
 * a deliberate simplicity trade-off for the MVP, since the contract has no
 * admin function that could ever change them post-deploy. If that ever
 * changes, these constants (and the contract's) both need updating together.
 * The contract is still the source of truth and re-validates every field
 * itself — these limits only exist so the form can give instant feedback
 * before a wallet signature is even requested.
 */
export const LIMITS = {
  name: 64,
  bio: 280,
  handle: 64, // github and x share the same cap on-chain
  website: 256,
  maxSkills: 5,
  skillTag: 32, // bytes32 per skill tag
} as const;
