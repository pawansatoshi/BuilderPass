/**
 * The design's single deliberate signature element: a corner seal styled
 * after an official passport/visa stamp, marking a profile as a real,
 * verified on-chain passport rather than a generic profile card. Kept as
 * the one visual flourish; everything else in the UI stays quiet around it.
 */
export function StampSeal() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-4 flex h-20 w-20 -rotate-[10deg] items-center justify-center rounded-full border-2 border-dashed border-brass/70 text-brass"
    >
      <span className="text-center font-display text-[9px] font-bold uppercase leading-tight tracking-[0.15em]">
        GIWA
        <br />
        Sepolia
        <br />
        Verified
      </span>
    </div>
  );
}
