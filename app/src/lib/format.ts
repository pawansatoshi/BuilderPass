/** Shortens an address to `0x1234…abcd` for compact display. */
export function formatAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/**
 * Formats a unix timestamp (seconds, as returned by the contract) as a
 * readable date. Returns "—" for a zero timestamp (shouldn't happen for a
 * minted passport, but guards against rendering "Jan 1, 1970" if it ever
 * does).
 */
export function formatTimestamp(unixSeconds: bigint | number): string {
  const seconds = typeof unixSeconds === "bigint" ? unixSeconds : BigInt(unixSeconds);
  if (seconds === 0n) return "—";
  const date = new Date(Number(seconds) * 1000);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Prefixes a bare handle with `https://github.com/` if it isn't already a URL. */
export function githubUrl(handle: string): string {
  if (!handle) return "";
  return handle.startsWith("http") ? handle : `https://github.com/${handle}`;
}

/** Prefixes a bare handle with `https://x.com/` if it isn't already a URL. */
export function xUrl(handle: string): string {
  if (!handle) return "";
  const trimmed = handle.startsWith("@") ? handle.slice(1) : handle;
  return trimmed.startsWith("http") ? trimmed : `https://x.com/${trimmed}`;
}

/** Prefixes a bare domain with `https://` if it isn't already a full URL. */
export function normalizeUrl(url: string): string {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
}
