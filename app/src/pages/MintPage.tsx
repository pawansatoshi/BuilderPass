import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MintForm } from "../features/mint/MintForm";
import { useHasMinted } from "../hooks/useBuilderPassport";

export function MintPage() {
  const { address, isConnected } = useAccount();
  const hasMintedQuery = useHasMinted(address);

  if (!isConnected) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Connect your wallet to mint
        </h1>
        <p className="text-slate">
          You'll need a wallet on GIWA Sepolia to mint your Builder Passport.
        </p>
        <div className="flex justify-center pt-2">
          <ConnectButton />
        </div>
      </div>
    );
  }

  if (hasMintedQuery.isLoading) {
    return <p className="text-center text-slate">Checking your wallet…</p>;
  }

  if (hasMintedQuery.data === true && address) {
    return (
      <div className="space-y-3 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">
          You already have a Builder Passport
        </h1>
        <p className="text-slate">
          Each wallet can only mint one — it's permanent and non-transferable.
        </p>
        <p>
          <Link to={`/profile/${address}`} className="text-ink underline">
            View your passport
          </Link>
          {" · "}
          <Link to="/edit" className="text-ink underline">
            Edit your profile
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Mint your Builder Passport
        </h1>
        <p className="text-slate">
          One passport per wallet, permanent and non-transferable — this is
          your on-chain identity on GIWA.
        </p>
      </div>
      <MintForm />
    </div>
  );
}
