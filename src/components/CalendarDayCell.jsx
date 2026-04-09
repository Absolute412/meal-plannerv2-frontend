import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { MealPill } from "./MealPill";

export const CalendarDayCell = ({
    cell,
    dayMeals,
    isMobile,
    todayKey,
    maxFutureDateKey,
    maxFutureDate,
    draggingMealId,
    dragOverKey,
    meals,
    selectedMealToMove,
    setDraggingMealId,
    setDragOverKey,
    setSelectedMealToMove,
    setSelectedSlot,
    setIsOpen,
    updateMeal,
    onOpenDay,
}) => {
    // Derived state: highlight today's cell
    const isToday = cell.key === todayKey;

    return (
        <article
            // Desktop drag target behavior
            onDragOver={(e) => {
                if (!isMobile) {
                    e.preventDefault();
                    setDragOverKey(cell.key);
                }
                if (!isMobile) {
                    e.dataTransfer.dropEffect = "move";
                }
            }}
            onDragLeave={() => setDragOverKey(null)}
            onDrop={async (e) => {
                if (!isMobile) {
                    e.preventDefault();
                    setDragOverKey(null);

                    // Read dragged meal id from dataTransfer
                    const mealId = Number(e.dataTransfer.getData("mealId"));
                    if (!mealId) return;

                    // Prevent moves to past or far-future dates
                    if (new Date(cell.key) < new Date(todayKey)) {
                        toast.error("You cannot move a meal to a past date.");
                        return;
                    }

                    if (cell.key > maxFutureDateKey) {
                        toast.error(
                            "Meal date cannot be more than 360 days in the future."
                        );
                        return;
                    }

                    // No-op if dropping on the same date
                    const currentMealDate = meals.find((meal) => meal.id === mealId)
                        ?.meal_date?.slice(0, 10);
                    if (currentMealDate === cell.key) return;

                    // Persist move
                    try {
                        await updateMeal(mealId, { meal_date: cell.key });
                        toast.success("Meal moved.");
                    } catch (err) {
                        toast.error(err.message || "Could not move meal.");
                    } finally {
                        setDraggingMealId(null);
                    }
                }
            }}
            // Mobile tap-to-move behavior
            onClick={async () => {
                if (isMobile && selectedMealToMove) {
                    if (new Date(cell.key) < new Date(todayKey)) {
                        toast.error("You cannot move meal to a past date.");
                        return;
                    }
                    try {
                        await updateMeal(selectedMealToMove, { meal_date: cell.key });
                        toast.success("Meal moved.");
                    } catch (err) {
                        toast.error(err.message || "Could not move meal.");
                    } finally {
                        setSelectedMealToMove(null);
                    }
                    // Also guard far-future dates on mobile
                    if (new Date(cell.key) > new Date(maxFutureDate)) {
                        toast.error("Meal date cannot be more than 360 days in the future.");
                        return;
                    }
                    return;
                }
                onOpenDay({
                    key: cell.key,
                    date: cell.date,
                    meals: dayMeals
                })
            }}
            className={`
                /* Base cell visuals + drag-over/today states */
                group relative flex min-h-24 sm:min-h-30 flex-col rounded-2xl border p-2 transition duration-200 
                hover:-translate-y-0.5 hover:border-(--accent) ${
                isToday
                    ? "border-(--accent) bg-(--accent-soft)"
                    : "border-(--line) bg-(--surface)"
            } ${dragOverKey === cell.key ? "ring-2 ring-(--accent) ring-offset-1 ring-offset-(--surface-elevated)" : ""}`}
        >
            {/* Day number + count + add button */}
            <div className="mb-2 flex items-center justify-between">
                <span
                    className={`text-sm font-semibold ${
                        cell.inCurrentMonth
                            ? "text-(--text-main)"
                            : "text-(--text-muted)"
                    }`}
                >
                    {cell.date.getDate()}
                </span>

                <div className="flex items-center gap-1">
                    {dayMeals.length > 0 ? (
                        <span className="rounded-full bg-(--surface-elevated) px-2 py-0.5 text-[10px] font-bold text-(--text-muted)">
                            {dayMeals.length}
                        </span>
                    ) : null}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Open add-meal modal, defaulting to breakfast
                            setSelectedSlot({ date: cell.key, mealType: "Breakfast", });
                            setIsOpen(true);
                        }}
                        type="button"
                        aria-label="Add meal"
                        className="
                            absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-(--line)
                            bg-(--surface) text-xs font-semibold text-(--text-muted)
                            transition hover:border-(--accent) hover:text-(--text-main)
                            sm:opacity-0 sm:group-hover:opacity-100"
                    >
                        <Icon icon="ic:round-plus" />
                    </button>
                </div>
            </div>

            {/* Meals preview (max 2 pills) or empty state */}
            {dayMeals.length === 0 ? (
                <p className="mt-auto text-[10px] sm:text-[11px] text-(--text-muted)">No meals</p>
            ) : (
                <ul className="mt-auto space-y-1">
                    {dayMeals.slice(0, 2).map((meal) => (
                        <MealPill
                            key={meal.id}
                            meal={meal}
                            isMobile={isMobile}
                            draggingMealId={draggingMealId}
                            selectedMealToMove={selectedMealToMove}
                            setDraggingMealId={setDraggingMealId}
                            setSelectedMealToMove={setSelectedMealToMove}
                        />
                    ))}

                    {dayMeals.length > 2 ? (
                        <li className="text-[11px] font-semibold text-(--text-muted)">
                            +{dayMeals.length - 2} more
                        </li>
                    ) : null}
                </ul>
            )}
        </article>
    );
};
