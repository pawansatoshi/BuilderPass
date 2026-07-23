/**
 * Static "GIWA Sepolia" badge. Deliberately not wired to live wallet state
 * (e.g. turning red on wrong network) — RainbowKit's own ConnectButton
 * already shows a "Wrong network" state with a one-tap switch when the
 * connected wallet is on anything other than GIWA Sepolia (the app's only
 * configured chain), so duplicating that logic here would be redundant.
 * This badge's job is simpler: constantly remind whoever's looking at the
 * app which network it's for, connected or not.
 */
export function NetworkBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-xs font-medium text-ink">
      <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
      GIWA Sepolia
    </span>
  );
}
