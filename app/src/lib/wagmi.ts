import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { giwaSepolia } from "./chains";

/**
 * Single-chain config: GIWA Builder Passport only ever targets GIWA Sepolia
 * for MVP. Keeping this to one chain avoids a whole class of "wrong network"
 * UX and contract-address-per-chain bugs we don't need to solve yet.
 *
 * WalletConnect/Reown projectId: required by RainbowKit for its QR-code /
 * WalletConnect-protocol wallet connections (injected browser wallets like
 * MetaMask/Rabby don't strictly need it, but RainbowKit still expects a
 * value to initialize). Unlike an API secret, a WalletConnect projectId is
 * a public client identifier — it's meant to ship in frontend bundles and
 * is visible in any deployed app's JS anyway, so committing a real default
 * here (rather than the empty string used before) is the correct choice,
 * not a security issue. It still comes from the `VITE_WALLETCONNECT_PROJECT_ID`
 * env var first if one is set, so a different project ID can be swapped in
 * without touching this file.
 */
const DEFAULT_WALLETCONNECT_PROJECT_ID = "a0031066837361c93d02ae2f139acc98";

export const wagmiConfig = getDefaultConfig({
  appName: "GIWA Builder Passport",
  projectId:
    import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ??
    DEFAULT_WALLETCONNECT_PROJECT_ID,
  chains: [giwaSepolia],
  ssr: false,
});
