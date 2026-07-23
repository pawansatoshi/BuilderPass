// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title GIWA Builder Passport
/// @author GIWA Builder Passport project — GASOK Builder Program submission
/// @notice A soulbound (non-transferable) ERC-721 representing one on-chain builder
///         identity per wallet, with fully on-chain, owner-editable profile data.
/// @dev Design rationale for every choice below is documented in full in
///      `BuilderPassport.design.md` (UML, storage layout, event flow, state diagram,
///      gas estimates, and a 14-point attack-vector review). Summary of the load-bearing
///      decisions carried into this implementation:
///        - Metadata lives entirely in contract storage — no `tokenURI`, no IPFS,
///          no off-chain dependency of any kind.
///        - Soulbound: transfers, approvals, and burning are all disabled. A passport
///          is permanent once minted, by design — see `_update`, `approve`,
///          `setApprovalForAll` below.
///        - One passport per wallet, enforced via `_tokenIdOf`.
///        - `BuilderPassportData.version` lets any future contract or off-chain reader
///          detect which schema a given passport was minted under.
///        - No `Ownable`, no admin role, no pause switch — there is no privileged
///          function in this contract at all, by explicit choice, to minimize attack
///          surface for an MVP with no need for one.
contract BuilderPassport is ERC721 {
    // ---------------------------------------------------------------------
    // Constants
    // ---------------------------------------------------------------------

    /// @notice Semantic version of this contract's deployed logic, for off-chain tooling
    ///         (explorers, docs, the frontend) to display or key off of.
    /// @dev Purely informational — never read by any on-chain logic in this contract.
    string public constant CONTRACT_VERSION = "1.0.0";

    /// @notice Schema version stamped into every newly minted passport's `version` field.
    /// @dev Bump this if `BuilderPassportData`'s shape ever changes in a future contract
    ///      version. Existing passports keep whatever version they were minted with, so
    ///      any reader (frontend, indexer, another GIWA-ecosystem contract) can detect and
    ///      handle older-schema data without breaking.
    uint16 public constant CURRENT_DATA_VERSION = 1;

    /// @notice Maximum length, in bytes, allowed for the `name` field.
    uint256 public constant MAX_NAME_LENGTH = 64;

    /// @notice Maximum length, in bytes, allowed for the `bio` field.
    uint256 public constant MAX_BIO_LENGTH = 280;

    /// @notice Maximum length, in bytes, allowed for the `github` and `x` handle fields.
    uint256 public constant MAX_HANDLE_LENGTH = 64;

    /// @notice Maximum length, in bytes, allowed for the `website` field.
    uint256 public constant MAX_WEBSITE_LENGTH = 256;

    /// @notice Number of skill slots every passport has. Not all slots need to be filled;
    ///         unused slots are left as `bytes32(0)`.
    uint8 public constant MAX_SKILLS = 5;

    // ---------------------------------------------------------------------
    // Storage
    // ---------------------------------------------------------------------

    /// @notice Fully on-chain builder profile data attached to a single passport tokenId.
    /// @dev Field order is deliberate: `version`, `mintedAt`, and `updatedAt` are declared
    ///      first and together fit in 144 bits (16 + 64 + 64), so Solidity packs all three
    ///      into a single 32-byte storage slot instead of three separate slots. Every field
    ///      declared after them is a dynamic type (`string`) or a fixed array (`bytes32[5]`),
    ///      each of which occupies its own storage slot(s) regardless of declaration order,
    ///      so no further packing is possible for those fields.
    struct BuilderPassportData {
        /// @dev Schema version this passport was minted under. See `CURRENT_DATA_VERSION`.
        uint16 version;
        /// @dev Unix timestamp (seconds) this passport was minted. Immutable after mint.
        uint64 mintedAt;
        /// @dev Unix timestamp (seconds) of the most recent `updateProfile` call. Equal to
        ///      `mintedAt` until the first update.
        uint64 updatedAt;
        /// @dev Display name, capped at `MAX_NAME_LENGTH` bytes.
        string name;
        /// @dev Short bio, capped at `MAX_BIO_LENGTH` bytes.
        string bio;
        /// @dev GitHub handle or profile URL, capped at `MAX_HANDLE_LENGTH` bytes.
        string github;
        /// @dev X (Twitter) handle, capped at `MAX_HANDLE_LENGTH` bytes.
        string x;
        /// @dev Personal or project website URL, capped at `MAX_WEBSITE_LENGTH` bytes.
        string website;
        /// @dev Up to `MAX_SKILLS` short tags (e.g. "Solidity", "React"), each packed into
        ///      a `bytes32`. A fixed-size array is used instead of `string[]` specifically
        ///      to avoid the extra length-slot and keccak-addressed data slots a dynamic
        ///      array would otherwise cost — see the design doc's gas analysis.
        bytes32[5] skills;
    }

    /// @notice wallet => tokenId. A value of `0` means the wallet has not minted a
    ///         passport yet.
    /// @dev Token IDs start at `1` specifically so `0` is a safe, unambiguous sentinel for
    ///      "no passport", without needing a separate `bool exists` flag alongside it.
    mapping(address => uint256) private _tokenIdOf;

    /// @notice tokenId => passport data.
    mapping(uint256 => BuilderPassportData) private _passports;

    /// @notice The tokenId that will be assigned to the next mint.
    /// @dev Starts at `1`; `_nextTokenId - 1` is the current total supply.
    uint256 private _nextTokenId;

    // ---------------------------------------------------------------------
    // Events
    // ---------------------------------------------------------------------

    /// @notice Emitted when a wallet mints its Builder Passport.
    /// @param builder The wallet that minted (and permanently owns) the passport.
    /// @param tokenId The tokenId assigned to this passport.
    /// @param mintedAt Unix timestamp of the mint.
    event PassportMinted(address indexed builder, uint256 indexed tokenId, uint64 mintedAt);

    /// @notice Emitted whenever a passport's profile data is updated.
    /// @param tokenId The tokenId whose data changed.
    /// @param builder The (only ever) owner of that tokenId.
    /// @param updatedAt Unix timestamp of this update.
    event ProfileUpdated(uint256 indexed tokenId, address indexed builder, uint64 updatedAt);

    // ---------------------------------------------------------------------
    // Errors
    // ---------------------------------------------------------------------

    /// @notice Thrown when a wallet that already owns a passport tries to mint another.
    /// @param builder The wallet that attempted the duplicate mint.
    error AlreadyMinted(address builder);

    /// @notice Thrown when looking up a passport that doesn't exist.
    /// @param tokenId The tokenId that was queried (`0` when derived from a caller with
    ///        no passport, since `0` is never a valid tokenId).
    error PassportDoesNotExist(uint256 tokenId);

    /// @notice Thrown when a caller who isn't a passport's owner tries to modify it.
    /// @param caller The address that attempted the action.
    /// @param tokenId The tokenId they attempted to modify.
    error NotPassportOwner(address caller, uint256 tokenId);

    /// @notice Thrown when `name` exceeds `MAX_NAME_LENGTH` bytes.
    error NameTooLong(uint256 maxLength);

    /// @notice Thrown when `bio` exceeds `MAX_BIO_LENGTH` bytes.
    error BioTooLong(uint256 maxLength);

    /// @notice Thrown when `github` exceeds `MAX_HANDLE_LENGTH` bytes.
    error GithubTooLong(uint256 maxLength);

    /// @notice Thrown when `x` exceeds `MAX_HANDLE_LENGTH` bytes.
    error XTooLong(uint256 maxLength);

    /// @notice Thrown when `website` exceeds `MAX_WEBSITE_LENGTH` bytes.
    error WebsiteTooLong(uint256 maxLength);

    /// @notice Thrown by any function that would transfer, approve, or otherwise move a
    ///         passport away from its original minter. Builder Passports are soulbound.
    error SoulboundTokenNonTransferable();

    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------

    /// @notice Deploys the Builder Passport collection.
    /// @dev Token IDs start at 1; see `_nextTokenId`.
    constructor() ERC721("GIWA Builder Passport", "GIWABP") {
        _nextTokenId = 1;
    }

    // ---------------------------------------------------------------------
    // External / public functions
    // ---------------------------------------------------------------------

    /// @notice Mints the caller's Builder Passport. Reverts if they already have one.
    /// @dev Follows checks-effects-interactions: all state (`_passports`, `_tokenIdOf`)
    ///      is written *before* `_safeMint` is called. `_safeMint` invokes the recipient's
    ///      `onERC721Received` callback if `msg.sender` is a contract wallet — since our
    ///      state is already final by that point, a malicious receiving contract trying to
    ///      re-enter `mint()` mid-callback simply hits the `AlreadyMinted` check and
    ///      reverts. It cannot mint a second passport for itself.
    /// @param name_ Display name, capped at `MAX_NAME_LENGTH` bytes.
    /// @param bio_ Short bio, capped at `MAX_BIO_LENGTH` bytes.
    /// @param skills_ Up to `MAX_SKILLS` short skill tags, each packed into a `bytes32`.
    /// @param github_ GitHub handle or profile URL, capped at `MAX_HANDLE_LENGTH` bytes.
    /// @param x_ X (Twitter) handle, capped at `MAX_HANDLE_LENGTH` bytes.
    /// @param website_ Website URL, capped at `MAX_WEBSITE_LENGTH` bytes.
    function mint(
        string calldata name_,
        string calldata bio_,
        bytes32[5] calldata skills_,
        string calldata github_,
        string calldata x_,
        string calldata website_
    ) external {
        if (_tokenIdOf[msg.sender] != 0) {
            revert AlreadyMinted(msg.sender);
        }
        _validateFieldLengths(name_, bio_, github_, x_, website_);

        uint256 tokenId = _nextTokenId++;
        uint64 nowTimestamp = uint64(block.timestamp);

        _passports[tokenId] = BuilderPassportData({
            version: CURRENT_DATA_VERSION,
            mintedAt: nowTimestamp,
            updatedAt: nowTimestamp,
            name: name_,
            bio: bio_,
            github: github_,
            x: x_,
            website: website_,
            skills: skills_
        });

        _tokenIdOf[msg.sender] = tokenId;

        _safeMint(msg.sender, tokenId);

        emit PassportMinted(msg.sender, tokenId, nowTimestamp);
    }

    /// @notice Updates the caller's own passport data in place. Reverts if they have no
    ///         passport.
    /// @dev The tokenId is derived from `msg.sender` rather than taken as a parameter: the
    ///      wallet-to-tokenId relationship is 1:1 and permanent (soulbound, no transfers),
    ///      so there is no scenario where a caller needs to specify a *different* tokenId
    ///      than their own — removing the parameter removes an entire class of "wrong
    ///      tokenId" mistakes from callers. The explicit `ownerOf` check below is technically
    ///      redundant given that guarantee (a nonzero `_tokenIdOf` entry can only ever point
    ///      to a token still owned by that same address), but is kept as defense-in-depth,
    ///      matching the reviewed design.
    /// @param name_ Display name, capped at `MAX_NAME_LENGTH` bytes.
    /// @param bio_ Short bio, capped at `MAX_BIO_LENGTH` bytes.
    /// @param skills_ Up to `MAX_SKILLS` short skill tags, each packed into a `bytes32`.
    /// @param github_ GitHub handle or profile URL, capped at `MAX_HANDLE_LENGTH` bytes.
    /// @param x_ X (Twitter) handle, capped at `MAX_HANDLE_LENGTH` bytes.
    /// @param website_ Website URL, capped at `MAX_WEBSITE_LENGTH` bytes.
    function updateProfile(
        string calldata name_,
        string calldata bio_,
        bytes32[5] calldata skills_,
        string calldata github_,
        string calldata x_,
        string calldata website_
    ) external {
        uint256 tokenId = _tokenIdOf[msg.sender];
        if (tokenId == 0) {
            revert PassportDoesNotExist(0);
        }
        if (ownerOf(tokenId) != msg.sender) {
            revert NotPassportOwner(msg.sender, tokenId);
        }

        _validateFieldLengths(name_, bio_, github_, x_, website_);

        BuilderPassportData storage passport = _passports[tokenId];
        passport.name = name_;
        passport.bio = bio_;
        passport.github = github_;
        passport.x = x_;
        passport.website = website_;
        passport.skills = skills_;
        passport.updatedAt = uint64(block.timestamp);

        emit ProfileUpdated(tokenId, msg.sender, passport.updatedAt);
    }

    /// @notice Returns whether `builder` has already minted a passport.
    /// @param builder The wallet address to check.
    /// @return True if `builder` owns a passport.
    function hasMinted(address builder) external view returns (bool) {
        return _tokenIdOf[builder] != 0;
    }

    /// @notice Returns the tokenId owned by `builder`, or `0` if they have none.
    /// @param builder The wallet address to look up.
    /// @return The tokenId, or `0`.
    function tokenIdOf(address builder) external view returns (uint256) {
        return _tokenIdOf[builder];
    }

    /// @notice Returns the total number of passports minted so far.
    /// @return The current supply.
    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    /// @notice Returns the full passport data for a given tokenId.
    /// @param tokenId The tokenId to look up.
    /// @return The passport's data struct.
    function getPassport(uint256 tokenId) external view returns (BuilderPassportData memory) {
        if (_ownerOf(tokenId) == address(0)) {
            revert PassportDoesNotExist(tokenId);
        }
        return _passports[tokenId];
    }

    /// @notice Returns the full passport data for the token owned by `builder`.
    /// @param builder The wallet address to look up.
    /// @return The passport's data struct.
    function getPassportByAddress(address builder) external view returns (BuilderPassportData memory) {
        uint256 tokenId = _tokenIdOf[builder];
        if (tokenId == 0) {
            revert PassportDoesNotExist(0);
        }
        return _passports[tokenId];
    }

    // ---------------------------------------------------------------------
    // Soulbound enforcement
    // ---------------------------------------------------------------------

    /// @notice Blocks all transfers while still allowing minting.
    /// @dev Overrides OpenZeppelin v5's single internal transfer hook, which every mint,
    ///      burn, and transfer routes through. `from == address(0)` identifies a mint
    ///      (always allowed, since `from` and `to` aren't both nonzero). Any case where
    ///      both `from` and `to` are nonzero is a transfer and is rejected. Burning
    ///      (`to == address(0)`) would also be permitted by this specific check, but no
    ///      burn function is exposed anywhere in this contract, so that path is
    ///      unreachable in practice — passports are permanent by design.
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert SoulboundTokenNonTransferable();
        }
        return super._update(to, tokenId, auth);
    }

    /// @notice Disabled. Builder Passports cannot be approved for transfer.
    /// @dev Reverts unconditionally rather than silently succeeding, so no wallet, indexer,
    ///      or marketplace is ever misled into thinking a transfer could later succeed —
    ///      an approval that can never be exercised is worse than no approval at all.
    function approve(address, uint256) public pure override {
        revert SoulboundTokenNonTransferable();
    }

    /// @notice Disabled. Builder Passports cannot be approved for transfer.
    /// @dev See `approve` for rationale.
    function setApprovalForAll(address, bool) public pure override {
        revert SoulboundTokenNonTransferable();
    }

    // ---------------------------------------------------------------------
    // Internal helpers
    // ---------------------------------------------------------------------

    /// @dev Validates every user-supplied string field against its length cap, reverting
    ///      with a field-specific custom error on the first violation found. `skills_`
    ///      needs no length validation here since it's a fixed-size `bytes32[5]` — its
    ///      size is enforced by the type system itself, not by runtime logic.
    function _validateFieldLengths(
        string calldata name_,
        string calldata bio_,
        string calldata github_,
        string calldata x_,
        string calldata website_
    ) private pure {
        if (bytes(name_).length > MAX_NAME_LENGTH) revert NameTooLong(MAX_NAME_LENGTH);
        if (bytes(bio_).length > MAX_BIO_LENGTH) revert BioTooLong(MAX_BIO_LENGTH);
        if (bytes(github_).length > MAX_HANDLE_LENGTH) revert GithubTooLong(MAX_HANDLE_LENGTH);
        if (bytes(x_).length > MAX_HANDLE_LENGTH) revert XTooLong(MAX_HANDLE_LENGTH);
        if (bytes(website_).length > MAX_WEBSITE_LENGTH) revert WebsiteTooLong(MAX_WEBSITE_LENGTH);
    }
}
