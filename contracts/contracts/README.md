# Contracts

`BuilderPassport.sol` implements the Milestone 2 design exactly as reviewed and
approved in `BuilderPassport.design.md` (kept alongside for reference — UML,
storage layout, event flow, state diagram, gas estimates, and the 14-point
attack-vector review all still apply to this implementation).

- Solidity `0.8.30`, OpenZeppelin Contracts `v5.x`.
- Soulbound ERC-721 — one passport per wallet, non-transferable, non-approvable.
- Fully on-chain, owner-editable profile data (`BuilderPassportData` struct),
  versioned via `CURRENT_DATA_VERSION`.
- `CONTRACT_VERSION = "1.0.0"` — informational only, not used in on-chain logic.
- No burn function, no `Ownable`/admin role, no pause switch — by design.

See `../test/BuilderPassport.ts` for the full test suite and
`../GAS_REPORT.md` for gas measurements against the design's estimates.
