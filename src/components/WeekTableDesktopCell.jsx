import { toast } from "react-toastify";
import { typeLabelClass } from "../constants";

export const WeekTableDesktopCell = ({
    day,
    mealType,
    meal,
    todayKey,
    dragOverSlot,
    setDragOverSlot,
    maxFutureDateKey,
    meals,
    updateMeal,
    setDraggingMealId,
    draggingMealId,
    setSelectedSlot,
    setIsOpen,
}) => {
    return (
        <div
            // Drag target behavior (desktop)
            onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
            }}
            onDragEnter={() => setDragOverSlot({ date: day.key, mealType })}
            onDragLeave={() => {
                setDragOverSlot((prev) =>
                    prev?.date === day.key && prev?.mealType === mealType ? null : prev
                );
            }}
            onDrop={async (e) => {
                e.preventDefault();
                setDragOverSlot(null);

                // Read dragged meal id from dataTransfer
                const mealId = Number(e.dataTransfer.getData("mealId"));
                if (!mealId) return;

                // Prevent moves to past or far-future dates
                if (day.key < todayKey) {
                    toast.error("You cannot move a meal to a past date.");
                    return;
                }

                if (day.key > maxFutureDateKey) {
                    toast.error("Meal date cannot be more than 360 days in the future.");
                    return;
                }

                // No-op if dropping on the same date
                const currentMealDate = meals.find((m) => m.id === mealId)
                    ?.meal_date?.slice(0, 10);
                if (currentMealDate === day.key) return;

                // Persist move
                try {
                    await updateMeal(mealId, { meal_date: day.key, meal_type: mealType });
                    toast.success("Meal moved");
                } catch (err) {
                    toast.error(err.message || "Could not move meal.");
                } finally {
                    setDraggingMealId(null);
                }
            }}
            className={`
                /* Base cell visuals + drag-over/today states */
                group min-h-16 rounded-xl border border-(--line) bg-(--surface) 
                p-2 transition duration-200 hover:-translate-y-0.5 hover:border-(--accent) 
                ${day.key === todayKey ? "ring-1 ring-(--accent)/40" : ""} 
                ${dragOverSlot?.date === day.key && dragOverSlot?.mealType === mealType
                ? "ring-2 ring-(--accent) ring-offset-1 ring-offset-(--surface-elevated)"
                : ""
            }`}
        >
            {meal ? (
                <div
                    draggable
                    onDragStart={(e) => {
                        e.dataTransfer.setData("mealId", meal.id);
                        e.dataTransfer.effectAllowed = "move";
                        // Visual feedback for drag source
                        setDraggingMealId(meal.id);
                    }}
                    onDragEnd={() => {
                        setDraggingMealId(null);
                        setDragOverSlot(null);
                    }}
                    className={`
                        rounded-md px-2 py-1 text-sm font-semibold 
                        cursor-grab active:cursor-grabbing 
                        ${typeLabelClass(meal.meal_type)} 
                        ${draggingMealId === meal.id ? "opacity-60" : ""}`}
                >
                    {meal.title}
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => {
                        // Open add-meal modal for this slot
                        setSelectedSlot({
                            date: day.key,
                            mealType,
                        });
                        setIsOpen(true);
                    }}
                    aria-label={`Add meal for ${day.label} ${mealType}`}
                    className="
                        flex h-full w-full items-center justify-center rounded-lg text-left 
                        focus-visible:outline-2 focus-visible:outline-offset-2 
                        focus-visible:outline-(--accent) cursor-pointer"
                >
                    <span className="text-[11px] text-(--text-muted) group-hover:hidden">-</span>
                    <span className="hidden text-[11px] font-semibold text-(--text-main) group-hover:inline">
                        + Add meal
                    </span>
                </button>
            )}
        </div>
    );
};
