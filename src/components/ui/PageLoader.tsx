/**
 * Branded full-area loader shown while a page is loading.
 * A soft spinning ring around the UK Linen House monogram.
 */
export default function PageLoader() {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-5">
      <div className="relative h-16 w-16">
        <span className="absolute inset-0 rounded-full border-2 border-grey-200" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent" />
        <span className="absolute inset-0 flex animate-pulse items-center justify-center text-sm font-semibold tracking-[0.15em] text-accent">
          LH
        </span>
      </div>
      <p className="text-sm text-grey-400">Loading...</p>
    </div>
  );
}
