# Architecture

## System Overview

```
[Browser: React + Vite + TS + Tailwind]
   |
   |-- RainbowKit (wallet connect UI)
   |-- Wagmi + Viem (contract reads/writes, chain config)
   |
   v
[GIWA Sepolia — chain ID 91342, OP Stack L2]
   |
   v
[BuilderPassport.sol — soulbound ERC-721, fully on-chain metadata]
```

No custom backend server. This is a deliberate simplicity choice: the entire
system is client + smart contract, nothing to host or secure server-side.

## Why No Backend

- Metadata lives entirely on-chain (see Metadata Storage below), so there's
  nothing for a server to serve.
- Wallet interaction happens entirely client-side via Wagmi/RainbowKit.
- Removes an entire category of infrastructure (hosting, auth, uptime) that
  isn't needed for the MVP scope. If a backend becomes necessary later
  (e.g., for indexing many passports for a leaderboard), that's a distinct,
  deliberate addition — not a default.

## Monorepo Layout

```
giwa-builder-passport/
├── app/            # frontend workspace (Vite + React + TS + Tailwind)
└── contracts/      # Hardhat workspace (Solidity, tests, deploy scripts)
```

Plain npm workspaces (see root `package.json`), not Turborepo/Nx/pnpm
workspaces. Two packages with no shared build pipeline don't justify extra
tooling — this can be upgraded later if the project grows enough to need it.

## Frontend Architecture

- **Build tool:** Vite — fast dev server, minimal config, standard for a
  React+TS SPA of this size.
- **Styling:** Tailwind CSS — utility classes, no separate CSS-in-JS runtime,
  keeps bundle small.
- **Wallet/chain layer:** Wagmi v2 + Viem v2 + RainbowKit v2. This stack was
  named directly in your original spec and is the current standard combo for
  EVM dApp wallet connection.
- **Single-chain config:** `wagmiConfig` only includes GIWA Sepolia. The app
  has no reason to support any other chain for this MVP, so we avoid the
  "wrong network" UX problem entirely by not offering other networks.
- **Routing:** React Router, four routes (`/`, `/mint`, `/profile/:address`,
  `/edit`) — matches the user journeys from the discovery blueprint.
- **State management:** No global state library. Wagmi hooks are backed by
  React Query internally, which already handles caching/refetching for
  on-chain reads. Local component state (`useState`) is sufficient for forms.
  This follows the "prefer simplicity over unnecessary abstraction" rule —
  there's no cross-cutting state that would justify Redux/Zustand/Context
  beyond what Wagmi's providers already give us.
- **Folder structure:**
  ```
  app/src/
    components/   # shared, reusable UI (Layout now; Button/Card/inputs later)
    features/     # feature-specific logic — mint/ and profile/ (empty until M4/M5)
    hooks/        # custom hooks (e.g., useBuilderPassport) — added in M4/M5
    lib/          # chain config, wagmi config, contract address/ABI
    pages/        # route-level components
    types/        # shared TS types (BuilderPassportData defined now)
  ```

## Smart Contract Architecture (planned — Milestone 2)

Not yet implemented; documenting the agreed design so implementation in M2
has no ambiguity.

- **Standard:** ERC-721 (OpenZeppelin `ERC721`), because each passport is a
  unique, individually-owned, non-fungible token.
- **Soulbound:** Achieved by overriding the internal transfer hook
  (`_update` in OpenZeppelin v5) to `revert` whenever `from != address(0)`
  and `to != address(0)` — i.e., mints are allowed, transfers are not. This
  is the standard, minimal-surface way to make an OZ v5 ERC-721 soulbound
  without forking the whole implementation.
- **Metadata storage:** Fully on-chain struct (no IPFS, no off-chain
  dependency). Trade-off accepted: higher gas per field than a tokenURI
  pointer, in exchange for zero external dependencies and full
  auditability/composability by other on-chain contracts.
- **Data model (`BuilderPassportData` struct, mirrored in
  `app/src/types/builderPassport.ts`):**
  ```solidity
  struct BuilderPassportData {
      uint16 version;   // schema version — starts at 1
      string name;
      string bio;
      string[] skills;  // capped length, enforced in mint/update
      string github;
      string x;
      string website;
      uint64 mintedAt;
  }
  ```
  `version` exists specifically so that any future contract or reader
  (frontend, indexer, another GIWA app) can detect and handle older-schema
  passports without breaking — this was an explicit requirement.
- **One passport per wallet:** enforced via `mapping(address => uint256)`
  checked in `mint()`.
- **Access control:** `updateProfile()` requires `msg.sender == ownerOf(tokenId)`.
  No `Ownable`/admin role is needed yet since there's no admin-only
  functionality in MVP scope; may be added later if e.g. a version-migration
  function is needed.
- **No proxy pattern:** a single immutable contract, for auditability and
  simplicity. Upgradeable *logic* (as opposed to upgradeable *metadata*,
  which we already have via the struct) is a distinct future decision, not
  taken now.

## Network Configuration

GIWA Sepolia values, confirmed directly against
`docs.giwa.io/giwa-chain/en/get-started/connect-to-giwa` on 2026-07-21:

| Field | Value |
|---|---|
| Chain ID | 91342 |
| RPC URL | `https://sepolia-rpc.giwa.io` (documented as rate-limited; fine for this MVP) |
| Currency symbol | ETH |
| Explorer | `https://sepolia-explorer.giwa.io` (Blockscout-based) |
| Mainnet | Not yet launched ("under development" per official docs) |

Hardhat config mirrors GIWA's own published Hardhat example
(`docs.giwa.io/get-started/smart-contract/develop/hardhat`) almost verbatim,
including the Hardhat 3 plugin-based config style and `chainDescriptors`
block used for explorer verification.

## Security Posture (carried from discovery phase, unchanged)

- No private keys or secrets in frontend code; deployer key lives only in
  `contracts/.env` (gitignored), never committed.
- All user input validated both client-side (UX) and contract-side (source
  of truth) — field length caps enforced on-chain.
- Soulbound transfer-block is itself a security/product decision: it
  guarantees a passport can never be sold or moved, which is what makes it
  a credible "proof of early builder" claim.

## Deferred Decisions (flagged, not forgotten)

- Contract-verification flow against GIWA's Blockscout explorer is
  configured but not yet tested end-to-end — first real attempt is
  Milestone 3.
- Whether an admin/versioning migration function is ever needed depends on
  whether the struct shape actually changes in the future — not built
  preemptively.
