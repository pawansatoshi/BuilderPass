# GIWA Builder Passport

> **A portable, verifiable on-chain identity primitive for builders.**

**GIWA Sepolia · GASOK Builder Program submission**

BuilderPass connects **identity → skills → projects → proofs** into an ecosystem-readable builder profile. The core identity is soulbound and anchored on-chain; the product deliberately avoids inventing a subjective reputation score.

[![GIWA Sepolia](https://img.shields.io/badge/GIWA-Sepolia-111827?style=for-the-badge)](https://sepolia-explorer.giwa.io/)
[![Smart Contract](https://img.shields.io/badge/Smart%20Contract-Public-6d28d9?style=for-the-badge)](https://sepolia-explorer.giwa.io/address/0x36Dae8dCFf051f301D5e02a37d203b9f7DB93142)
[![CI](https://github.com/pawansatoshi/BuilderPass/actions/workflows/ci.yml/badge.svg)](https://github.com/pawansatoshi/BuilderPass/actions/workflows/ci.yml)
[![YouTube](https://img.shields.io/badge/YouTube-Pawan%20Satoshi-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@PawanSatoshi)

## 🎥 Product Demo

### Watch BuilderPass in action

<a href="https://www.youtube.com/watch?v=1FeeqEIcfU4">
  <img src="https://img.youtube.com/vi/1FeeqEIcfU4/maxresdefault.jpg" alt="GIWA Builder Passport demo — Pawan Satoshi" width="900" />
</a>

**▶ [Watch the full BuilderPass demo on YouTube](https://www.youtube.com/watch?v=1FeeqEIcfU4)**

> GitHub README pages do not reliably render external YouTube iframe players. The thumbnail above is the reliable GitHub-native experience; the live application includes an in-page playable YouTube walkthrough.

## Product experience

The live BuilderPass application is designed to communicate the protocol visually, not just through static documentation.

- **Animated architecture flow** — Wallet → Passport → Evidence → Builder Graph → Agents.
- **Interactive demo video** — the YouTube walkthrough can be played directly inside the live product.
- **Creator link UX** — Pawan Satoshi's YouTube channel is available as a compact branded action beside/over the demo without interrupting playback.
- **Voice guide** — optional browser-native narration explains the BuilderPass architecture and verification model.
- **Multilingual UX** — English, Korean and Hindi are available from the global navigation; the language preference persists locally.
- **Technical Overview** — a normal product route (`/technical`) explains architecture, verification and GIWA ecosystem fit without a special “judge mode”.
- **Responsive navigation** — Passport, Technical Overview and Developer Resources are accessible on desktop and mobile.
- **Reduced-motion support** — CSS respects `prefers-reduced-motion` for accessibility.
- **Proof-first UX** — the visual story leads into the actual smart contract and explorer evidence.

## Origin & ecosystem

**Built from India 🇮🇳 · Built for GIWA 🇰🇷 · Designed for global builders 🌍**

BuilderPass is an independent builder project and does not claim employment, partnership, endorsement or sponsorship by GIWA, Dunamu or Upbit.

GIWA's official site describes GIWA as a Web3 infrastructure ecosystem powered by/with Upbit-related infrastructure, and GASOK explicitly evaluates GIWA chain fit and potential GIWA Wallet integration. BuilderPass uses that public ecosystem context to design a wallet-ready identity primitive; any future GIWA Wallet or Upbit integration would require official approval. citeturn0search0turn0search2

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
- **Public smart-contract evidence** — the deployed contract, deployment transaction and explorer history are directly accessible.
- **Explorer evidence** — direct GIWA Sepolia Blockscout links for wallet, contract, transactions and token instance.
- **Lifecycle metadata** — profile version, mint timestamp and update timestamp are surfaced from contract state.
- **Builder portfolio layer** — projects can be presented as evidence without converting them into an arbitrary score.
- **Technical Overview** — architecture, design decisions, live proof and ecosystem-fit explanation in one public route.
- **GIWA ecosystem fit** — explicit explanation of GIWA-native deployment and future wallet-readiness without claiming an integration that does not yet exist.
- **Interactive architecture storytelling** — animated identity-to-agent flow on the landing page.
- **Playable product walkthrough** — embedded YouTube demo inside the live application.
- **Optional voice narration** — browser-native guided explanation for the product story.
- **Multilingual navigation** — English, Korean and Hindi.
- **Mobile-friendly interface** — responsive UI, transaction status, copy actions and explicit receipts.
- **Automated engineering checks** — GitHub Actions compiles the contract, runs contract tests, lints the frontend and builds the application.

## 🔐 Smart Contract & On-chain Proof

| Field | Value |
|---|---|
| Network | **GIWA Sepolia** |
| Chain ID | `91342` |
| Contract | `BuilderPassport` |
| Contract address | [`0x36Dae8dCFf051f301D5e02a37d203b9f7DB93142`](https://sepolia-explorer.giwa.io/address/0x36Dae8dCFf051f301D5e02a37d203b9f7DB93142) |
| Deployment transaction | [`0xd259a13743cbc2a4935f58a58a153a65711357025a9232c5f48f3706cdd96142`](https://sepolia-explorer.giwa.io/tx/0xd259a13743cbc2a4935f58a58a153a65711357025a9232c5f48f3706cdd96142) |
| Source | Solidity `0.8.30` |
| Contract design | Soulbound ERC-721 + on-chain profile struct |

The contract was deployed through Remix and tested live for minting, `getPassportByAddress()`, profile updates and expected soulbound transfer rejection. The public explorer links provide an independent verification path for the deployed contract and transaction history.

### Proof trail

```text
Builder wallet
     │
     ▼
BuilderPassport contract
     │
     ├── Passport ID
     ├── Name / Bio
     ├── Skills
     ├── GitHub / X / Website
     ├── Profile version
     └── Mint / update timestamps
     │
     ▼
GIWA Sepolia Blockscout
```

**Design principle:** evidence first, reputation second.

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

## Why BuilderPass fits GIWA

GASOK currently lists GIWA chain fit, originality, feasibility, market potential, team capability and potential for GIWA Wallet integration among its selection criteria. Its later productization phase emphasizes UI/UX quality, early user evidence and long-term sustainability. citeturn0search0

BuilderPass is designed around those principles:

1. **GIWA-native deployment** — the identity primitive is deployed directly on GIWA Sepolia.
2. **Real product, not only a concept** — mint, public profile, edit flow and verification are implemented.
3. **Public proof** — the contract and deployment transaction are independently inspectable.
4. **Lower onboarding friction** — a builder can understand the product before connecting a wallet.
5. **Ecosystem utility** — the passport is designed as a reusable identity primitive rather than a one-off profile page.
6. **Wallet-ready direction** — the architecture can naturally surface a builder identity through future wallet experiences, without claiming that such integration already exists.
7. **Strong demo surface** — animation, playable walkthrough, optional voice narration and an evidence-first product story make the technical architecture easier to understand quickly.

## Builder portfolio examples

The current profile presentation can connect to real builder evidence such as:

- **ARCTIS** — AI, programmable money and economic-agent architecture.
- **Veridex** — evidence-first on-chain intelligence / Telegraph work.
- **FactAnchor** — web-grounded Intelligent Contract and validator consensus.
- **GIWA Builder Passport** — this identity primitive.

These links are evidence references, not claims of employment, partnership or official endorsement.

## Future direction — from passport to builder graph

The next logical layer is a **builder graph**:

1. **Identity** — portable wallet-bound builder identity.
2. **Credentials** — attestations for skills, programs and capabilities.
3. **Reputation** — evidence-weighted signals rather than a single opaque score.
4. **Builder Graph** — machine-readable relationships between builders, projects and contributions.
5. **Agent-readable identity** — autonomous agents and applications can consume verifiable builder evidence when selecting collaborators or capabilities.

This keeps the project focused on builder identity while making it extensible toward the emerging **agentic economy**.

### Long-term GIWA use cases

- ecosystem contributor directories
- hackathon and program credentials
- verified builder profiles
- project contribution proofs
- permissionless builder discovery
- ecosystem reputation built from attestations
- machine-readable builder capabilities for future AI agents

## 🧭 Phase-3 / Evaluator checklist

| Evaluation signal | BuilderPass evidence |
|---|---|
| Working MVP | Mint + public profile + edit flow |
| GIWA deployment | GIWA Sepolia contract |
| Public smart contract | Explorer-linked contract |
| Technical depth | Solidity + React + Wagmi/Viem architecture |
| Verifiability | On-chain proof trail + transaction links |
| UX | Mobile-first, wallet guards, receipts, copy/share actions |
| Interactive demo | Animation + playable YouTube walkthrough + optional voice guide |
| Localization | English + Korean + Hindi navigation |
| Ecosystem utility | Portable builder identity primitive |
| GIWA fit | GIWA-native deployment + wallet-ready design direction |
| Extensibility | Credentials → reputation → builder graph → agents |
| Engineering quality | Automated compile, test, lint and build checks |

## Development

```bash
npm ci
npm run contracts:compile
npm run contracts:test
npm run lint --workspace=app
npm run build
```

The repository is designed to work with GitHub Codespaces and can be deployed to Vercel using the included root configuration.

## Repository structure

See:

- `ARCHITECTURE.md` — design decisions and system model.
- `ROADMAP.md` — milestone and future direction.
- `CLAUDE.md` — project memory and implementation notes.
- `app/src/components/AnimatedBuilderFlow.tsx` — animated identity-to-agent architecture.
- `app/src/components/DemoShowcase.tsx` — in-app YouTube walkthrough and channel UX.
- `app/src/components/VoiceGuide.tsx` — optional browser-native product narration.
- `app/src/components/LanguageSelector.tsx` — English/Korean/Hindi selector.
- `app/src/components/BuilderProof.tsx` — evaluator-friendly verification layer.
- `app/src/components/BuilderPortfolio.tsx` — evidence/portfolio presentation.
- `app/src/pages/TechnicalOverviewPage.tsx` — technical and GIWA ecosystem overview.
- `.github/workflows/ci.yml` — automated engineering checks.

## Status

**MVP complete and deployed to GIWA Sepolia.** The current iteration focuses on making the submitted product easier to understand, independently verify and extend without changing the core identity contract.

---

<div align="center">

**Built from India 🇮🇳 · Built for GIWA 🇰🇷 · Designed for global builders 🌍**

**PAWAN UPADHYAY**  
[@pawansatoshi](https://github.com/pawansatoshi)

[![YouTube](https://img.shields.io/badge/YouTube-Pawan%20Satoshi-FF0000?style=flat-square&logo=youtube&logoColor=white)](https://youtube.com/@PawanSatoshi)

</div>
