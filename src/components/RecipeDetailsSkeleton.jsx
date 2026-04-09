export const RecipeDetailsSkeleton = () => {
  return (
    <div className="space-y-6">
        <div className="h-72 w-full rounded-2xl border border-(--line) bg-(--surface-elevated) animate-pulse sm:h-80 md:h-105" />

        <div className="space-y-3">
            <div className="h-8 w-2/3 rounded-full bg-(--surface-muted) animate-pulse" />
            <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="h-6 w-20 rounded-full bg-(--surface-muted) animate-pulse" />
                <div className="h-6 w-16 rounded-full bg-(--surface-muted) animate-pulse" />
            </div>
        </div>

        <div className="rounded-2xl border border-(--line) bg-(--surface) p-5 shadow-sm">
            <div className="mb-3 h-5 w-32 rounded-full bg-(--surface-muted) animate-pulse" />
            <ul className="space-y-2">
                {Array.from({ length: 6 }).map((_, index) => (
                    <li
                        key={`ingredient-skeleton-${index}`}
                        className="flex items-center justify-between gap-4 rounded-xl border border-(--line) bg-(--surface-elevated) px-3 py-2"
                    >
                        <div className="h-4 w-2/5 rounded-full bg-(--surface-muted) animate-pulse" />
                        <div className="h-4 w-16 rounded-full bg-(--surface-muted) animate-pulse" />
                    </li>
                ))}
            </ul>
        </div>

        <div className="rounded-2xl border border-(--line) bg-(--surface) p-5 shadow-sm space-y-3">
            <div className="h-5 w-32 rounded-full bg-(--surface-muted) animate-pulse" />
            <div className="h-3 w-full rounded-full bg-(--surface-muted) animate-pulse" />
            <div className="h-3 w-5/6 rounded-full bg-(--surface-muted) animate-pulse" />
            <div className="h-3 w-2/3 rounded-full bg-(--surface-muted) animate-pulse" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
            <div className="h-10 w-full sm:w-48 rounded-xl bg-(--surface-muted) animate-pulse" />
            <div className="h-10 w-full sm:w-56 rounded-xl bg-(--surface-muted) animate-pulse" />
        </div>
    </div>
  )
}
