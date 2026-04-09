import { useMeals } from "../hooks/useMeals";
import { formatUpcomingDate, getTodayKey, mealOrder, typeLabelClass, } from "../constants";

export const UpcomingMeals = () => {
  const { meals, loadingMeals } = useMeals();
  const todayKey = getTodayKey();

  const upcomingMeals = meals
    .filter((meal) => meal.meal_date?.slice(0, 10) > todayKey)
    .sort((a, b) => {
      const dateDiff = new Date(a.meal_date) - new Date(b.meal_date)
      if (dateDiff !== 0) return dateDiff;

      return mealOrder[a.meal_type] - mealOrder[b.meal_type];
    })
    .slice(0, 8);

  if (loadingMeals) {
    return (
      <section className="rounded-2xl border border-(--line) bg-(--surface-elevated) p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-40 animate-pulse rounded-xl bg-(--surface) ring-1 ring-(--line)" />
          <div className="h-7 w-24 animate-pulse rounded-full bg-(--surface) ring-1 ring-(--line)" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-xl border border-(--line) bg-(--surface)"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-(--line) bg-(--surface-elevated) p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-(--text-main)">Upcoming Meals</h2>
        <span className="rounded-full border border-(--line) bg-(--accent-soft) px-2.5 py-1 text-xs font-semibold text-(--text-main)">
          {upcomingMeals.length} planned
        </span>
      </div>

      {upcomingMeals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-(--line) bg-(--surface) p-4 text-sm text-(--text-muted)">
          No upcoming meals yet. Add a future meal to see it here.
        </div>
      ) : (
        <div className="custom-scrollbar max-h-76 space-y-2 overflow-y-auto pr-1">
          {upcomingMeals.map((meal) => (
            <article
              key={meal.id}
              className="flex flex-col gap-2 rounded-xl border border-(--line) bg-(--surface) transition duration-200 hover:-translate-y-0.5 hover:shadow-md p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-(--text-main)">
                  {meal.title}
                </p>
                <p className="text-xs text-(--text-muted)">
                  {formatUpcomingDate(meal.meal_date)}
                </p>
              </div>

              <span
                className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${typeLabelClass(meal.meal_type)}`}
              >
                {meal.meal_type}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
