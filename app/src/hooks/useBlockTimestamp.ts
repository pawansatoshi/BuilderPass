import { useBlock } from "wagmi";

/**
 * Wraps wagmi's `useBlock` to fetch just the timestamp for a given block
 * number — used to show when a transaction was actually confirmed, since a
 * transaction receipt itself only carries the block *number*, not its time.
 */
export function useBlockTimestamp(blockNumber: bigint | undefined) {
  return useBlock({
    blockNumber,
    query: { enabled: blockNumber !== undefined },
  });
}
