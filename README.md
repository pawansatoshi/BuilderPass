# GIWA Builder Passport

> A portable, verifiable on-chain identity primitive for builders.

**GIWA Sepolia · GASOK Builder Program submission**

BuilderPass connects **identity → skills → projects → proofs** into an ecosystem-readable builder profile. The core identity is soulbound and anchored on-chain; the product deliberately avoids inventing a subjective reputation score.

## Why this matters

Builder identity is fragmented across wallets, GitHub, social profiles and ecosystem programs. BuilderPass creates a portable identity layer where core builder metadata can be verified directly from the blockchain.

### The model

```text
Wallet
  ↓
Soulbound Builder Passport
  ↓
Skills + Profile Metadata
  ↓
Project / Contribution Evidence
  ↓
Verifiable Builder Graph
  ↓
Ecosystems, applications and agents
```

## What is implemented

- **Soulbound on-chain identity** — `BuilderPassport.sol` is non-transferable.
- **Mint** — builder name, bio, up to five skills, GitHub, X and website.
- **Public profile** — anyone can inspect a passport without connecting a wallet.
- **Owner-only editing** — profile updates are restricted to the passport owner.
- **On-chain verification layer** — wallet, passport ID, contract and network are presented as a clear proof trail.
- **Explorer evidence** — direct GIWA Sepolia Blockscout links for wallet, contract, transactions and token instance.
- **Lifecycle metadata** — profile version, mint timestamp and update timestamp are surfaced from contract state.
- **Builder portfolio layer** — projects can be presented as evidence without converting them into an arbitrary score.
- **Evaluator-first UX** — the landing page explains the problem, primitive and verification model before asking the user to mint.
- **Mobile-friendly interface** — responsive UI, transaction status, copy actions and explicit receipts.

## Verification

**Network:** GIWA Sepolia  
**Chain ID:** `91342`  
**Contract:** `BuilderPassport`  
**Contract address:** `0x36Dae8dCFf051f301D5e02a37d203b9f7DB93142`  
**Deployment transaction:** `0xd259a13743cbc2a4935f58a58a153a65711357025a9232c5f48f3706cdd96142`

The contract was deployed manually through Remix with Solidity `0.8.30` and tested live for minting, profile reads, profile updates and soulbound transfer rejection. Source verification on the GIWA Blockscout explorer remains a separate deployment-verification step.

## Product architecture

```text
app/
├── React + TypeScript + Vite
├── Wagmi + Viem
├── RainbowKit wallet connection
├── React Router
└── Tailwind CSS

contracts/
└── BuilderPassport.sol
```

The frontend reads the real deployed ABI and contract address. No centralized database or custom identity indexer is required for the core passport flow.

## Product philosophy

### Evidence before reputation

BuilderPass intentionally does **not** manufacture a reputation number. A number can be gamed and is difficult to interpret across ecosystems.

Instead, the primitive is designed around verifiable evidence:

- who controls the wallet
- what passport exists on-chain
- what skills the builder declared
- which project or contribution evidence is linked
- when the profile was minted or updated
- where the underlying transaction can be independently verified

Future attestations can build on this foundation without changing the identity primitive.

## Future direction

The next logical layer is a **builder graph**:

1. **Identity** — portable wallet-bound builder identity.
2. **Credentials** — attestations for skills, programs and capabilities.
3. **Reputation** — evidence-weighted signals rather than a single opaque score.
4. **Builder Graph** — machine-readable relationships between builders, projects and contributions.
5. **Agent-readable identity** — autonomous agents and applications can consume verifiable builder evidence when selecting collaborators or capabilities.

This keeps the project focused on builder identity while making it extensible toward the emerging agentic economy.

## Builder portfolio examples

The current profile presentation can connect to real builder evidence such as:

- **ARCTIS** — AI, programmable money and economic-agent architecture.
- **Veridex** — evidence-first on-chain intelligence / Telegraph work.
- **FactAnchor** — web-grounded Intelligent Contract and validator consensus.
- **GIWA Builder Passport** — this identity primitive.

These links are evidence references, not claims of employment, partnership or official endorsement.

## Development

```bash
cd app
npm install
npm run build
npm run lint
npm run dev
```

The repository is designed to work with GitHub Codespaces and can be deployed to Vercel using the included root configuration.

## Repository structure

See:

- `ARCHITECTURE.md` — design decisions and system model.
- `ROADMAP.md` — milestone and future direction.
- `CLAUDE.md` — project memory and implementation notes.
- `app/src/components/BuilderProof.tsx` — evaluator-friendly verification layer.
- `app/src/components/BuilderPortfolio.tsx` — evidence/portfolio presentation.

## Status

**MVP complete and deployed to GIWA Sepolia.** The current iteration focuses on making the submitted product easier to understand, independently verify and extend without changing the core identity contract.

---

Built by **PAWAN UPADHYAY (@pawansatoshi)**.
