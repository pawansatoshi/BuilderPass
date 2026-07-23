/**
 * Contract wiring for BuilderPassport.sol on GIWA Sepolia.
 *
 * BuilderPassport.sol was deployed manually via Remix IDE (Injected
 * Provider, Rabby Wallet) rather than a Hardhat deploy script — see
 * CLAUDE.md / ROADMAP.md for the full Milestone 2 deployment record.
 *
 * Deployed address: 0x36Dae8dCFf051f301D5e02a37d203b9f7DB93142
 * Deployment tx:     0xd259a13743cbc2a4935f58a58a153a65711357025a9232c5f48f3706cdd96142
 *
 * The address below is the default so the frontend works out of the box
 * against the current live deployment. `VITE_BUILDER_PASSPORT_ADDRESS` can
 * still override it (e.g. once a future Hardhat-scripted redeploy replaces
 * this one) without touching this file.
 *
 * Note: this address was provided directly and has not been independently
 * re-verified against the GIWA Sepolia explorer in this delivery — confirm
 * it at https://sepolia-explorer.giwa.io if that matters for your use case.
 */
const DEPLOYED_BUILDER_PASSPORT_ADDRESS: `0x${string}` =
  "0x36Dae8dCFf051f301D5e02a37d203b9f7DB93142";

export const BUILDER_PASSPORT_ADDRESS = (import.meta.env
  .VITE_BUILDER_PASSPORT_ADDRESS as `0x${string}` | undefined) ??
  DEPLOYED_BUILDER_PASSPORT_ADDRESS;

/**
 * ABI exported directly from the Remix deployment (Solidity 0.8.30,
 * OpenZeppelin v5 ERC721 base + BuilderPassport's own functions/errors/
 * events). Declared `as const` so wagmi/viem can infer precise argument and
 * return types for every read/write hook — this is what makes
 * `useReadContract`/`useWriteContract` calls elsewhere in the app fully
 * typed instead of falling back to `any`.
 *
 * Includes several inherited OpenZeppelin ERC721 members that this contract
 * doesn't actively use but which remain callable since they're part of the
 * standard (documented here so nobody's surprised by them in the ABI):
 *   - `approve` / `setApprovalForAll`: present in the ABI, but both are
 *     overridden in the contract to unconditionally revert with
 *     `SoulboundTokenNonTransferable` (note their `stateMutability` is
 *     `pure` below, which reflects that override).
 *   - `transferFrom` / `safeTransferFrom`: present, but any transfer attempt
 *     (including by the owner) reverts the same way, via the `_update`
 *     override — see BuilderPassport.sol for details.
 *   - `tokenURI`: inherited from ERC721; this contract never sets one, so
 *     it will return an empty string for every token. Don't wire this up as
 *     a metadata source — use `getPassport`/`getPassportByAddress` instead,
 *     which read the actual on-chain struct.
 */
export const BUILDER_PASSPORT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "builder",
        "type": "address"
      }
    ],
    "name": "AlreadyMinted",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "maxLength",
        "type": "uint256"
      }
    ],
    "name": "BioTooLong",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ERC721IncorrectOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ERC721InsufficientApproval",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidOperator",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ERC721NonexistentToken",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "maxLength",
        "type": "uint256"
      }
    ],
    "name": "GithubTooLong",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "maxLength",
        "type": "uint256"
      }
    ],
    "name": "NameTooLong",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "caller",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "NotPassportOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "PassportDoesNotExist",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SoulboundTokenNonTransferable",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "maxLength",
        "type": "uint256"
      }
    ],
    "name": "WebsiteTooLong",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "maxLength",
        "type": "uint256"
      }
    ],
    "name": "XTooLong",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "bio_",
        "type": "string"
      },
      {
        "internalType": "bytes32[5]",
        "name": "skills_",
        "type": "bytes32[5]"
      },
      {
        "internalType": "string",
        "name": "github_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "x_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "website_",
        "type": "string"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "builder",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "mintedAt",
        "type": "uint64"
      }
    ],
    "name": "PassportMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "builder",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "updatedAt",
        "type": "uint64"
      }
    ],
    "name": "ProfileUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "bio_",
        "type": "string"
      },
      {
        "internalType": "bytes32[5]",
        "name": "skills_",
        "type": "bytes32[5]"
      },
      {
        "internalType": "string",
        "name": "github_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "x_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "website_",
        "type": "string"
      }
    ],
    "name": "updateProfile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "CONTRACT_VERSION",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "CURRENT_DATA_VERSION",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getPassport",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint16",
            "name": "version",
            "type": "uint16"
          },
          {
            "internalType": "uint64",
            "name": "mintedAt",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "updatedAt",
            "type": "uint64"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "bio",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "github",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "x",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "website",
            "type": "string"
          },
          {
            "internalType": "bytes32[5]",
            "name": "skills",
            "type": "bytes32[5]"
          }
        ],
        "internalType": "struct BuilderPassport.BuilderPassportData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "builder",
        "type": "address"
      }
    ],
    "name": "getPassportByAddress",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint16",
            "name": "version",
            "type": "uint16"
          },
          {
            "internalType": "uint64",
            "name": "mintedAt",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "updatedAt",
            "type": "uint64"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "bio",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "github",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "x",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "website",
            "type": "string"
          },
          {
            "internalType": "bytes32[5]",
            "name": "skills",
            "type": "bytes32[5]"
          }
        ],
        "internalType": "struct BuilderPassport.BuilderPassportData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "builder",
        "type": "address"
      }
    ],
    "name": "hasMinted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_BIO_LENGTH",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_HANDLE_LENGTH",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_NAME_LENGTH",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_SKILLS",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_WEBSITE_LENGTH",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "builder",
        "type": "address"
      }
    ],
    "name": "tokenIdOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
