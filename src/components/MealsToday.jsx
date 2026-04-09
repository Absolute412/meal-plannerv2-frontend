import { MealCard } from "./MealCard";
import { useMeals } from "../hooks/useMeals";
import { getTodayKey, MEAL_TYPES, normalizeType, typeDotClass, formatBadgeDate } from "../constants";

const MealItems = ({ items, emptyText }) => {
  if (!items.length) {
    return <p className="text-xs text-(--text-muted)">{emptyText}</p>;
  }

  return (
    <ul className="custom-scrollbar max-h-28.5 space-y-1.5 overflow-y-auto pr-1">
      {items.map((meal) => (
        <li
          key={meal.id}
          className="group flex items-center gap-2 rounded-xl border border-(--line) bg-(--surface) px-2.5 py-2 text-xs text-(--text-main) shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${typeDotClass(meal.meal_type)}`}
            aria-hidden="true"
          />
          <span className="truncate font-medium">{meal.title}</span>
        </li>
      ))}
    </ul>
  );
};

const MealTypeList = ({ rows }) => (
  <ul className="custom-scrollbar max-h-28.5 space-y-1.5 overflow-y-auto pr-1">
    {rows.map((row) => (
      <li
        key={row.type}
        className="flex items-center gap-2 rounded-xl border border-(--accent-soft) bg-(--surface) px-2.5 py-1.5 text-xs text-(--text-main) shadow-sm"
      >
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${typeDotClass(row.type)}`}
          aria-hidden="true"
        />
        <p className="truncate">{row.value}</p>
      </li>
    ))}
  </ul>
);

export const MealsToday = () => {
  const { meals, loadingMeals } = useMeals();

  const todayKey = getTodayKey();
  const mealsToday = meals.filter((meal) => meal.meal_date?.slice(0, 10) === todayKey);

  const groupedMeals = mealsToday.reduce(
    (acc, meal) => {
      const bucket = normalizeType(meal.meal_type);
      if (!bucket) return acc;
      acc[bucket].push(meal);
      return acc;
    },
    { Breakfast: [], Lunch: [], Dinner: [], Snack: [] }
  );

  const todayRows = MEAL_TYPES.map((type) => ({
    type,
    value: groupedMeals[type].length
      ? groupedMeals[type].map((meal) => meal.title).join(", ")
      : `No ${type.toLowerCase()} meal.`,
  }));

  if (groupedMeals.Snack.length) {
    todayRows.push({
      type: "Snacks",
      value: groupedMeals.Snack.map((meal) => meal.title).join(", "),
    });
  }

  if (loadingMeals) {
    return (
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-56 animate-pulse rounded-2xl border border-(--line) bg-(--surface-elevated)"
          />
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MealCard title="Meals Today" badge={formatBadgeDate()} accent="Today" tag="Summary">
        <MealTypeList rows={todayRows} />
      </MealCard>

      {MEAL_TYPES.map((type) => (
        <MealCard
          key={type}
          title={type}
          tag={type}
          countLabel={`${groupedMeals[type].length} meal(s)`}
        >
          <MealItems
            items={groupedMeals[type]}
            emptyText={`No ${type.toLowerCase()} planned for today.`}
          />
        </MealCard>
      ))}
    </section>
  );
};
