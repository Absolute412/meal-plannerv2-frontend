import { Icon } from "@iconify/react";

export const DayDetailModal = ({ isOpen, selectedDay, onEditMeal, onDeleteMeal, onClose }) => {
    if (!isOpen || !selectedDay) return null;

    const { date, meals } = selectedDay;
    const normalizedMeals = (meals || []).map((meal) => ({
        ...meal,
        mealType: (meal.meal_type || "").toLowerCase(),
    }));

    const sections = [
        { key: "breakfast", label: "Breakfast" },
        { key: "lunch", label: "Lunch" },
        { key: "snack", label: "Snack" },
        { key: "dinner", label: "Dinner" },
    ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
        <div
            className="
            relative w-full max-w-xs rounded-2xl border border-(--line) bg-(--surface-elevated)
            p-4 shadow-sm"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
        >
            <button
                onClick={onClose}
                className="absolute right-3 top-3 rounded-full bg-(--surface-mid) p-2 text-(--text-muted) transition hover:bg-(--surface-muted)"
            >
                <Icon icon="material-symbols:close-rounded" />
            </button>

            <div className="mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-(--text-muted)">Day details</p>
                <h2 className="text-base font-semibold text-(--text-main)">
                    Meals for {date.toDateString()}
                </h2>
            </div>

            {normalizedMeals.length === 0 ? (
                <div className="rounded-xl border border-(--line) bg-(--surface-elevated) p-3 text-sm text-(--text-muted)">
                    No meals for this day.
                </div>
            ) : (
                <div className="space-y-2">
                    {sections
                        .flatMap((section) =>
                            normalizedMeals.filter((meal) => meal.mealType === section.key)
                        )
                        .map((meal) => (
                            <div
                                key={meal.id}
                                className="
                                    flex flex-col justify-between rounded-xl border border-(--line) bg-(--surface)
                                    gap-2 p-2 transition duration-200 hover:-translate-y-0.5 hover:border-(--accent)"
                            >
                                <div className="flex flex-col justify-center">
                                    <div className="text-sm font-semibold text-(--text-main) leading-tight">
                                        {meal.title}
                                    </div>
                                    <div className="text-[10px] font-semibold text-(--text-muted)">
                                        {meal.meal_type}
                                    </div>
                                </div>

                                <div className="flex gap-2 text-[11px] font-semibold">
                                    <button
                                        onClick={() => onEditMeal?.(meal)}
                                        className="
                                            inline-flex items-center gap-1 rounded-lg border border-(--line) 
                                            bg-(--surface-elevated) px-2 py-1 text-(--text-main)
                                            transition hover:border-(--accent) hover:text-(--text-main)"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {onDeleteMeal?.(meal)}}
                                        className="
                                        inline-flex items-center gap-1 rounded-lg bg-rose-500  
                                        hover:bg-rose-600 dark:bg-rose-950/60 dark:hover:bg-rose-900/70
                                        px-2 py-1 text-white dark:text-rose-200 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    </div>
  );
}
