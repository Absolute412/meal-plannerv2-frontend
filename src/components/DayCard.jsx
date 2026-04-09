import { toast } from "react-toastify";
import { typeLabelClass } from "../constants";

export const DayCard = ({
    day,
    mealsForDay,
    mealRows,
    selectedMealToMove,
    setSelectedMealToMove,
    setSelectedSlot,
    setIsOpen,
    onMoveMeal,
    todayKey,
}) => {
    return (
        // Card container (highlight today)
        <div
            className={`rounded-2xl border p-3 ${
                day.key === todayKey
                ? "border-(--accent) bg-(--accent-soft)"
                : "border-(--line) bg-(--surface)"
            }`}
        >
            {/* Day header */}
            <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold text-(--text-main)">
                    {day.label} {day.date.getDate()}
                </p>
            </div>

            {/* Meal rows for this day */}
            <div className="space-y-2">
                {mealRows.map((mealType) => {
                    const meal = mealsForDay.find((m) =>
                        m.meal_type?.toLowerCase().includes(mealType.toLowerCase())
                    );

                    return (
                        <div
                            key={mealType}
                            // Tap row to place selected meal (move flow)
                            onClick={async () => {
                                if (selectedMealToMove) {
                                    await onMoveMeal(day.key, mealType);
                                }
                            }}
                            className="flex items-center justify-between gap-3 rounded-xl border border-(--line) p-2"
                        >
                            <span className="text-sm font-semibold text-(--text-muted)">
                                {mealType}
                            </span>

                            {meal ? (
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Tap meal pill to select/deselect for move
                                        if (selectedMealToMove === meal.id) {
                                            setSelectedMealToMove(null);
                                            return;
                                        }
                                        setSelectedMealToMove(meal.id);
                                        toast.info("Select a slot to move meal");
                                    }}
                                    className={`
                                        rounded-md px-2 py-1 text-sm font-semibold line-clamp-2 max-w-[60%]
                                        ${typeLabelClass(meal.meal_type)}
                                        ${selectedMealToMove === meal.id
                                            ? "ring-2 ring-(--accent) scale-[1.03] shadow-md"
                                            : ""
                                        }
                                    `}
                                >
                                    {meal.title}
                                </span>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Open add-meal modal for this day + row
                                        setSelectedSlot({
                                            date: day.key,
                                            mealType,
                                        });
                                        setIsOpen(true);
                                    }}
                                    className="text-xs text-(--text-muted)"
                                >
                                    + Add
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
