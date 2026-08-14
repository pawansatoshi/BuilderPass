# Roadmap

## Development Milestones

- [x] **Discovery** — Product blueprint, competitive analysis, PRD, approved technical decisions (on-chain metadata, soulbound, versioned struct).
- [x] **M1 — Scaffold** — Vite/React/TS/Tailwind app, Hardhat contracts workspace, GIWA Sepolia network config and project documentation.
- [x] **M2 — BuilderPassport.sol** — Reviewed and implemented soulbound ERC-721 with versioned on-chain profile data, five skill slots, mint/update functions and events. Deployed to GIWA Sepolia at `0x36Dae8dCFf051f301D5e02a37d203b9f7DB93142`.
- [x] **M3 — Deployment integration** — Real Remix-exported ABI integrated into the frontend, deployed contract wired in, skill encoding/decoding implemented and mobile Codespaces/Vercel workflow documented.
- [x] **M4 — Mint flow UI** — Profile form, validation, wallet guards and complete transaction-status flow.
- [x] **M5 — Public profile** — Shareable, wallet-free profile page with on-chain metadata and explorer links.
- [x] **M6 — Edit flow** — Owner-only profile updates with existing on-chain data prefilled.
- [x] **M7 — Product polish** — Responsive design, accessibility/contrast fixes, transaction receipts, developer resources, explorer links and passport metadata.
- [x] **M7.5 — Phase-3 presentation layer** — Added evaluator-first product narrative, explicit problem/primitive/proof framing, an on-chain verification section, builder portfolio/evidence layer and agent-readable builder-graph vision without changing the deployed identity contract.
- [~] **M8 — GASOK submission package** — Core product and technical evidence are complete. Remaining work is presentation logistics such as final demo recording and submission collateral.

## Product Direction

BuilderPass is intentionally built in layers:

```text
Identity → Credentials → Evidence → Reputation → Builder Graph → Agent-readable identity
```

### Current implementation

- **Identity:** wallet-bound, soulbound Builder Passport.
- **Profile:** name, bio, skills, GitHub, X and website.
- **Evidence presentation:** project links and on-chain proof trail.
- **Verification:** wallet, passport ID, contract, network and explorer transaction paths.

### Future roadmap

- Builder Reputation through external attestations rather than a proprietary opaque score.
- Verified Projects / on-chain portfolio attestations.
- Soulbound achievement and hackathon credentials.
- Ecosystem-specific credentials and membership proofs.
- Builder Graph connecting people, projects, skills and contributions.
- Agent-readable capability and credential interfaces.
- Optional consent-based AI profile/resume generation.
- Developer analytics dashboard.

## Design Constraints

- Do not add tokenomics merely for gamification.
- Do not introduce a centralized identity database for the core passport.
- Do not turn the passport into an arbitrary leaderboard score.
- Prefer verifiable evidence and standard attestation primitives.
- Keep the deployed identity contract stable while presentation and ecosystem layers evolve.
