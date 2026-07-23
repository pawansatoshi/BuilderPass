/**
 * Mirrors PassportCard's layout so the page doesn't jump/reflow once real
 * data arrives — same header block, same metadata-grid shape, just pulsing
 * gray blocks instead of content.
 */
export function PassportCardSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading passport"
      className="overflow-hidden rounded-md border border-line bg-white shadow-sm"
    >
      <div className="space-y-2 border-b border-line bg-ink/90 px-6 py-5">
        <div className="h-3 w-40 animate-pulse rounded bg-paper/20" />
        <div className="h-7 w-52 animate-pulse rounded bg-paper/20" />
      </div>
      <div className="space-y-4 px-6 py-5">
        <div className="h-4 w-full animate-pulse rounded bg-line" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-line" />
        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-line" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-line" />
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-line pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 w-16 animate-pulse rounded bg-line" />
              <div className="h-4 w-24 animate-pulse rounded bg-line" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
