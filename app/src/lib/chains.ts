import { defineChain } from "viem";

/**
 * GIWA Sepolia (testnet) chain definition.
 *
 * Source: https://docs.giwa.io/giwa-chain/en/get-started/connect-to-giwa
 * Verified: 2026-07-21. Re-check this page before relying on these values for
 * anything beyond local development — a young OP Stack testnet's endpoints
 * can change.
 *
 * Note: the public RPC below is explicitly documented by GIWA as
 * "rate-limited and should not be used in production." It's fine for this
 * MVP/testnet submission; swap in a dedicated RPC provider before any
 * higher-traffic use.
 */
export const giwaSepolia = defineChain({
  id: 91342,
  name: "Giwa Sepolia",
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia-rpc.giwa.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Giwa Sepolia Explorer",
      url: "https://sepolia-explorer.giwa.io",
      apiUrl: "https://sepolia-explorer.giwa.io/api",
    },
  },
  testnet: true,
});
