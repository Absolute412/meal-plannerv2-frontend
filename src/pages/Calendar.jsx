import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMeals } from "../hooks/useMeals";
import { MONTHS, WEEK_DAYS, buildMonthGrid, toDateKey, } from "../constants";
import { Addmeal } from "../components/Addmeal";
import { CalendarDayCell } from "../components/CalendarDayCell";
import { CalendarToolbar } from "../components/CalendarToolbar";
import { YearNavigator } from "../components/YearNavigator";
import { DayDetailModal } from "../components/DayDetailModal";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { toast } from "react-toastify";

export const Calendar = () => {
  // Data + navigation
  const { meals, loadingMeals, deleteMeal, updateMeal } = useMeals();
  const navigate = useNavigate();

  // Date boundaries for move validation
  const today = new Date();
  const todayKey = toDateKey(today);
  const maxFutureDate = new Date(today);
  maxFutureDate.setDate(maxFutureDate.getDate() + 360);
  const maxFutureDateKey = toDateKey(maxFutureDate);

  // Calendar UI state
  const [displayDate, setDisplayDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [draggingMealId, setDraggingMealId] = useState(null);
  const [dragOverKey, setDragOverKey] = useState(null);
  const [selectedMealToMove, setSelectedMealToMove] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);
  const [mealToDelete, setMealToDelete] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setIsOpen(true);  // Open add meal isDayModalOpen
    setIsDayModalOpen(false);
  };

  const handleDeleteRequest = (meal) => {
    setMealToDelete(meal);
    setConfirmOpen(true);
    setIsDayModalOpen(false)
  };

  const handleDeleteConfirm = async () => {
    if (!mealToDelete) return;
    try {
      await deleteMeal(mealToDelete.id);
      toast.success("Meal deleted.");
    } catch(err) {
      toast.error(err.message || "Could not delete meal.")
    } finally{
      setConfirmOpen(false);
      setMealToDelete(null);
    }
  };

  // Group meals by date key for quick lookup per cell
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

  // Build calendar grid for the month view
  const monthGrid = useMemo(() => buildMonthGrid(displayDate), [displayDate]);

  // Month/year navigation helpers
  const onChangeMonth = (nextMonthIndex) => {
    setDisplayDate(
      new Date(displayDate.getFullYear(), Number(nextMonthIndex), 1)
    );
  };

  const shiftMonth = (delta) => {
    setDisplayDate(
      new Date(displayDate.getFullYear(), displayDate.getMonth() + delta, 1)
    );
  };

  const shiftYear = (delta) => {
    setDisplayDate(
      new Date(displayDate.getFullYear() + delta, displayDate.getMonth(), 1)
    );
  };

  const jumpToToday = () => {
    setDisplayDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  // Track breakpoint for drag vs. tap-to-move behavior
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {/* Add-meal modal overlay */}
      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false);
            setSelectedSlot(null);
            setEditingMeal(null);
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
              editingMeal={editingMeal}
              presetMealDate={selectedSlot?.date ?? ""}
              presetMealType= {selectedSlot?.mealType ?? ""}
              onSaved={() => {
                  setIsOpen(false);
                  setSelectedSlot(null);
                  setEditingMeal(null);
              }}
              onClose={() => {
                  setIsOpen(false);
                  setSelectedSlot(null);
                  setEditingMeal(null);
              }}
            />
          </div>
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <ConfirmationModal 
            title="Delete Meal"
            message="Are you sure you want to delete this meal? This action cannot be undone."
            confirmText="Delete"
            onCancel={() => {
              setConfirmOpen(false);
              setMealToDelete(null);
            }}
            onConfirm={handleDeleteConfirm}
          />
        </div>
      )}

      {/* Day-detail modal */}
      <DayDetailModal 
        isOpen={isDayModalOpen}
        selectedDay={selectedDay}
        onClose={() => {
          setIsDayModalOpen(false);
          setSelectedDay(null);
        }}
        onEditMeal={handleEditMeal}
        onDeleteMeal={handleDeleteRequest}
      />

      {/* Calendar container */}
      <section className="rounded-3xl border border-(--line) bg-(--surface-elevated) p-4 shadow-sm sm:p-6">
        {/* Top toolbar + year navigator */}
        <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <CalendarToolbar
            months={MONTHS}
            displayDate={displayDate}
            onChangeMonth={onChangeMonth}
            onJumpToToday={jumpToToday}
            onAddMeal={() => navigate("/meals")}
          />

          <YearNavigator
            year={displayDate.getFullYear()}
            onPrevYear={() => shiftYear(-1)}
            onNextYear={() => shiftYear(1)}
          />
        </div>

        {/* Drag/tap tips + move hint */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-(--text-muted)">
            {isMobile
              ? "Tap a meal, then tap a day to move it."
              : "Drag meals onto a day to reschedule."}
          </p>
          {draggingMealId ? (
            <span className="rounded-full border border-(--accent) bg-(--accent-soft) px-2 py-1 text-[11px] font-semibold text-(--text-main)">
              Drop to move meal
            </span>
          ) : null}
        </div>

        {/* Weekday headers */}
        <div className="mb-3 flex justify-between gap-2 border-b border-(--line) pb-2">
          {WEEK_DAYS.map((day) => (
            <div
              key={day}
              className="w-[14.285%] text-center text-[10px] sm:text-xs font-semibold text-(--text-muted)"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Loading state vs. month grid */}
        {loadingMeals ? (
          <div className="rounded-2xl border border-(--line) bg-(--surface) p-4 text-sm text-(--text-muted)">
            Loading calendar meals...
          </div>
        ) : (
          <div className="pb-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {monthGrid.map((cell) => {
                const dayMeals = mealsByDate[cell.key] || [];

                return (
                  // Each calendar cell handles add + move interactions
                  <CalendarDayCell
                    key={cell.key}
                    cell={cell}
                    dayMeals={dayMeals}
                    isMobile={isMobile}
                    todayKey={todayKey}
                    maxFutureDateKey={maxFutureDateKey}
                    maxFutureDate={maxFutureDate}
                    draggingMealId={draggingMealId}
                    dragOverKey={dragOverKey}
                    meals={meals}
                    selectedMealToMove={selectedMealToMove}
                    setDraggingMealId={setDraggingMealId}
                    setDragOverKey={setDragOverKey}
                    setSelectedMealToMove={setSelectedMealToMove}
                    setSelectedSlot={setSelectedSlot}
                    setIsOpen={setIsOpen}
                    updateMeal={updateMeal}
                    onOpenDay={(cell) => {
                      setSelectedDay(cell);
                      setIsDayModalOpen(true);
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom month navigation */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => shiftMonth(-1)}
            className="
              rounded-xl border border-(--line) bg-(--surface) px-3 py-1.5 text-xs 
              font-semibold text-(--text-main) transition hover:bg-(--surface-muted)"
          >
            Previous Month
          </button>
          <button
            onClick={() => shiftMonth(1)}
            className="
              rounded-xl border border-(--line) bg-(--surface) px-3 py-1.5 text-xs 
              font-semibold text-(--text-main) transition hover:bg-(--surface-muted)"
          >
            Next Month
          </button>
        </div>
      </section>
    </>
  );
};
