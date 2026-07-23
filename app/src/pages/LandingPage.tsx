import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "../components/ui/Button";
import { useHasMinted, useTotalSupply } from "../hooks/useBuilderPassport";

export function LandingPage() {
  const { address, isConnected } = useAccount();
  const hasMintedQuery = useHasMinted(address);
  const totalSupplyQuery = useTotalSupply();

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass-700">
          GIWA Sepolia · GASOK Builder Program
        </p>
        <h1 className="font-display text-4xl font-semibold text-ink">
          GIWA Builder Passport
        </h1>
        <p className="mx-auto max-w-md text-slate">
          A soulbound, on-chain identity card for builders in the GIWA
          ecosystem — mint once, permanent forever, editable anytime.
        </p>
        {totalSupplyQuery.data !== undefined && totalSupplyQuery.data > 0n && (
          <p className="font-mono text-xs text-slate">
            {totalSupplyQuery.data.toString()} builder
            {totalSupplyQuery.data === 1n ? "" : "s"} minted so far
          </p>
        )}
      </div>

      {!isConnected && (
        <div className="flex justify-center">
          <ConnectButton />
        </div>
      )}

      {isConnected && hasMintedQuery.isLoading && (
        <p className="text-slate">Checking your wallet…</p>
      )}

      {isConnected && hasMintedQuery.data === true && address && (
        <Link to={`/profile/${address}`}>
          <Button>View your Builder Passport</Button>
        </Link>
      )}

      {isConnected && hasMintedQuery.data === false && (
        <Link to="/mint">
          <Button>Mint your Builder Passport</Button>
        </Link>
      )}
    </div>
  );
}
