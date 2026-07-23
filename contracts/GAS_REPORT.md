# Gas Report — BuilderPassport.sol

## How this was produced

The three tests in `test/BuilderPassport.ts` under **"Gas measurements"** call
`publicClient.waitForTransactionReceipt({ hash })` after each `mint()` /
`updateProfile()` call and read `receipt.gasUsed` directly — this is measured
execution gas from Hardhat's simulated EDR network, not a guess.

**Important caveat for this delivery:** this sandbox has no network access, so
`npm install` (and therefore `npx hardhat test`) has not actually been run
here. The numbers below are not fabricated results — they're the *expected
range*, derived from the same EVM cost model used in the design doc (SSTORE
costs, string/array storage mechanics) applied to this specific, now-written
implementation. **Run `npm run test:coverage` (or `npx hardhat test`)
yourself locally to get the real, measured numbers** — the tests print
`console.log` lines with the actual `gasUsed` for each case, and the test
assertions (`gasUsed < 350_000n` etc.) will fail loudly if reality diverges
meaningfully from this projection.

## Expected results

| Test case | Design doc estimate | Expected measured range | Assertion bound in test |
|---|---|---|---|
| `mint()` — typical profile (short name/bio, 3 skills, all handles set) | ~180,000–220,000 | ~190,000–230,000 | `< 350,000` |
| `mint()` — all fields at max length, all 5 skills filled | ~230,000–280,000 | ~260,000–320,000 | `< 450,000` |
| `updateProfile()` — typical edit, similar field lengths | ~60,000–110,000 | ~70,000–120,000 | `< 250,000` |

The assertion bounds in the test file are deliberately looser than the
design's point estimates — they're regression guards against something going
seriously wrong (e.g. an accidental extra SSTORE, a loop, a missed
optimization), not an assertion that the design's estimate was exact to the
gas. Solidity 0.8.30's optimizer, the exact OpenZeppelin v5 patch version
resolved by `npm install`, and calldata size all shift real numbers by a few
percent either way — expected and fine.

## What to check once you run it for real

1. `npm install` at the repo root (resolves workspaces for `app` and
   `contracts`).
2. `npm run contracts:compile` (or `cd contracts && npm run compile`).
3. `npm run contracts:test` (or `cd contracts && npm test`) — runs the full
   suite, including the gas-measurement tests, and prints `⛽` lines to the
   console with real `gasUsed` values.
4. `cd contracts && npm run test:coverage` — generates a Markdown coverage
   summary in the terminal plus LCOV/HTML reports under `contracts/coverage/`.
   Confirm this hits ≥95% line/branch coverage on `BuilderPassport.sol`; the
   test suite is written to exercise every revert branch (`AlreadyMinted`,
   both `PassportDoesNotExist` call sites, `NotPassportOwner` is structurally
   unreachable — see note below —, all five field-length errors on both
   `mint()` and `updateProfile()`, both soulbound paths in `_update`, and both
   overridden `approve`/`setApprovalForAll` reverts).

## Coverage note: `NotPassportOwner` is intentionally unreachable

`updateProfile()`'s `ownerOf(tokenId) != msg.sender` check (which would revert
`NotPassportOwner`) can never actually fire given the contract's other
guarantees: `_tokenIdOf[msg.sender]` only ever points to a tokenId that
`msg.sender` still owns, since transfers are blocked entirely by the soulbound
`_update` override. This is *why* the design doc called it "defense-in-depth"
rather than a load-bearing check. A coverage tool will correctly flag this
branch as unreached — that's expected and fine, not a gap to chase; forcing it
reachable would mean weakening the soulbound guarantee that makes it
unreachable in the first place. If your coverage tool's ≥95% target is line-
based rather than branch-based, this one unreachable line is the only
expected shortfall in an otherwise fully-covered contract.
