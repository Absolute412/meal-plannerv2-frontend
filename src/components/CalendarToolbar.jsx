export const CalendarToolbar = ({
    months,
    displayDate,
    onChangeMonth,
    onJumpToToday,
    onAddMeal,
}) => {
    return (
        // Month selector + primary actions
        <div className="flex flex-wrap items-center gap-2">
            {/* Month dropdown */}
            <select
                value={displayDate.getMonth()}
                onChange={(event) => onChangeMonth(event.target.value)}
                className="
                    rounded-xl border border-(--line) bg-(--surface) px-3 py-2 text-sm 
                    font-semibold text-(--text-main) outline-none transition focus:border-(--accent)"
            >
                {months.map((monthName, index) => (
                    <option key={monthName} value={index}>
                        {monthName}
                    </option>
                ))}
            </select>

            {/* Jump to current month */}
            <button
                onClick={onJumpToToday}
                className="
                    rounded-xl border border-(--line) bg-(--surface) px-4 py-2 text-sm 
                    font-semibold text-(--text-main) transition hover:bg-(--surface-muted)"
            >
                Today
            </button>

            {/* Quick add meal CTA */}
            <button
                onClick={onAddMeal}
                className="
                    rounded-xl bg-(--accent) px-4 py-2 text-sm 
                    font-semibold text-[#2f2710] transition hover:bg-(--accent-strong)"
            >
                + Add Meal
            </button>
        </div>
    );
};
