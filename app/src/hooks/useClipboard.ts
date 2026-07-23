import { useCallback, useState } from "react";

/**
 * Returns `copy(text)` and a `copied` flag that's true for ~1.5s after a
 * successful copy — used by every "Copy" button (tx hash, addresses) so
 * that feedback logic isn't duplicated per instance.
 */
export function useClipboard(resetAfterMs = 1500) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetAfterMs);
      } catch {
        // Clipboard API can be unavailable (e.g. insecure context) — fail
        // quietly rather than throwing, since copy is a convenience, not a
        // required action.
      }
    },
    [resetAfterMs]
  );

  return { copy, copied };
}
