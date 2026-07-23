# CLAUDE.md — Running Project Memory

This file is the persistent working memory for the GIWA Builder Passport build.
Update it at the end of every milestone.

## Working Environment / Constraints

- **The person works entirely from mobile — no local PC.** Development
  happens via **GitHub Codespaces** (browser-based VS Code, real terminal
  with network access) and deployment via the **Vercel dashboard**. The
  project is packaged so a ZIP upload + `npm install` in a Codespace is
  enough to get running — see `README.md`'s step-by-step mobile workflow.
- Added for this: `.devcontainer/devcontainer.json` (Node 20 image, installs
  on create, forwards Vite's port 5173 with auto-preview, recommends
  ESLint/Tailwind/Solidity VS Code extensions) and a root `vercel.json` (so
  Vercel builds the `app` workspace correctly from a monorepo without needing
  dashboard configuration).
- Practical implication for future milestones: anything needing network
  access (npm install, hardhat verify, actual gas measurement runs, contract
  interaction testing against live GIWA Sepolia) should be written as exact
  copy-pasteable commands for the person to run in their Codespace terminal,
  since neither their device nor this assistant's sandbox can run them
  directly.

## Completed Milestones

- **Discovery phase** — Full product blueprint delivered (vision, PRD, competitive
  analysis, architecture, security review, roadmap). Verified GIWA/GASOK facts via
  live research rather than assuming from training data.
- **Milestone 1 — Scaffold** (this delivery):
  - Two-workspace layout: `app/` (frontend) and `contracts/` (Hardhat).
  - Frontend: Vite + React + TypeScript + Tailwind, routing stubbed
    (`/`, `/mint`, `/profile/:address`, `/edit`).
  - Wagmi + Viem + RainbowKit wired to **GIWA Sepolia only** (chain ID 91342),
    config values sourced live from `docs.giwa.io` on 2026-07-21.
  - Hardhat 3 configured with `giwaSepolia` network + `hardhat-verify` +
    OpenZeppelin dependency, mirroring GIWA's own documented Hardhat setup.
  - No Solidity logic written yet — by design, per Milestone 1 scope.
  - `BuilderPassportData` TS type drafted (with `version` field) as a forward
    reference for the Milestone 2 Solidity struct.

- **Milestone 2 — BuilderPassport.sol** (this delivery):
  - Design phase completed first (UML, storage layout, event-flow sequence
    diagram, state diagram, gas estimates, 14-point attack-vector review) —
    see `contracts/contracts/BuilderPassport.design.md` — approved before any
    code was written.
  - `BuilderPassport.sol` implemented exactly to spec: Solidity 0.8.30,
    OpenZeppelin v5 `ERC721`, soulbound (`_update` override blocks transfers,
    `approve`/`setApprovalForAll` overridden to revert), one passport per
    wallet (`_tokenIdOf` mapping), fully on-chain `BuilderPassportData` struct
    with packed `version`/`mintedAt`/`updatedAt` slot, `bytes32[5]` skills,
    `CONTRACT_VERSION = "1.0.0"` constant, custom errors throughout,
    comprehensive NatSpec on every public/external item.
  - Final field caps: name 64, bio 280, github/x handle 64, **website 256**
    (bumped from the original 128 proposal per your approval).
  - Full Hardhat 3 (`node:test` + viem) test suite in
    `contracts/test/BuilderPassport.ts` covering: deployment/constants, mint
    success + all 5 field-length reverts + duplicate-mint revert + boundary
    (exact-max-length) case + sequential tokenIds across wallets, update
    success + version/mintedAt immutability + all 5 field-length reverts +
    no-passport revert, all 4 soulbound paths (transferFrom, safeTransferFrom,
    approve, setApprovalForAll), view-function edge cases, and 3 dedicated
    gas-measurement tests.
  - `contracts/GAS_REPORT.md` documents measurement methodology and expected
    ranges — flagging that `npm install`/`hardhat test` haven't been run in
    this sandbox (no network access here), so real numbers need a local run.
  - **Deployment (manual, out-of-band from Hardhat):** deployed to GIWA
    Sepolia via **Remix IDE**, Injected Provider, **Rabby Wallet**, compiler
    Solidity 0.8.30 — not via `contracts/scripts/deploy.ts`, which remains an
    unused stub for now.
    - Contract address: `0x36Dae8dCFf051f301D5e02a37d203b9f7DB93142`
    - Deployment tx: `0xd259a13743cbc2a4935f58a58a153a65711357025a9232c5f48f3706cdd96142`
    - Manually verified in Remix: mint, `getPassportByAddress()` read,
      `updateProfile()`, and `approve()` reverting (soulbound behavior
      confirmed live on-chain).
    - This address is now wired as the frontend's default in
      `app/src/lib/contract.ts` (overridable via
      `VITE_BUILDER_PASSPORT_ADDRESS`).
    - **Not yet done:** source verification on the Blockscout explorer
      (`sepolia-explorer.giwa.io`) — Remix deploys aren't auto-verified the
      way a Hardhat + `hardhat-verify` deploy would be. Treat as an M3 task.
  - **ABI integration (this delivery):** real ABI exported from Remix (50
    entries, cross-checked line-for-line against `BuilderPassport.sol` —
    matches exactly) now lives in `app/src/lib/contract.ts` as
    `BUILDER_PASSPORT_ABI`, declared `as const` for full wagmi/viem type
    inference. `BUILDER_PASSPORT_ADDRESS` keeps the deployed address as
    default with `VITE_BUILDER_PASSPORT_ADDRESS` override, unchanged.
  - **Type fix found during verification:** `app/src/types/builderPassport.ts`
    had a hand-written `BuilderPassportData` interface from before the ABI
    existed (Milestone 1) that had drifted from reality — missing
    `updatedAt`, and `skills` typed as `string[]` when the real ABI returns
    `bytes32[5]`. Replaced with a type derived directly from the ABI via
    viem's `ContractFunctionReturnType`, so it can't drift again. Added
    `app/src/lib/skills.ts` with `skillTagToBytes32`/`skillTagFromBytes32`/
    `skillsToBytes32Array`/`skillsFromBytes32Array` helpers, since any future
    mint/update/profile-display code now needs to convert between plain
    skill strings and the contract's raw `bytes32` slots.
  - No other frontend code referenced the old type or skills shape yet
    (mint/profile pages are still Milestone 1 placeholders), so nothing else
    needed updating.

- **Milestones 4–6 — full frontend build** (this delivery, done together
  since the person needed the whole project complete, not staged):
  - **Design token system:** deliberately not a generic dark-crypto or
    cream/terracotta template. "Official passport document" concept — ink
    navy (#12213B) + paper background (#FBFAF7) + brass accent (#B08D57),
    Fraunces (display) / Inter (body) / JetBrains Mono (addresses, hashes,
    timestamps). One signature element: a dashed-circle "GIWA · Sepolia ·
    Verified" stamp seal in the corner of every passport card
    (`components/StampSeal.tsx`), rotated slightly like a real ink stamp.
    Restrained everywhere else on purpose.
  - **Accessibility fix caught during build:** brass at ~2.96:1 against the
    paper background fails WCAG AA for text (needs 4.5:1) and is borderline
    for UI-component contrast (needs 3:1). Added `brass-700` (#7A5D34,
    ~5.8:1) for the one place brass was used as text (landing page eyebrow
    label), and switched every focus ring/outline from brass to ink (ink's
    contrast is very high either way) — brass is now purely decorative
    (stamp, borders, underline accents), never load-bearing for readability
    or focus visibility.
  - **`lib/limits.ts`:** field-length/skill-count constants mirrored from
    the contract, used for instant client-side validation before a wallet
    signature is ever requested (contract still re-validates everything —
    this is UX only, not the source of truth).
  - **`lib/format.ts`:** address/timestamp formatting, GitHub/X/website URL
    normalization helpers.
  - **`lib/errors.ts`:** decodes wagmi/viem contract-call errors, mapping
    every one of the contract's custom errors (`AlreadyMinted`,
    `NameTooLong`, `SoulboundTokenNonTransferable`, etc.) to plain-language
    copy instead of showing raw revert data.
  - **`hooks/useBuilderPassport.ts`:** `useHasMinted`, `useTokenIdOf`,
    `usePassportByAddress`, `useTotalSupply` — thin wagmi `useReadContract`
    wrappers. `usePassportByAddress` is only ever enabled once `hasMinted`
    is already known true, specifically to avoid hitting the
    `PassportDoesNotExist` revert path for the (very common) "no passport
    yet" case — that's an expected state, not an error to surface as one.
  - **`hooks/useContractWriteFlow.ts`:** shared mint/update transaction-state
    hook (`idle → signing → mining → success/error`), used by both forms.
  - **UI components:** `Button`, `FormControls` (labeled text/textarea
    fields with character counters and inline errors), `SkillsInput`
    (add/remove tag UI capped at `MAX_SKILLS`), `TxStatusBanner` (signing/
    mining/success/error, with a GIWA Sepolia explorer link once a hash
    exists), `PassportCard` + `StampSeal` (the public passport display).
  - **`features/profileForm.ts`:** validation logic shared between mint and
    edit forms (same rules, same error copy, written once).
  - **`features/mint/MintForm.tsx`:** full mint flow — form → validate →
    `mint()` → tx status → redirect to `/profile/:address` on success (via
    `useEffect`, not an inline render-time side effect).
  - **`features/profile/EditProfileForm.tsx`:** same shape, prefilled from
    the wallet's existing passport data (including decoding `bytes32[5]`
    skills back to plain tags via `skillsFromBytes32Array`), calls
    `updateProfile()`.
  - **Pages rewritten from Milestone 1 placeholders to the real flow:**
    - `LandingPage`: connect prompt, or "mint" / "view your passport" CTA
      depending on wallet + mint state, plus a live total-supply count.
    - `MintPage`: connect guard → already-minted guard (with links to view/
      edit) → `MintForm`.
    - `ProfilePage`: reads any address's passport (public, no wallet
      required), renders `PassportCard`, share button (native share sheet
      with clipboard fallback), "Edit profile" link only shown to the
      connected owner viewing their own profile.
    - `EditProfilePage`: connect guard → no-passport guard (links to mint)
      → `EditProfileForm` prefilled with current data.
  - **Not built (intentionally, out of MVP scope):** reputation/badges/
    portfolio/DAO/leaderboard/AI-resume features remain on the Future
    Roadmap, unchanged — this delivery completes the MVP (mint, view, edit),
    not the post-MVP roadmap.
  - **Honest limitation:** this sandbox still can't run `npm install`/
    `tsc`/`vite build` — every file above was written and manually
    cross-checked against the ABI's actual output shapes (confirmed
    `getPassport`/`getPassportByAddress` return named-field tuples matching
    `BuilderPassportData` exactly) and reviewed for import-path and
    unused-import correctness, but a real `npm run build` in Codespaces is
    the first actual compile — flag anything it catches and it'll be fixed
    immediately.

- **Full GIWA documentation audit + Stage 4-7 enhancements** (this delivery):
  - **Audit method:** read docs.giwa.io's connect-to-giwa, faucets,
    diffs-ethereum-giwa, flashblocks, Hardhat guide, and Remix IDE guide
    pages directly (not from memory), plus verified giwa.io/gasok and
    github.com/giwa-io independently.
  - **Confirmed correct, no changes needed:** chain ID 91342, RPC
    `sepolia-rpc.giwa.io`, explorer `sepolia-explorer.giwa.io`, native
    currency ETH, block gas limit context, WalletConnect config — all
    already matched official docs exactly.
  - **Real finding — contract verification approach:** the Hardhat guide
    confirms `hardhat-verify`'s default `verify` task uses the `production`
    build profile. Since `BuilderPassport` was deployed via **Remix**, its
    on-chain bytecode almost certainly won't byte-match either Hardhat
    build profile unless Remix's exact compiler/optimizer settings are
    replicated — meaning `npx hardhat verify` (recommended in earlier
    guidance) may well fail. The Remix IDE guide instead documents
    verifying directly through Blockscout's "Verify & Publish" UI at
    `sepolia-explorer.giwa.io`, pasting the flattened source with the exact
    compiler version/settings used in Remix. **Corrected recommendation:**
    use the Blockscout UI verification path, not `hardhat-verify`, for this
    specific deployment.
  - **Faucet classification corrected:** official docs list *two* faucets on
    the same page — GIWA Faucet (`faucet.giwa.io`, 0.005 ETH/24h, first-party)
    and Nodit Faucet (`faucet.lambda256.io/giwa-sepolia`, 0.01 ETH/24h,
    third-party but officially listed). Classified accordingly in the new
    Developer Resources page rather than lumping both as "official."
  - **Deliberately not included:** an official X/Discord. Neither is linked
    from docs.giwa.io's own navigation (only GitHub, Faucet, Bridge appear
    there), and every X search for a "GIWA chain" account returned unrelated
    people/projects — guessing risks linking to an impersonator. Flagged as
    an open item for the person to add once they've confirmed a real handle
    themselves, rather than guessed.
  - **New: `/resources` — Developer Resources page** — official links
    (Docs, Playground, Explorer, Faucet, GASOK program, GitHub, plus Chain
    ID/RPC/currency/contract address with copy buttons) visually separated
    from a clearly-labeled Community section (Nodit Faucet, Faucet.Trade).
  - **New: rich transaction receipts (`TxReceiptSummary`)** — replaces the
    old one-line "Success" banner after mint/update with: tx hash (+copy),
    block number, timestamp (fetched via a new `useBlockTimestamp` hook
    wrapping wagmi's `useBlock`), gas used, an explorer link, contract
    address (+copy), wallet address (+copy), and a share action. Both forms
    now stop auto-redirecting on success and instead show this summary with
    an explicit "Continue" button — deliberate UX change so there's time to
    actually read/copy the receipt before moving on.
  - **New: `ExplorerLinks` quick-link row** (View Wallet / View Contract /
    View Transactions / View Token) added directly to `PassportCard`, using
    real Blockscout URL patterns (`/address/:addr`, `?tab=txs`,
    `/token/:contract/instance/:id`) — no indexer, no Blockscout API calls,
    just links, per the explicit "don't build a backend" scope.
  - **New: `PassportCard` "Passport Details" grid** — Passport ID, Network,
    Profile Version, Skills Count, Mint Date, Last Updated, Owner Address
    (+copy), Contract Address (+copy) — all in one mobile-friendly
    two-column block.
  - **New shared pieces:** `lib/explorer.ts` (centralizes the Blockscout
    base URL — nothing hardcodes the domain per-component anymore except
    the one legitimate spot, the `viem` chain definition itself),
    `hooks/useClipboard.ts` + `components/ui/CopyButton.tsx` (one copy
    implementation reused everywhere instead of duplicated per field).
  - **Dead code caught and removed during this same pass:** wiring in
    `TxReceiptSummary` made `TxStatusBanner`'s own `"success"` branch
    unreachable (both callers now intercept `success` earlier). Removed
    that branch and the now-unused `successLabel` prop entirely rather than
    leave it as dead code — this is exactly the kind of thing Stage 9 of
    the audit asked to check for.
  - **Known, accepted limitation (not fixed, needs explicit decision):**
    `BuilderPassport.sol` never sets a `tokenURI`, so Blockscout's NFT
    "instance" page (linked via "View Token") will show the token's
    existence/owner but no image/metadata preview. This was a deliberate
    Milestone 2 trade-off (fully on-chain struct, no off-chain metadata
    dependency) — fixing it would mean adding a `tokenURI` override that
    returns an on-chain-generated data URI, which requires a full contract
    **redeploy** (the current contract has no admin/proxy, so it cannot be
    modified in place). Flagged as a Future Idea, not silently attempted,
    since redeploying is a bigger decision than a same-day fix and would
    change the contract address referenced everywhere.
  - Real project ID `a0031066837361c93d02ae2f139acc98` wired in — no longer
    a placeholder/blank value anywhere.
  - Set two ways, matching the pattern already used for the contract
    address: a hardcoded default in `app/src/lib/wagmi.ts`
    (`DEFAULT_WALLETCONNECT_PROJECT_ID`) so the app works even with no
    `.env` present at all, plus `app/.env` and `app/.env.example` both
    updated with the real value (env var still takes precedence if set,
    via `??`).
  - Documented in `wagmi.ts` why this is safe to commit unlike a real
    secret: a WalletConnect projectId is a public client identifier, meant
    to ship inside frontend bundles — it's visible in any deployed app's JS
    regardless, so hardcoding a real default is the correct call, not a
    security lapse.
  - `giwaSepolia` chain definition (`lib/chains.ts`) already has every field
    WalletConnect-connected wallets need to correctly recognize/add the
    custom chain during a session proposal — `id`, `name`,
    `nativeCurrency`, `rpcUrls.default.http`, `blockExplorers.default` — so
    no changes were needed there.

- **Final polish pass** (this delivery — finishing items left unintegrated
  from the previous audit turn):
  - **`ToastProvider`** (new, mounted once at the app root in `main.tsx`) —
    lightweight context/provider, no external toast library. `CopyButton`
    now fires a toast on every copy (hash, addresses, chain ID, RPC URL)
    in addition to its existing inline "Copied ✓" text — the toast matters
    most on mobile, where an inline label change next to a small tap target
    is easy to miss.
  - **Toast consistency fix:** `MintForm`/`EditProfileForm`'s share-fallback
    clipboard copy (used when `navigator.share` isn't available) had no
    toast feedback while `ProfilePage`'s share button did — same treatment
    everywhere now.
  - **`NetworkBadge`** (new) — static "GIWA Sepolia" pill in the header.
    Deliberately not wired to live wallet chain-mismatch state:
    RainbowKit's own `ConnectButton` already shows a "Wrong network" prompt
    with a one-tap switch for a single-chain config, so duplicating that
    logic would be redundant — this badge's only job is a constant visual
    reminder of which network the app targets.
  - **`PassportCardSkeleton`** (new) — mirrors `PassportCard`'s exact layout
    with pulsing placeholder blocks, replacing the old plain-text "Loading
    passport…" on `ProfilePage` so the page doesn't reflow once real data
    arrives.
  - **`NotFound`** (new) — friendly 404 treatment, used as both the
    app-wide catch-all route (`*` in `App.tsx`) and directly by
    `ProfilePage` for an invalid `:address` param (previously a plain red
    line of text).
  - **Developer Resources page updated:** added "Official Website"
    (giwa.io) and "Official X" (x.com/GIWA_by_Upbit) — both supplied
    directly by the project owner this session rather than independently
    verified the way every other link on the page was; noted as such in
    the file's own doc comment for provenance. Added an explicit
    "Explorer" info row (URL only, distinct from the "Blockscout Explorer"
    resource card) to match the requested official-info list exactly.
  - **Dead-code check on this pass:** none found — every new component's
    imports are actually used (confirmed via the same unused-import sweep
    method as prior audits), and the toast/copy/skeleton/404 additions
    don't duplicate any existing logic (each is used from exactly the
    places that needed it, nothing speculative added).

- **Codespaces/Vercel packaging** (this delivery):
  - `.devcontainer/devcontainer.json` added — Node 20 devcontainer, auto
    `npm install` on creation, forwards port 5173 with auto-preview, bundles
    recommended extensions.
  - Root `vercel.json` added — installs and builds the `app` workspace from
    the monorepo root, outputs `app/dist`, so Vercel's dashboard needs no
    manual "Root Directory" configuration (though that remains a documented
    fallback).
  - `package.json` root: added `engines.node >= 20.0.0` for consistency
    across Codespaces/Vercel.
  - `.gitignore`: added `.vercel/`.
  - `README.md` rewritten around a full mobile-only workflow: create empty
    GitHub repo → open Codespace → upload this ZIP → unzip/flatten → rebuild
    container → `npm install` → `git push` → deploy via Vercel dashboard.

## Pending Tasks (all now Codespaces-side — nothing left for the assistant to build for MVP scope)

- **First real compile check:** in the Codespace, run `npm install` then
  `npm run build` (root) to catch anything this sandbox's lack of `tsc`
  couldn't verify. Report back anything that fails and it'll be fixed
  immediately.
- **Corrected verification approach** (per this audit's Hardhat-guide
  finding): don't use `npx hardhat verify` for this deployment — it defaults
  to Hardhat's own `production` build profile, which almost certainly won't
  byte-match a Remix-compiled deployment. Instead, verify directly via the
  Blockscout UI: go to
  `https://sepolia-explorer.giwa.io/address/0x36Dae8dCFf051f301D5e02a37d203b9f7DB93142`,
  use "Verify & Publish" → "Solidity (Single File)", paste
  `contracts/contracts/BuilderPassport.sol`'s full source (flattened with
  OpenZeppelin's imports inlined, since Blockscout's single-file mode needs
  one file — or use its "Standard JSON Input" mode with Remix's own compiler
  output if you still have it), and match whatever compiler version/
  optimizer settings Remix actually used at deploy time.
- Confirm whether GIWA has an official X/Discord and add it to
  `DeveloperResourcesPage.tsx` once verified — deliberately left out of this
  delivery since neither is linked from docs.giwa.io itself and guessing
  risks linking to the wrong (possibly impersonator) account.
- `VITE_WALLETCONNECT_PROJECT_ID` is already configured with a real value
  (`a0031066837361c93d02ae2f139acc98`) — no action needed unless you want to
  switch to a different WalletConnect project, in which case set it in
  Vercel's project environment variables (it'll override the baked-in
  default).
- Decide whether to keep the Remix-deployed contract as the permanent
  GASOK-submission address, or do a clean Hardhat-scripted redeploy later for
  reproducibility — either is fine; if a redeploy happens, only
  `VITE_BUILDER_PASSPORT_ADDRESS` needs to change, not any code.
- Run `npm run contracts:test` locally to get real gas numbers and confirm
  ≥95% coverage via `npm run test:coverage` (see `contracts/GAS_REPORT.md`
  for the one intentionally-unreachable branch to expect:
  `NotPassportOwner`).
- Optional, post-MVP: Milestone 7's fuller responsive/accessibility QA pass
  (the checklist in the original blueprint) and Milestone 8's GASOK
  submission package (pitch deck, demo video). The contrast fix and
  mobile-first layout from this delivery cover the core of M7 already; the
  remaining items are presentation/submission logistics, not code.
- Milestone 4: mint form UI + tx state handling.
- Milestone 5: public profile page.
- Milestone 6: owner-only edit flow.
- Milestone 7: responsive/accessibility polish + manual QA pass.
- Milestone 8: GASOK submission package.

## Known Issues / Open Items

- `npm install` has not been run in this environment (no network egress in the
  build sandbox) — dependency versions in `package.json` are pinned to
  reasonably current releases as of July 2026 but should be verified/updated
  via `npm outdated` once installed locally.
- `VITE_WALLETCONNECT_PROJECT_ID` is now set to a real value
  (`a0031066837361c93d02ae2f139acc98`), baked in both as a `.env` value and
  as a code default in `wagmi.ts` — no longer an open item.
- GIWA mainnet does not exist yet ("under development" per official docs as of
  this check) — everything here targets GIWA Sepolia testnet only.
- Block explorer contract-verification flow (`hardhat-verify` against
  Blockscout's API) is configured but unconfirmed end-to-end — first real
  verification attempt happens in Milestone 3, treat as a risk item until then.
- The Milestone 2 deployment (`0x36Dae8dCFf051f301D5e02a37d203b9f7DB93142`)
  was done manually via Remix, not via `contracts/scripts/deploy.ts` — so
  that script is still an unused stub, and the deployed bytecode has not been
  independently re-verified against GIWA's Blockscout explorer in this
  delivery. Confirm it directly at `sepolia-explorer.giwa.io` before treating
  it as final.

## Technical Decisions Log

| Decision | Choice | Rationale |
|---|---|---|
| Metadata storage | Fully on-chain struct | No IPFS dependency; simplest, most auditable for MVP (your explicit call) |
| Transferability | Soulbound (non-transferable) | A resellable "proof of early builder" undermines the whole point (your explicit call) |
| Schema versioning | `version` field in struct from day one | Future-proofs any migration without breaking existing readers (your explicit call) |
| Monorepo tooling | Plain npm workspaces, no Turborepo/Nx | Two packages don't justify extra tooling — avoid unnecessary complexity |
| State management (frontend) | Wagmi/React Query built-ins only | No Redux/Zustand needed at this scope |
| Proxy/upgradeable contract pattern | Not used | Adds real complexity/attack surface not justified for an MVP testnet submission |
| Hardhat version | Hardhat 3 (new plugin-based config) | Matches GIWA's own documented example exactly |
| Custom errors over `require(string)` | Custom errors | Cheaper (no string encoding cost), more precise for clients/tests to catch |
| `version`/`mintedAt`/`updatedAt` packing | Declared contiguously as first struct fields | Solidity packs all three into 1 slot instead of 3 — free gas saving |
| `skills` type | `bytes32[5]` (not `string[]`) | Avoids dynamic-array length slot + keccak-addressed data slots; trade-off is a 32-byte cap per tag |
| `approve`/`setApprovalForAll` | Overridden to revert | A soulbound token shouldn't allow approvals either — prevents misleading marketplace listings |
| `updateProfile` tokenId param | Derived from `msg.sender`, not passed in | 1:1 wallet↔tokenId is permanent (soulbound), so there's no valid "different tokenId" case to support |
| Website field cap | 256 bytes (raised from initial 128 proposal) | Your explicit call, to comfortably fit longer real-world URLs |
| Test framework | Hardhat 3 native `node:test` + viem + `hardhat-viem-assertions` | Current official Hardhat 3 recommendation, bundled via `hardhat-toolbox-viem` |
| Frontend design direction | "Official passport document" — ink navy + paper + brass, Fraunces/Inter/JetBrains Mono | Avoids the generic cream+terracotta / near-black+neon / broadsheet defaults; ties visually to the "passport" concept itself |
| Brass as decorative-only | Moved off text/focus-ring duty to `brass-700`/`ink` | Raw brass measured ~2.96:1 against paper — fails WCAG AA text contrast (4.5:1) and is borderline for UI-component contrast (3:1) |
| `usePassportByAddress` gating | Only enabled after `hasMinted` confirms `true` | Avoids hitting the `PassportDoesNotExist` revert path for the common "wallet has no passport yet" case — that's an expected state, not an error |
| Client-side field limits | Hardcoded in `lib/limits.ts`, mirroring contract constants | Contract has no admin function that could change them post-deploy, so duplicating them for instant form feedback is safe; contract remains the real validator |
| Shared `useContractWriteFlow` hook | One hook, loosely-typed `WriteArgs` param | Reduces duplication between mint/edit forms; trade-off is less compile-time strictness at the hook boundary (documented in-file) — call sites still build literal args against the real ABI |

## Future Improvements (post-MVP, not in current scope)

See `ROADMAP.md` for the full future roadmap (reputation, badges, portfolio,
DAO membership, leaderboard, AI resume generator, analytics).
