import { Link, useParams } from "react-router-dom";
import { isAddress, type Address } from "viem";
import { useAccount } from "wagmi";
import { PassportCard } from "../components/PassportCard";
import { PassportCardSkeleton } from "../components/PassportCardSkeleton";
import { NotFound } from "../components/NotFound";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ToastProvider";
import {
  useHasMinted,
  usePassportByAddress,
  useTokenIdOf,
} from "../hooks/useBuilderPassport";

export function ProfilePage() {
  const { address: rawAddress } = useParams();
  const { address: connectedAddress } = useAccount();
  const { showToast } = useToast();

  const address =
    rawAddress && isAddress(rawAddress) ? (rawAddress as Address) : undefined;

  const hasMintedQuery = useHasMinted(address);
  const shouldFetchPassport = hasMintedQuery.data === true;
  const passportQuery = usePassportByAddress(
    shouldFetchPassport ? address : undefined
  );
  const tokenIdQuery = useTokenIdOf(shouldFetchPassport ? address : undefined);

  function handleShare() {
    const shareData = { title: "GIWA Builder Passport", url: window.location.href };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        /* user cancelled share sheet — nothing to do */
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Profile link copied");
    }
  }

  if (!rawAddress) {
    return (
      <NotFound
        title="No address specified"
        message="Visit a profile URL like /profile/0x... to view a Builder Passport."
      />
    );
  }

  if (!address) {
    return (
      <NotFound
        title="Invalid wallet address"
        message="That doesn't look like a valid Ethereum address — double-check the link and try again."
      />
    );
  }

  if (hasMintedQuery.isLoading) {
    return <PassportCardSkeleton />;
  }

  if (hasMintedQuery.data === false) {
    return (
      <div className="space-y-2 text-center">
        <h1 className="font-display text-xl font-semibold text-ink">
          No Builder Passport yet
        </h1>
        <p className="text-slate">
          This wallet hasn't minted one. If it's yours,{" "}
          <Link to="/mint" className="text-ink underline">
            mint your Builder Passport
          </Link>
          .
        </p>
      </div>
    );
  }

  if (!passportQuery.data || tokenIdQuery.data === undefined) {
    return <PassportCardSkeleton />;
  }

  const isOwner =
    connectedAddress?.toLowerCase() === address.toLowerCase();

  return (
    <div className="space-y-4">
      <PassportCard
        address={address}
        tokenId={tokenIdQuery.data}
        passport={passportQuery.data}
      />
      <div className="flex justify-center gap-3">
        <Button variant="secondary" onClick={handleShare}>
          Share
        </Button>
        {isOwner && (
          <Link to="/edit">
            <Button variant="ghost">Edit profile</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
