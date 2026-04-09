import { useMemo, useState } from "react";
import { useMeals } from "../hooks/useMeals";
import { useSettings } from "../hooks/useSettings";
import { useNavigate } from "react-router-dom";
import { buildWeek, mealRows, toDateKey } from "../constants";
import { toast } from "react-toastify";
import { Addmeal } from "../components/Addmeal";
import { DayCard } from "../components/DayCard";
import { WeekTableDesktopGrid } from "../components/WeekTableDesktopGrid";

export const WeekTable = () => {
    const { meals, updateMeal } = useMeals();
    const { weekStart } = useSettings();

    // UI state for add-meal modal + move/drag behavior
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [draggingMealId, setDraggingMealId] = useState(null);
    const [dragOverSlot, setDragOverSlot] = useState(null);
    const [selectedMealToMove, setSelectedMealToMove] = useState(null);

    // Navigation helper (used in empty state)
    const navigate = useNavigate();

    // Build the current week based on settings + compute date bounds
    const week = useMemo(() => buildWeek(new Date(), weekStart), [weekStart]);
    const today = new Date();
    const todayKey = toDateKey(new Date());
    const maxFutureDate = new Date(today);
    maxFutureDate.setDate(maxFutureDate.getDate()  + 360);
    const maxFutureDateKey = toDateKey(maxFutureDate);

    // Group meals by YYYY-MM-DD for quick lookup per day
    const mealsByDate = useMemo(() => {
        return meals.reduce((acc, meal) => {
        const key = meal.meal_date?.slice(0, 10);
        if (!key) return acc;

        if (!acc[key]) {
            acc[key] = [];
        }

        acc[key].push(meal);
        return acc;
        }, {});
    }, [meals]);

    // Used to switch between empty state vs. calendar view
    const hasMealsThisWeek = week.some(day => (mealsByDate[day.key]?.length ?? 0) > 0);

    // Tap-to-move handler (mobile/tablet flow)
    const handleMoveMeal = async (dateKey, mealType) => {
        if (!selectedMealToMove) return;

        if (new Date(dateKey) < new Date(todayKey)) {
            toast.error("You cannot move a meal to a past date.");
            return;
        }

        if (dateKey > maxFutureDateKey) {
            toast.error("Meal date cannot be more than 360 days in the future.");
            return;
        }

        try {
            await updateMeal(selectedMealToMove, {
                meal_date: dateKey,
                meal_type: mealType,
            });
            toast.success("Meal moved");
        } catch (err) {
            toast.error(err.message || "Could not move meal.");
        } finally {
            setSelectedMealToMove(null);
        }
    };

  return (
    <>
        {/* Add-meal modal overlay */}
        {isOpen && (
            <div
                onClick={() => {
                    setIsOpen(false);
                    setSelectedSlot(null);
                }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
            >
                <div
                    className="pointer-events-auto flex w-full max-w-2xl items-center justify-center"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Addmeal 
                        presetMealDate={selectedSlot?.date ?? ""}
                        presetMealType= {selectedSlot?.mealType ?? ""}
                        onSaved={() => {
                            setIsOpen(false);
                            setSelectedSlot(null);
                        }}
                        onClose={() => {
                            setIsOpen(false);
                            setSelectedSlot(null);
                        }}
                    />
                </div>
            </div>
        )}

        {/* Week planner container */}
        <section className="rounded-3xl border border-(--line) bg-(--surface-elevated) p-4 shadow-sm sm:p-6">
            {/* Title + tips + move state */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-2xl font-bold text-(--text-main)">Meals this week</h1>
                <p className="text-xs lg:hidden font-semibold text-(--text-muted)">
                    Tip: Tap a meal, then tap a day to move it.
                </p>
                <p className="hidden lg:block text-xs font-semibold text-(--text-muted)">
                    Tip: drag meals to a day or row to reschedule.
                </p>
                {selectedMealToMove && (
                    <div className="text-xs text-(--accent) font-semibold">
                        Tap a slot to move selected meal
                    </div>
                )}
            </div>
            {/* Empty state vs. week views */}
            {!hasMealsThisWeek ? (
                <div className="rounded-3xl border border-dashed border-(--line) bg-(--surface) p-6 text-center shadow-sm sm:p-8">
                    <h2 className="text-base font-semibold text-(--text-main)">
                        No meals planned yet
                    </h2>
                    <p className="mt-1 text-sm text-(--text-muted)">
                        Add your first meal to fill this week's plan.
                    </p>
                    <button 
                        onClick={() => navigate("/meals")}
                        className="mt-4 w-full rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold text-[#2f2710] transition hover:-translate-y-0.5 hover:bg-(--accent-strong) sm:w-auto"
                    >
                        Add meals
                    </button>
                </div>
            ) : (
                <>
                    {/* Mobile: stacked day cards */}
                    <div className="block sm:hidden space-y-3">
                        {week.map((day) =>{
                            const mealsForDay = mealsByDate[day.key] || [];

                            return (
                                <DayCard
                                    key={day.key}
                                    day={day}
                                    mealsForDay={mealsForDay}
                                    mealRows={mealRows}
                                    selectedMealToMove={selectedMealToMove}
                                    setSelectedMealToMove={setSelectedMealToMove}
                                    setSelectedSlot={setSelectedSlot}
                                    setIsOpen={setIsOpen}
                                    onMoveMeal={handleMoveMeal}
                                    todayKey={todayKey}
                                />
                            );
                        })}
                    </div>

                    {/* Tablet: 2-column day cards */}
                    <div className="hidden sm:grid lg:hidden grid-cols-2 gap-3">
                        {week.map((day) => {
                            const mealsForDay = mealsByDate[day.key] || [];

                            return (
                                <DayCard
                                    key={day.key}
                                    day={day}
                                    mealsForDay={mealsForDay}
                                    mealRows={mealRows}
                                    selectedMealToMove={selectedMealToMove}
                                    setSelectedMealToMove={setSelectedMealToMove}
                                    setSelectedSlot={setSelectedSlot}
                                    setIsOpen={setIsOpen}
                                    onMoveMeal={handleMoveMeal}
                                    todayKey={todayKey}
                                />
                            );
                        })}
                    </div>
                    
                    {/* Desktop: grid-based week table with drag + drop */}
                    <div className="hidden lg:block px-4 sm:mx-0 sm:px-0">
                        <WeekTableDesktopGrid
                            week={week}
                            mealRows={mealRows}
                            mealsByDate={mealsByDate}
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
                    </div>
                </>
            )}
        </section>
    </>
  )
}
