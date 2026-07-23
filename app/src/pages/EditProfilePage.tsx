import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { EditProfileForm } from "../features/profile/EditProfileForm";
import { useHasMinted, usePassportByAddress } from "../hooks/useBuilderPassport";

export function EditProfilePage() {
  const { address, isConnected } = useAccount();
  const hasMintedQuery = useHasMinted(address);
  const shouldFetchPassport = hasMintedQuery.data === true;
  const passportQuery = usePassportByAddress(
    shouldFetchPassport ? address : undefined
  );

  if (!isConnected) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Connect your wallet to edit
        </h1>
        <div className="flex justify-center pt-2">
          <ConnectButton />
        </div>
      </div>
    );
  }

  if (hasMintedQuery.isLoading) {
    return <p className="text-center text-slate">Loading your passport…</p>;
  }

  if (hasMintedQuery.data === false) {
    return (
      <div className="space-y-3 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">
          You don't have a Builder Passport yet
        </h1>
        <Link to="/mint" className="text-ink underline">
          Mint one first
        </Link>
      </div>
    );
  }

  if (!passportQuery.data || !address) {
    return <p className="text-center text-slate">Loading your passport…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Edit your profile
        </h1>
        <p className="text-slate">
          Changes are saved on-chain, on GIWA Sepolia.
        </p>
      </div>
      <EditProfileForm ownerAddress={address} passport={passportQuery.data} />
    </div>
  );
}
