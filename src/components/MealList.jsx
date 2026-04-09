import { useState } from "react";
import { useMeals } from "../hooks/useMeals";
import { formatDate, formatDay, mealOrder, typeLabelClass } from "../constants";
import { Addmeal } from "./Addmeal";
import { toast } from "react-toastify";

export const MealList = ({ onEditMeal, searchTerm = "", filters, sortBy = "date_desc" }) => {
  const { meals, loadingMeals, deleteMeal } = useMeals();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const todayKey = new Date().toISOString().slice(0, 10);
  const startOfWeek = (() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    return start;
  })();
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const selectedTypes = filters?.types ?? [];
  const dateRange = filters?.dateRange ?? "all";

  const visibleMeals = meals
    .filter((meal) => meal.title.toLowerCase().includes(normalizedSearch))
    .filter((meal) => {
      if (!selectedTypes.length) return true;
      return selectedTypes.includes(meal.meal_type);
    })
    .filter((meal) => {
      if (dateRange === "today") {
        return meal.meal_date?.slice(0, 10) === todayKey;
      }
      if (dateRange === "week") {
        const mealDate = new Date(meal.meal_date);
        return mealDate >= startOfWeek && mealDate <= endOfWeek;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "title_asc") {
        return a.title.localeCompare(b.title);
      }

      const dateDiff = new Date(a.meal_date) - new Date(b.meal_date);

      if (sortBy === "date_asc") {
        if (dateDiff !== 0) return dateDiff;
      } else {
        if (dateDiff !== 0) return -dateDiff;
      }

      return mealOrder[a.meal_type] - mealOrder[b.meal_type];
    });

    // Group meals by day
    const groupMeals = visibleMeals.reduce((groups, meal) => {
      const key = formatDay(meal.meal_date);

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(meal);

      return groups;
    }, {});

    const handleDelete = async (mealId) => {
      try {
        await deleteMeal(mealId);
        toast.success("Meal deleted.");
      } catch (err) {
        toast.error(err.message || "Could not delete meal.");
      }
    };

    const handleCopyMeal = (meal) => {
      setSelectedMeal(meal);
      setIsOpen(true);
    };

    if (loadingMeals) {
      return (
        <section 
          className="
            rounded-2xl border border-(--line) bg-(--surface-elevated) p-5 shadow-sm"
        >
          <p className="text-sm text-(--text-muted)">
            Loading meals...
          </p>
        </section>
      );
    }

  return (
    <section className="rounded-2xl border border-(--line) bg-(--surface-elevated) p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-(--text-main)">
        Your Meals
      </h2>

      {visibleMeals.length === 0 ? (
        <p>
          No meals yet. Add yout first meal above.
        </p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupMeals).map(([day, meals]) => (
            <div key={day} className="space-y-3">

              {/* Day Header */}
              <h3 className="text-sm font-semibold text-(--text-muted)">
                {day}
              </h3>

              {meals.map((meal, index) => (
                <article
                  key={meal.id}
                  className="
                    rounded-2xl border border-(--line) bg-(--surface) p-4 
                    transition-[transform,box-shadow,border-color] duration-300
                    hover:-translate-y-0.5 hover:border-(--accent) hover:shadow-lg
                  "
                  style={{
                    animation: `fadeUp 0.35s ease ${index * 40}ms both`,
                  }}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-(--text-main)">
                        {meal.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span 
                          className={`
                            rounded-full border border-(--line) bg-(--surface-muted) 
                            px-2 py-0.5 font-semibold text-(--text-main) 
                            ${typeLabelClass(meal.meal_type)}
                          `}
                        >
                          {meal.meal_type}
                        </span>
                        <span className="text-(--text-muted)">
                          {formatDate(meal.meal_date)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopyMeal(meal)}
                        className="
                            rounded-lg border border-(--line) bg-(--surface-elevated) px-2.5 py-1 text-xs font-semibold 
                            text-(--text-main) transition duration-200 hover:-translate-y-0.5 hover:bg-(--surface-muted)
                          "
                      >
                        Copy
                      </button>

                      <button
                        onClick={() => onEditMeal?.(meal)}
                        className="
                          rounded-lg border border-(--line) bg-(--surface-elevated) px-2.5 py-1 text-xs font-semibold 
                          text-(--text-main) transition duration-200 hover:-translate-y-0.5 hover:bg-(--surface-muted)
                        "
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(meal.id)}
                        className="
                          rounded-lg border border-rose-300 bg-rose-100 px-2.5 py-1 text-xs font-semibold 
                          text-rose-700 transition duration-200 hover:-translate-y-0.5 hover:bg-rose-200 
                          dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-900/60
                        "
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}

            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
        >
          {/* Stop click bubbling */}
          <div
            className="pointer-events-auto flex w-full max-w-2xl items-center justify-center"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <Addmeal
              presetTitle={selectedMeal?.title || ""}
              presetMealType={selectedMeal?.meal_type || ""}
              presetMealDate={selectedMeal?.meal_date?.slice(0, 10)}
              onSaved={() => {
                setSelectedMeal(null);
                setIsOpen(false);
              }}
              onCancelEdit={() => {
                setSelectedMeal(null);
                setIsOpen(false);
              }}
              onClose={() => {
                setSelectedMeal(null);
                setIsOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </section>
  )
}
