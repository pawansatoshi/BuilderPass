import { describe, it } from "node:test";
import assert from "node:assert/strict";
import hre from "hardhat";
import { getAddress, stringToHex, zeroAddress, type Hex } from "viem";

const { viem, networkHelpers } = await hre.network.create();
const { loadFixture } = networkHelpers;

// A zero-filled bytes32, used to represent an empty skill slot.
const ZERO_SKILL = ("0x" + "00".repeat(32)) as Hex;

/** Encodes a short skill tag (<=32 ASCII bytes) as a right-padded bytes32. */
function skill(tag: string): Hex {
  return stringToHex(tag, { size: 32 });
}

/** Builds a full 5-element skills array, padding unused slots with ZERO_SKILL. */
function skillsArray(tags: string[]): [Hex, Hex, Hex, Hex, Hex] {
  const filled = tags.map(skill);
  while (filled.length < 5) filled.push(ZERO_SKILL);
  return filled.slice(0, 5) as [Hex, Hex, Hex, Hex, Hex];
}

const SAMPLE_PROFILE = {
  name: "Ada Lovelace",
  bio: "Builder exploring GIWA and OP Stack tooling.",
  skills: skillsArray(["Solidity", "React", "Viem"]),
  github: "adalovelace",
  x: "ada",
  website: "https://ada.dev",
};

async function deployBuilderPassportFixture() {
  const builderPassport = await viem.deployContract("BuilderPassport");
  const [deployer, alice, bob] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();
  return { builderPassport, deployer, alice, bob, publicClient };
}

describe("BuilderPassport", () => {
  // -----------------------------------------------------------------------
  // Deployment / constants
  // -----------------------------------------------------------------------
  describe("Deployment", () => {
    it("sets the correct ERC-721 name and symbol", async () => {
      const { builderPassport } = await loadFixture(deployBuilderPassportFixture);
      assert.equal(await builderPassport.read.name(), "GIWA Builder Passport");
      assert.equal(await builderPassport.read.symbol(), "GIWABP");
    });

    it("exposes the expected constants", async () => {
      const { builderPassport } = await loadFixture(deployBuilderPassportFixture);
      assert.equal(await builderPassport.read.CONTRACT_VERSION(), "1.0.0");
      assert.equal(await builderPassport.read.CURRENT_DATA_VERSION(), 1);
      assert.equal(await builderPassport.read.MAX_NAME_LENGTH(), 64n);
      assert.equal(await builderPassport.read.MAX_BIO_LENGTH(), 280n);
      assert.equal(await builderPassport.read.MAX_HANDLE_LENGTH(), 64n);
      assert.equal(await builderPassport.read.MAX_WEBSITE_LENGTH(), 256n);
      assert.equal(await builderPassport.read.MAX_SKILLS(), 5);
    });

    it("starts with zero total supply", async () => {
      const { builderPassport } = await loadFixture(deployBuilderPassportFixture);
      assert.equal(await builderPassport.read.totalSupply(), 0n);
    });

    it("supports the ERC-721 and ERC-165 interfaces", async () => {
      const { builderPassport } = await loadFixture(deployBuilderPassportFixture);
      assert.equal(await builderPassport.read.supportsInterface(["0x80ac58cd"]), true); // ERC721
      assert.equal(await builderPassport.read.supportsInterface(["0x01ffc9a7"]), true); // ERC165
      assert.equal(await builderPassport.read.supportsInterface(["0xffffffff"]), false); // invalid
    });
  });

  // -----------------------------------------------------------------------
  // Minting
  // -----------------------------------------------------------------------
  describe("mint()", () => {
    it("mints tokenId 1 to the caller and emits PassportMinted", async () => {
      const { builderPassport, alice } = await loadFixture(deployBuilderPassportFixture);
      const aliceAddress = getAddress(alice.account.address);

      await viem.assertions.emitWithArgs(
        builderPassport.write.mint(
          [
            SAMPLE_PROFILE.name,
            SAMPLE_PROFILE.bio,
            SAMPLE_PROFILE.skills,
            SAMPLE_PROFILE.github,
            SAMPLE_PROFILE.x,
            SAMPLE_PROFILE.website,
          ],
          { account: alice.account }
        ),
        builderPassport,
        "PassportMinted",
        [aliceAddress, 1n, (v: bigint) => v > 0n]
      );

      assert.equal(await builderPassport.read.ownerOf([1n]), aliceAddress);
      assert.equal(await builderPassport.read.balanceOf([aliceAddress]), 1n);
      assert.equal(await builderPassport.read.totalSupply(), 1n);
      assert.equal(await builderPassport.read.hasMinted([aliceAddress]), true);
      assert.equal(await builderPassport.read.tokenIdOf([aliceAddress]), 1n);
    });

    it("emits the standard ERC-721 Transfer event from the zero address", async () => {
      const { builderPassport, alice } = await loadFixture(deployBuilderPassportFixture);
      const aliceAddress = getAddress(alice.account.address);

      await viem.assertions.emitWithArgs(
        builderPassport.write.mint(
          [
            SAMPLE_PROFILE.name,
            SAMPLE_PROFILE.bio,
            SAMPLE_PROFILE.skills,
            SAMPLE_PROFILE.github,
            SAMPLE_PROFILE.x,
            SAMPLE_PROFILE.website,
          ],
          { account: alice.account }
        ),
        builderPassport,
        "Transfer",
        [zeroAddress, aliceAddress, 1n]
      );
    });

    it("stores all profile fields correctly, with version/mintedAt/updatedAt set", async () => {
      const { builderPassport, alice, publicClient } = await loadFixture(
        deployBuilderPassportFixture
      );
      const hash = await builderPassport.write.mint(
        [
          SAMPLE_PROFILE.name,
          SAMPLE_PROFILE.bio,
          SAMPLE_PROFILE.skills,
          SAMPLE_PROFILE.github,
          SAMPLE_PROFILE.x,
          SAMPLE_PROFILE.website,
        ],
        { account: alice.account }
      );
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      const block = await publicClient.getBlock({ blockNumber: receipt.blockNumber });

      const passport = await builderPassport.read.getPassport([1n]);

      assert.equal(passport.version, 1);
      assert.equal(passport.mintedAt, block.timestamp);
      assert.equal(passport.updatedAt, block.timestamp);
      assert.equal(passport.name, SAMPLE_PROFILE.name);
      assert.equal(passport.bio, SAMPLE_PROFILE.bio);
      assert.equal(passport.github, SAMPLE_PROFILE.github);
      assert.equal(passport.x, SAMPLE_PROFILE.x);
      assert.equal(passport.website, SAMPLE_PROFILE.website);
      assert.deepEqual(passport.skills, SAMPLE_PROFILE.skills);
    });

    it("is retrievable identically via getPassportByAddress", async () => {
      const { builderPassport, alice } = await loadFixture(deployBuilderPassportFixture);
      await builderPassport.write.mint(
        [
          SAMPLE_PROFILE.name,
          SAMPLE_PROFILE.bio,
          SAMPLE_PROFILE.skills,
          SAMPLE_PROFILE.github,
          SAMPLE_PROFILE.x,
          SAMPLE_PROFILE.website,
        ],
        { account: alice.account }
      );
      const byToken = await builderPassport.read.getPassport([1n]);
      const byAddress = await builderPassport.read.getPassportByAddress([
        getAddress(alice.account.address),
      ]);
      assert.deepEqual(byToken, byAddress);
    });

    it("assigns sequential tokenIds across different wallets", async () => {
      const { builderPassport, alice, bob } = await loadFixture(deployBuilderPassportFixture);
      await builderPassport.write.mint(
        [
          SAMPLE_PROFILE.name,
          SAMPLE_PROFILE.bio,
          SAMPLE_PROFILE.skills,
          SAMPLE_PROFILE.github,
          SAMPLE_PROFILE.x,
          SAMPLE_PROFILE.website,
        ],
        { account: alice.account }
      );
      await builderPassport.write.mint(
        ["Bob Builder", "Also building on GIWA.", skillsArray(["Rust"]), "bobbuilder", "bob", "https://bob.dev"],
        { account: bob.account }
      );

      assert.equal(await builderPassport.read.tokenIdOf([getAddress(alice.account.address)]), 1n);
      assert.equal(await builderPassport.read.tokenIdOf([getAddress(bob.account.address)]), 2n);
      assert.equal(await builderPassport.read.totalSupply(), 2n);
    });

    it("reverts with AlreadyMinted on a second mint from the same wallet", async () => {
      const { builderPassport, alice } = await loadFixture(deployBuilderPassportFixture);
      const aliceAddress = getAddress(alice.account.address);
      const mintArgs = [
        SAMPLE_PROFILE.name,
        SAMPLE_PROFILE.bio,
        SAMPLE_PROFILE.skills,
        SAMPLE_PROFILE.github,
        SAMPLE_PROFILE.x,
        SAMPLE_PROFILE.website,
      ] as const;

      await builderPassport.write.mint(mintArgs, { account: alice.account });

      await viem.assertions.revertWithCustomErrorWithArgs(
        builderPassport.write.mint(mintArgs, { account: alice.account }),
        builderPassport,
        "AlreadyMinted",
        [aliceAddress]
      );
    });

    it("accepts fields at exactly their length caps", async () => {
      const { builderPassport, alice } = await loadFixture(deployBuilderPassportFixture);
      const maxName = "n".repeat(64);
      const maxBio = "b".repeat(280);
      const maxHandle = "h".repeat(64);
      const maxWebsite = "w".repeat(256);

      await builderPassport.write.mint(
        [maxName, maxBio, skillsArray(["Solidity"]), maxHandle, maxHandle, maxWebsite],
        { account: alice.account }
      );

      const passport = await builderPassport.read.getPassport([1n]);
      assert.equal(passport.name, maxName);
      assert.equal(passport.bio, maxBio);
      assert.equal(passport.github, maxHandle);
      assert.equal(passport.x, maxHandle);
      assert.equal(passport.website, maxWebsite);
    });

    it("reverts with NameTooLong when name exceeds MAX_NAME_LENGTH", async () => {
      const { builderPassport, alice } = await loadFixture(deployBuilderPassportFixture);
      await viem.assertions.revertWithCustomErrorWithArgs(
        builderPassport.write.mint(
          ["n".repeat(65), SAMPLE_PROFILE.bio, SAMPLE_PROFILE.skills, SAMPLE_PROFILE.github, SAMPLE_PROFILE.x, SAMPLE_PROFILE.website],
          { account: alice.account }
        ),
        builderPassport,
        "NameTooLong",
        [64n]
      );
    });

    it("reverts with BioTooLong when bio exceeds MAX_BIO_LENGTH", async () => {
      const { builderPassport, alice } = await loadFixture(deployBuilderPassportFixture);
      await viem.assertions.revertWithCustomErrorWithArgs(
        builderPassport.write.mint(
          [SAMPLE_PROFILE.name, "b".repeat(281), SAMPLE_PROFILE.skills, SAMPLE_PROFILE.github, SAMPLE_PROFILE.x, SAMPLE_PROFILE.website],
          { account: alice.account }
        ),
        builderPassport,
        "BioTooLong",
        [280n]
      );
    });

    it("reverts with GithubTooLong when github exceeds MAX_HANDLE_LENGTH", async () => {
      const { builderPassport, alice } = await loadFixture(deployBuilderPassportFixture);
      await viem.assertions.revertWithCustomErrorWithArgs(
        builderPassport.write.mint(
          [SAMPLE_PROFILE.name, SAMPLE_PROFILE.bio, SAMPLE_PROFILE.skills, "g".repeat(65), SAMPLE_PROFILE.x, SAMPLE_PROFILE.website],
          { account: alice.account }
        ),
        builderPassport,
        "GithubTooLong",
        [64n]
      );
    });

    it("reverts with XTooLong when x exceeds MAX_HANDLE_LENGTH", async () => {
      const { builderPassport, alice } = await loadFixture(deployBuilderPassportFixture);
      await viem.assertions.revertWithCustomErrorWithArgs(
        builderPassport.write.mint(
          [SAMPLE_PROFILE.name, SAMPLE_PROFILE.bio, SAMPLE_PROFILE.skills, SAMPLE_PROFILE.github, "x".repeat(65), SAMPLE_PROFILE.website],
          { account: alice.account }
        ),
        builderPassport,
        "XTooLong",
        [64n]
      );
    });

    it("reverts with WebsiteTooLong when website exceeds MAX_WEBSITE_LENGTH", async () => {
      const { builderPassport, alice } = await loadFixture(deployBuilderPassportFixture);
      await viem.assertions.revertWithCustomErrorWithArgs(
        builderPassport.write.mint(
          [SAMPLE_PROFILE.name, SAMPLE_PROFILE.bio, SAMPLE_PROFILE.skills, SAMPLE_PROFILE.github, SAMPLE_PROFILE.x, "w".repeat(257)],
          { account: alice.account }
        ),
        builderPassport,
        "WebsiteTooLong",
        [256n]
      );
    });
  });

  // -----------------------------------------------------------------------
  // Updating
  // -----------------------------------------------------------------------
  describe("updateProfile()", () => {
    async function mintedFixture() {
      const base = await deployBuilderPassportFixture();
      await base.builderPassport.write.mint(
        [
          SAMPLE_PROFILE.name,
          SAMPLE_PROFILE.bio,
          SAMPLE_PROFILE.skills,
          SAMPLE_PROFILE.github,
          SAMPLE_PROFILE.x,
          SAMPLE_PROFILE.website,
        ],
        { account: base.alice.account }
      );
      return base;
    }

    it("lets the owner update their profile and emits ProfileUpdated", async () => {
      const { builderPassport, alice } = await loadFixture(mintedFixture);
      const aliceAddress = getAddress(alice.account.address);

      await viem.assertions.emitWithArgs(
        builderPassport.write.updateProfile(
          ["Ada L.", "Updated bio.", skillsArray(["Solidity", "Hardhat"]), "ada-gh", "ada-x", "https://ada.dev/new"],
          { account: alice.account }
        ),
        builderPassport,
        "ProfileUpdated",
        [1n, aliceAddress, (v: bigint) => v > 0n]
      );

      const passport = await builderPassport.read.getPassport([1n]);
      assert.equal(passport.name, "Ada L.");
      assert.equal(passport.bio, "Updated bio.");
      assert.equal(passport.github, "ada-gh");
      assert.equal(passport.x, "ada-x");
      assert.equal(passport.website, "https://ada.dev/new");
    });

    it("keeps version and mintedAt unchanged, and advances updatedAt", async () => {
      const { builderPassport, alice, publicClient } = await loadFixture(mintedFixture);
      const before = await builderPassport.read.getPassport([1n]);

      await networkHelpers.time.increase(60);

      const hash = await builderPassport.write.updateProfile(
        ["Ada L.", "Updated bio.", SAMPLE_PROFILE.skills, "ada-gh", "ada-x", "https://ada.dev/new"],
        { account: alice.account }
      );
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      const block = await publicClient.getBlock({ blockNumber: receipt.blockNumber });

      const after = await builderPassport.read.getPassport([1n]);
      assert.equal(after.version, before.version);
      assert.equal(after.mintedAt, before.mintedAt);
      assert.equal(after.updatedAt, block.timestamp);
      assert.ok(after.updatedAt > before.updatedAt);
    });

    it("reverts with PassportDoesNotExist for a wallet with no passport", async () => {
      const { builderPassport, bob } = await loadFixture(deployBuilderPassportFixture);
      await viem.assertions.revertWithCustomErrorWithArgs(
        builderPassport.write.updateProfile(
          [
            SAMPLE_PROFILE.name,
            SAMPLE_PROFILE.bio,
            SAMPLE_PROFILE.skills,
            SAMPLE_PROFILE.github,
            SAMPLE_PROFILE.x,
            SAMPLE_PROFILE.website,
          ],
          { account: bob.account }
        ),
        builderPassport,
        "PassportDoesNotExist",
        [0n]
      );
    });

    it("enforces the same field length caps as mint()", async () => {
      const { builderPassport, alice } = await loadFixture(mintedFixture);
      await viem.assertions.revertWithCustomErrorWithArgs(
        builderPassport.write.updateProfile(
          ["n".repeat(65), SAMPLE_PROFILE.bio, SAMPLE_PROFILE.skills, SAMPLE_PROFILE.github, SAMPLE_PROFILE.x, SAMPLE_PROFILE.website],
          { account: alice.account }
        ),
        builderPassport,
        "NameTooLong",
        [64n]
      );
      await viem.assertions.revertWithCustomErrorWithArgs(
        builderPassport.write.updateProfile(
          [SAMPLE_PROFILE.name, "b".repeat(281), SAMPLE_PROFILE.skills, SAMPLE_PROFILE.github, SAMPLE_PROFILE.x, SAMPLE_PROFILE.website],
          { account: alice.account }
        ),
        builderPassport,
        "BioTooLong",
        [280n]
      );
      await viem.assertions.revertWithCustomErrorWithArgs(
        builderPassport.write.updateProfile(
          [SAMPLE_PROFILE.name, SAMPLE_PROFILE.bio, SAMPLE_PROFILE.skills, "g".repeat(65), SAMPLE_PROFILE.x, SAMPLE_PROFILE.website],
          { account: alice.account }
        ),
        builderPassport,
        "GithubTooLong",
        [64n]
      );
      await viem.assertions.revertWithCustomErrorWithArgs(
        builderPassport.write.updateProfile(
          [SAMPLE_PROFILE.name, SAMPLE_PROFILE.bio, SAMPLE_PROFILE.skills, SAMPLE_PROFILE.github, "x".repeat(65), SAMPLE_PROFILE.website],
          { account: alice.account }
        ),
        builderPassport,
        "XTooLong",
        [64n]
      );
      await viem.assertions.revertWithCustomErrorWithArgs(
        builderPassport.write.updateProfile(
          [SAMPLE_PROFILE.name, SAMPLE_PROFILE.bio, SAMPLE_PROFILE.skills, SAMPLE_PROFILE.github, SAMPLE_PROFILE.x, "w".repeat(257)],
          { account: alice.account }
        ),
        builderPassport,
        "WebsiteTooLong",
        [256n]
      );
    });
  });

  // -----------------------------------------------------------------------
  // Soulbound enforcement
  // -----------------------------------------------------------------------
  describe("Soulbound behavior", () => {
    async function mintedFixture() {
      const base = await deployBuilderPassportFixture();
      await base.builderPassport.write.mint(
        [
          SAMPLE_PROFILE.name,
          SAMPLE_PROFILE.bio,
          SAMPLE_PROFILE.skills,
          SAMPLE_PROFILE.github,
          SAMPLE_PROFILE.x,
          SAMPLE_PROFILE.website,
        ],
        { account: base.alice.account }
      );
      return base;
    }

    it("reverts on transferFrom, even from the owner", async () => {
      const { builderPassport, alice, bob } = await loadFixture(mintedFixture);
      await viem.assertions.revertWithCustomError(
        builderPassport.write.transferFrom(
          [getAddress(alice.account.address), getAddress(bob.account.address), 1n],
          { account: alice.account }
        ),
        builderPassport,
        "SoulboundTokenNonTransferable"
      );
    });

    it("reverts on safeTransferFrom, even from the owner", async () => {
      const { builderPassport, alice, bob } = await loadFixture(mintedFixture);
      await viem.assertions.revertWithCustomError(
        builderPassport.write.safeTransferFrom(
          [getAddress(alice.account.address), getAddress(bob.account.address), 1n],
          { account: alice.account }
        ),
        builderPassport,
        "SoulboundTokenNonTransferable"
      );
    });

    it("reverts on approve", async () => {
      const { builderPassport, alice, bob } = await loadFixture(mintedFixture);
      await viem.assertions.revertWithCustomError(
        builderPassport.write.approve([getAddress(bob.account.address), 1n], {
          account: alice.account,
        }),
        builderPassport,
        "SoulboundTokenNonTransferable"
      );
    });

    it("reverts on setApprovalForAll", async () => {
      const { builderPassport, alice, bob } = await loadFixture(mintedFixture);
      await viem.assertions.revertWithCustomError(
        builderPassport.write.setApprovalForAll([getAddress(bob.account.address), true], {
          account: alice.account,
        }),
        builderPassport,
        "SoulboundTokenNonTransferable"
      );
    });
  });

  // -----------------------------------------------------------------------
  // View function edge cases
  // -----------------------------------------------------------------------
  describe("View functions on nonexistent passports", () => {
    it("getPassport reverts with PassportDoesNotExist for an unminted tokenId", async () => {
      const { builderPassport } = await loadFixture(deployBuilderPassportFixture);
      await viem.assertions.revertWithCustomErrorWithArgs(
        builderPassport.read.getPassport([1n]),
        builderPassport,
        "PassportDoesNotExist",
        [1n]
      );
    });

    it("getPassportByAddress reverts with PassportDoesNotExist for a wallet with no passport", async () => {
      const { builderPassport, bob } = await loadFixture(deployBuilderPassportFixture);
      await viem.assertions.revertWithCustomErrorWithArgs(
        builderPassport.read.getPassportByAddress([getAddress(bob.account.address)]),
        builderPassport,
        "PassportDoesNotExist",
        [0n]
      );
    });

    it("hasMinted and tokenIdOf reflect the un-minted state correctly", async () => {
      const { builderPassport, bob } = await loadFixture(deployBuilderPassportFixture);
      const bobAddress = getAddress(bob.account.address);
      assert.equal(await builderPassport.read.hasMinted([bobAddress]), false);
      assert.equal(await builderPassport.read.tokenIdOf([bobAddress]), 0n);
    });
  });

  // -----------------------------------------------------------------------
  // Gas measurements — validating the design doc's estimates
  // -----------------------------------------------------------------------
  describe("Gas measurements", () => {
    it("measures gas for a typical mint (design estimate: ~180,000-220,000)", async () => {
      const { builderPassport, alice, publicClient } = await loadFixture(
        deployBuilderPassportFixture
      );
      const hash = await builderPassport.write.mint(
        [
          SAMPLE_PROFILE.name,
          SAMPLE_PROFILE.bio,
          SAMPLE_PROFILE.skills,
          SAMPLE_PROFILE.github,
          SAMPLE_PROFILE.x,
          SAMPLE_PROFILE.website,
        ],
        { account: alice.account }
      );
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log(`  ⛽ mint() gas used: ${receipt.gasUsed.toString()}`);
      // Sanity bound — generous upper limit, well above the design estimate,
      // to catch any gross regression without being flaky across compiler/
      // optimizer versions.
      assert.ok(receipt.gasUsed < 350_000n, `mint() used unexpectedly high gas: ${receipt.gasUsed}`);
    });

    it("measures gas for a mint with all fields at max length and all skills filled", async () => {
      const { builderPassport, alice, publicClient } = await loadFixture(
        deployBuilderPassportFixture
      );
      const hash = await builderPassport.write.mint(
        [
          "n".repeat(64),
          "b".repeat(280),
          skillsArray(["Solidity", "React", "Viem", "Hardhat", "TypeScript"]),
          "h".repeat(64),
          "h".repeat(64),
          "w".repeat(256),
        ],
        { account: alice.account }
      );
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log(`  ⛽ mint() [max fields] gas used: ${receipt.gasUsed.toString()}`);
      assert.ok(
        receipt.gasUsed < 450_000n,
        `max-field mint() used unexpectedly high gas: ${receipt.gasUsed}`
      );
    });

    it("measures gas for a typical profile update (design estimate: ~60,000-150,000)", async () => {
      const { builderPassport, alice, publicClient } = await loadFixture(
        deployBuilderPassportFixture
      );
      await builderPassport.write.mint(
        [
          SAMPLE_PROFILE.name,
          SAMPLE_PROFILE.bio,
          SAMPLE_PROFILE.skills,
          SAMPLE_PROFILE.github,
          SAMPLE_PROFILE.x,
          SAMPLE_PROFILE.website,
        ],
        { account: alice.account }
      );

      const hash = await builderPassport.write.updateProfile(
        ["Ada L.", "Updated bio.", skillsArray(["Solidity", "Hardhat"]), "ada-gh", "ada-x", "https://ada.dev/new"],
        { account: alice.account }
      );
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log(`  ⛽ updateProfile() gas used: ${receipt.gasUsed.toString()}`);
      assert.ok(
        receipt.gasUsed < 250_000n,
        `updateProfile() used unexpectedly high gas: ${receipt.gasUsed}`
      );
    });
  });
});
