export const RecipeSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
        <div
            key={`recipe-skeleton-${index}`}
            className="rounded-xl border border-(--line) bg-(--surface-elevated) overflow-hidden"
        >
            <div className="h-40 w-full bg-(--surface-muted) animate-pulse" />
            <div className="p-3 space-y-2">
            <div className="h-3 w-3/4 rounded-full bg-(--surface-muted) animate-pulse" />
            <div className="h-3 w-1/2 rounded-full bg-(--surface-muted) animate-pulse" />
            </div>
        </div>
        ))}
    </div>
  )
}
