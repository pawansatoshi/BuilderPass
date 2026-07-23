import type { HardhatUserConfig } from "hardhat/config";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import "dotenv/config";

/**
 * GIWA Sepolia network configuration, sourced from official GIWA docs
 * (https://docs.giwa.io/giwa-chain/en/get-started/connect-to-giwa) as of 2026-07-21.
 *
 * Chain ID: 91342
 * RPC: https://sepolia-rpc.giwa.io (rate-limited, fine for testnet/dev use)
 * Explorer: https://sepolia-explorer.giwa.io (Blockscout-based)
 *
 * Re-verify these values against docs.giwa.io before any production-critical deploy —
 * endpoints on a young testnet can change.
 */
const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin, hardhatVerify],
  solidity: {
    profiles: {
      default: {
        version: "0.8.30",
      },
      production: {
        version: "0.8.30",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    giwaSepolia: {
      type: "http",
      chainType: "op",
      url: process.env.GIWA_SEPOLIA_RPC_URL ?? "https://sepolia-rpc.giwa.io",
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
    },
  },
  chainDescriptors: {
    91342: {
      name: "Giwa Sepolia",
      blockExplorers: {
        blockscout: {
          name: "Giwa Sepolia Explorer",
          url: "https://sepolia-explorer.giwa.io",
          apiUrl: "https://sepolia-explorer.giwa.io/api",
        },
      },
    },
  },
};

export default config;
