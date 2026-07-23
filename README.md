# GIWA Builder Passport

Soulbound, on-chain builder identity for the GIWA ecosystem — a GASOK Builder
Program submission..

- `app/` — Vite + React + TypeScript + Tailwind + Wagmi + Viem + RainbowKit
- `contracts/` — Hardhat 3, targeting GIWA Sepolia (chain ID 91342)

See `ARCHITECTURE.md` for design decisions, `ROADMAP.md` for milestone status,
and `CLAUDE.md` for running project memory.

**Status:** MVP complete — `BuilderPassport.sol` implemented, tested, and
deployed to GIWA Sepolia; the full frontend (mint, public profile, edit) is
built and wired to the real deployed contract and ABI. This project is
packaged to be uploaded directly to a GitHub repo and developed entirely
through **GitHub Codespaces** — no local machine required. Codespaces is only
needed for `npm install`, running tests, and any minor fixes before deploying
to Vercel — everything else is already built.

## What's built

- **Mint** (`/mint`) — profile form (name, bio, up to 5 skill tags, GitHub, X,
  website), instant client-side validation matching the contract's limits,
  full transaction status (wallet confirmation → mining → success/error),
  redirects to the new public profile once minted.
- **Public profile** (`/profile/:address`) — reads any wallet's passport, no
  wallet needed to view. Renders the passport as a styled card with its one
  signature design touch: a corner "GIWA · Sepolia · Verified" stamp seal,
  plus a full metadata grid (Passport ID, Network, Profile Version, Skills
  Count, Mint Date, Last Updated, Owner/Contract addresses with copy) and
  quick links to the official Blockscout explorer (wallet, contract,
  transactions, NFT instance).
- **Edit** (`/edit`) — owner-only, prefilled from the wallet's existing
  on-chain data, saves via `updateProfile()`.
- **Developer Resources** (`/resources`) — official GIWA links (docs,
  Playground, explorer, faucet, GASOK program, GitHub, chain ID/RPC/contract
  address with copy buttons) kept visually separate from community links
  (Nodit Faucet, Faucet.Trade) — every link verified directly against
  docs.giwa.io during a full documentation audit, not carried over from
  memory.
- Mint and edit both end in a rich transaction receipt (hash, block number,
  timestamp, gas used, explorer link, copy actions, share) with an explicit
  "Continue" button — not an automatic redirect — so there's time to
  actually read it.
- Every copy action (tx hash, addresses, chain ID, RPC URL) shows both
  inline "Copied ✓" text and a toast notification — the toast matters most
  on mobile, where an inline label change is easy to miss.
- A static "GIWA Sepolia" network badge sits in the header; loading states
  use a skeleton matching the passport card's exact shape instead of plain
  text; invalid profile addresses and unmatched routes get a friendly 404
  page instead of a bare error line.
- All pages are guarded appropriately (wallet-connect prompts, already-
  minted / not-yet-minted redirects) and share one transaction-status
  component and one client-side validation module.

---

## Working from mobile: GitHub Codespaces workflow

This whole project — including installing dependencies, running the dev
server, and deploying — can be done from a phone/tablet browser using GitHub
Codespaces and the Vercel dashboard. No desktop/laptop needed.

### 1. Create a GitHub repository

- In the GitHub app or mobile browser, create a new **empty** repository
  (don't initialize it with a README, to keep the upload simple).

### 2. Open a Codespace on it

- On the repo page: **Code → Codespaces → Create codespace on main**.
- This opens a full VS Code environment in your browser. On a phone, tapping
  "request desktop site" in your mobile browser makes this much easier to
  use, but it works either way.

### 3. Upload this ZIP into the Codespace

- In the Codespace's file **Explorer** panel, tap the **"..."** menu →
  **Upload...**, and select this ZIP file.
- Open the integrated **Terminal** (there's a terminal icon, or use the
  Explorer's "..." menu) and run:

```bash
unzip giwa-builder-passport*.zip

# Flatten so the repo root IS the project root (includes dotfiles like
# .gitignore and .devcontainer):
shopt -s dotglob
mv giwa-builder-passport/* .
rmdir giwa-builder-passport
rm -f giwa-builder-passport*.zip
```

### 4. Rebuild the container (picks up `.devcontainer/devcontainer.json`)

- Since the devcontainer config just arrived via upload rather than being
  present when the Codespace was created, run the command palette
  (**Cmd/Ctrl+Shift+P**, or the "..." menu) → **"Codespaces: Rebuild
  Container"**. This isn't strictly required — you can just run
  `npm install` yourself instead — but rebuilding gets you the recommended
  VS Code extensions (ESLint, Tailwind, Solidity) and port-forwarding preset
  automatically.

### 5. Install dependencies and commit

```bash
npm install
git add -A
git commit -m "GIWA Builder Passport — full MVP (contract, tests, mint/profile/edit UI)"
git push
```

### 6. Run the dev server (optional, to preview in-browser)

```bash
npm run dev
```
Codespaces will forward port 5173 and offer an in-browser preview — this is
the actual running app, viewable right there on your phone.

### 7. Environment variables (already configured — optional to change)

`app/.env` and `app/.env.example` already ship with a real, working
WalletConnect/Reown project ID
(`VITE_WALLETCONNECT_PROJECT_ID=a0031066837361c93d02ae2f139acc98`) — this is
a public client identifier, not a secret, so it's safe to commit and use as
shipped. It's also baked in as a default directly in
`app/src/lib/wagmi.ts`, so the app works even without any `.env` file at all.

Only touch this if you want to switch to a *different* WalletConnect
project — get one at [cloud.reown.com](https://cloud.reown.com) and set
`VITE_WALLETCONNECT_PROJECT_ID` in `app/.env` (Codespaces) or in Vercel's
project environment variables (it overrides the baked-in default either
way).

`VITE_BUILDER_PASSPORT_ADDRESS` is optional — only set it if you want to
override the deployed default already baked into `app/src/lib/contract.ts`.

### 8. Deploy to Vercel

- Go to [vercel.com](https://vercel.com) in your mobile browser, sign in with
  GitHub, **Add New... → Project**, and import this repository.
- A root-level `vercel.json` is already included, so Vercel should
  auto-detect the build settings (installs at the repo root, builds the
  `app` workspace, serves `app/dist`) without you needing to change any
  project settings.
- No environment variables are required for a first deploy — the
  WalletConnect project ID and contract address both have working defaults
  baked in. Only add `VITE_WALLETCONNECT_PROJECT_ID` and/or
  `VITE_BUILDER_PASSPORT_ADDRESS` in Vercel's project settings
  (**Settings → Environment Variables**) if you want to override either.

If Vercel ever doesn't pick up `vercel.json` for some reason, the fallback is
to set **Root Directory** to `app` in the Vercel project's settings — Vercel
will then auto-detect it as a plain Vite app.

---

## Contracts workspace (for reference — no local run required unless you want to)

```bash
npm run contracts:compile
npm run contracts:test          # full Hardhat test suite
cd contracts && npm run test:coverage   # coverage report
```

See `contracts/GAS_REPORT.md` for gas-measurement methodology and
`contracts/contracts/BuilderPassport.design.md` for the full pre-implementation
design review (UML, storage layout, event flow, state diagram, attack-vector
table).

## Deployment (Milestone 2)

Deployed manually via **Remix IDE** (Injected Provider) using **Rabby
Wallet**, compiler Solidity 0.8.30 — not via the Hardhat deploy script in
`contracts/scripts/deploy.ts`, which remains an unused stub for a future
scripted redeploy.

- **Network:** GIWA Sepolia (chain ID 91342)
- **Contract:** `BuilderPassport`
- **Address:** `0x36Dae8dCFf051f301D5e02a37d203b9f7DB93142`
- **Deployment tx:** `0xd259a13743cbc2a4935f58a58a153a65711357025a9232c5f48f3706cdd96142`
- **Manually verified in Remix:** mint, `getPassportByAddress()` read,
  `updateProfile()`, and `approve()` reverting (soulbound behavior confirmed
  live on-chain).

This address is wired as the frontend's default contract address (see
`app/src/lib/contract.ts`), overridable via `VITE_BUILDER_PASSPORT_ADDRESS`.
The real ABI (exported from Remix) is wired in, and the full mint/profile/edit
UI (above) is built against it. Source verification on the GIWA Sepolia
Blockscout explorer is still pending. A later documentation audit found that
`npx hardhat verify` likely won't work for this specific deployment — it
defaults to Hardhat's own build profile, which almost certainly won't
byte-match a Remix-compiled contract. Use Blockscout's own "Verify & Publish"
UI instead (matching the flow GIWA's official Remix guide documents) — see
`CLAUDE.md` for the exact steps.
