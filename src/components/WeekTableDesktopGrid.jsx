import { WeekTableDesktopCell } from "./WeekTableDesktopCell";

export const WeekTableDesktopGrid = ({
    week,
    mealRows,
    mealsByDate,
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
        // Desktop grid: left column for meal types + 7 day columns
        <div className="grid grid-cols-[96px_repeat(7,minmax(88px,1fr))] gap-2 lg:min-w-0 lg:grid-cols-8">
            <div></div>

            {/* Day headers */}
            {week.map((day) => (
                <div
                    key={day.key}
                    className={`
                        rounded-xl border border-transparent px-2 py-2 
                        text-center text-sm font-semibold text-(--text-main) ${
                        day.key === todayKey
                            ? "border-(--accent) bg-(--accent-soft)"
                            : ""
                    }`}
                >
                    <div>{day.label}</div>
                    <div className="text-[11px] font-semibold text-(--text-muted)">
                        {day.date.getDate()}
                    </div>
                </div>
            ))}

            {/* Meal-type rows with a cell per day */}
            {mealRows.map((mealType) => (
                <div key={mealType} className="contents">
                    <div className="text-sm font-semibold text-(--text-muted)">
                        {mealType}
                    </div>

                    {week.map((day) => {
                        const mealsForDay = mealsByDate[day.key] || [];
                        const meal = mealsForDay.find((m) =>
                            m.meal_type?.toLowerCase().includes(mealType.toLowerCase())
                        );

                        return (
                            // Individual droppable cell (handles drag + add)
                            <WeekTableDesktopCell
                                key={day.key + mealType}
                                day={day}
                                mealType={mealType}
                                meal={meal}
                                todayKey={todayKey}
                                dragOverSlot={dragOverSlot}
                                setDragOverSlot={setDragOverSlot}
                                maxFutureDateKey={maxFutureDateKey}
                                meals={meals}
                                updateMeal={updateMeal}
                                setDraggingMealId={setDraggingMealId}
                                draggingMealId={draggingMealId}
                                setSelectedSlot={setSelectedSlot}
                                setIsOpen={setIsOpen}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
