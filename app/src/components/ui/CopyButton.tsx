import { useClipboard } from "../../hooks/useClipboard";
import { useToast } from "../ToastProvider";

interface CopyButtonProps {
  value: string;
  label: string;
}

/**
 * Text button that copies `value`, shows brief inline "Copied" feedback,
 * and fires a toast — the toast matters most on mobile, where an inline
 * label change next to a small tap target is easy to miss.
 */
export function CopyButton({ value, label }: CopyButtonProps) {
  const { copy, copied } = useClipboard();
  const { showToast } = useToast();

  async function handleClick() {
    await copy(value);
    showToast(`${label} copied`);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="font-mono text-xs text-slate underline decoration-dotted underline-offset-2 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      aria-label={`Copy ${label}`}
    >
      {copied ? "Copied ✓" : `Copy ${label}`}
    </button>
  );
}
