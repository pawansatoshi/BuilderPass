# Roadmap

## Development Milestones

- [x] **Discovery** — Product blueprint, competitive analysis, PRD, approved
      technical decisions (on-chain metadata, soulbound, versioned struct).
- [x] **M1 — Scaffold** — Vite/React/TS/Tailwind app, Hardhat contracts
      workspace, GIWA Sepolia network config, CLAUDE.md/ARCHITECTURE.md/
      ROADMAP.md. No Solidity logic yet (by design).
- [x] **M2 — BuilderPassport.sol** — Design reviewed and approved first
      (UML/storage/event-flow/state diagrams, gas estimates, attack-vector
      review), then implemented: soulbound ERC-721, on-chain struct with
      packed `version`/`mintedAt`/`updatedAt`, `bytes32[5]` skills, mint +
      updateProfile + events, comprehensive NatSpec, full Hardhat test suite
      with gas-measurement tests. **Deployed manually to GIWA Sepolia** via
      Remix IDE (Injected Provider, Rabby Wallet) rather than a Hardhat
      script — address `0x36Dae8dCFf051f301D5e02a37d203b9f7DB93142`, tx
      `0xd259a13743cbc2a4935f58a58a153a65711357025a9232c5f48f3706cdd96142`.
      Manually verified in Remix: mint, `getPassportByAddress()`,
      `updateProfile()`, and `approve()` reverting as expected.
- [ ] **M3 — Deploy** — Contract address wired in Milestone 2. **ABI now
      integrated:** real 50-entry ABI exported from Remix is live in
      `app/src/lib/contract.ts` (`BUILDER_PASSPORT_ABI`, `as const` typed).
      Found and fixed a stale hand-written type in
      `app/src/types/builderPassport.ts` in the process — now derived
      directly from the ABI so it can't drift again — plus added
      `app/src/lib/skills.ts` for `bytes32[5]` ↔ skill-tag conversion.
      **Project repackaged for a mobile-only workflow:** `.devcontainer/`
      config + root `vercel.json` added so the ZIP can be uploaded straight
      into a GitHub Codespace and deployed via the Vercel dashboard with no
      local machine involved — see `README.md`.
      **Remaining:** explorer source verification — a later audit found
      `hardhat verify` likely won't byte-match this Remix-compiled
      deployment (defaults to Hardhat's own build profile); see CLAUDE.md
      for the corrected Blockscout-UI verification steps — and a decision
      on permanent-vs-redeploy strategy.
      wire contract address/ABI into the frontend.
- [x] **M4 — Mint flow UI** — Profile form (name/bio/skills/github/x/
      website), client-side validation mirroring the contract's limits,
      wallet-connect guard, already-minted guard, full transaction-status
      flow (signing → mining → success/error), redirect to the new public
      profile on success.
- [x] **M5 — Public profile page** — Read-only, shareable (native share
      sheet + clipboard fallback), no wallet required to view. Renders the
      `PassportCard` — the one signature design element (a corner "GIWA ·
      Sepolia · Verified" stamp seal).
- [x] **M6 — Edit flow** — Owner-only profile update UI, prefilled from the
      wallet's existing on-chain data, decodes `bytes32[5]` skills back to
      editable tags.
- [~] **M7 — Polish** — Design-token pass (ink/paper/brass, Fraunces/Inter/
      JetBrains Mono) done, plus a real WCAG contrast bug caught and fixed
      during the build (brass measured ~2.96:1 against paper — moved off
      text/focus duty). Mobile-first responsive layout throughout.
      **Extended in this delivery's full GIWA-docs audit:** rich transaction
      receipts (hash, block, timestamp, gas, explorer link, copy actions)
      replacing the old one-line success message; a Developer Resources
      page distinguishing official vs. community links; explorer quick-links
      and a full "Passport Details" metadata grid added to every profile
      card. Remaining for M7: the fuller manual QA checklist from the
      original blueprint (real-device testing, Lighthouse pass) —
      presentation polish, not missing code.
- [ ] **M8 — GASOK submission package** — Pitch deck, MVP demo video/site,
      public contract link, technical documentation. Not started —
      logistics/presentation work, not code.

## Future Roadmap (post-MVP)

- Builder Reputation scoring (likely via EAS-style attestations rather than
  reinventing attestation infrastructure)
- Achievements / Hackathon Badges
- Verified Projects / on-chain portfolio
- Soulbound Credentials track distinct from the base passport (for
  verified achievements specifically)
- DAO membership gating
- Builder Leaderboard
- AI Resume Generator (would require explicit user consent for any GitHub
  API data pull)
- Developer Analytics dashboard

## Open Decisions to Revisit Later

- Whether an admin-controlled migration function is needed if the on-chain
  struct schema ever changes (the `version` field makes this detectable;
  whether it's *actioned* automatically or manually is not yet decided).
- Whether a dedicated (non-rate-limited) RPC provider is needed once beyond
  local development / low-traffic testnet use.
