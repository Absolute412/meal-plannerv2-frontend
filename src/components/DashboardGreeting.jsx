import { Icon } from "@iconify/react";
import { formatAsKey, formatted, getGreeting } from "../constants";
import { useMeals } from "../hooks/useMeals";

export const DashboardGreeting = ({ name = "" }) => {
  const { meals, loadingMeals } = useMeals()
  const greeting = getGreeting();
  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour < 18;
  const suffix = name ? `, ${name}` : "";

  const today = new Date();
  const todayKey = formatAsKey(today);

  const mealsToday = meals.filter(
    (meal) => meal.meal_date?.slice(0, 10) === todayKey
  );

  if (loadingMeals) {
    return (
      <section
        className="
          relative overflow-hidden rounded-2xl border border-(--line) bg-linear-to-br from-(--surface) 
          to-(--surface-elevated) px-4 py-4 shadow-sm sm:px-5 sm:py-5"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-(--accent-soft) opacity-70 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-14 h-32 w-32 rounded-full bg-(--accent) opacity-15 blur-3xl" />
        <div className="relative flex items-center gap-2">
          <div className="h-9 w-9 animate-pulse rounded-full bg-(--surface-elevated) ring-1 ring-(--line)" />
          <div className="h-5 w-28 animate-pulse rounded-full bg-(--surface-elevated) ring-1 ring-(--line)" />
        </div>
        <div className="mt-4 h-7 w-56 animate-pulse rounded-xl bg-(--surface-elevated) ring-1 ring-(--line) sm:h-8" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded-xl bg-(--surface-elevated) ring-1 ring-(--line)" />
        <div className="mt-2 h-0.5 w-10 rounded-full bg-(--accent)" />
        <div className="mt-3 h-4 w-40 animate-pulse rounded-xl bg-(--surface-elevated) ring-1 ring-(--line)" />
      </section>
    );
  }

  return (
    <section 
      className="
        relative overflow-hidden rounded-2xl border border-(--line) bg-linear-to-br from-(--surface) 
        to-(--surface-elevated) px-4 py-4 shadow-sm sm:px-5 sm:py-5"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-(--accent-soft) opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-14 h-32 w-32 rounded-full bg-(--accent) opacity-15 blur-3xl" />
      <div className="relative flex items-center gap-2">
        <span 
          className="
            grid h-9 w-9 place-items-center rounded-full bg-(--surface-elevated) 
            text-(--text-main) shadow-md ring-1 ring-(--line) dark:shadow-white/10"
        >
          {isDaytime ? (
            <Icon icon="line-md:sunny-loop" />
          ) : (
            <Icon icon="line-md:moon-loop" />
          )}
        </span>
        <p className="rounded-full border border-(--line) bg-(--surface-elevated) px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-(--text-muted)">
          {formatted}
        </p>
      </div>
      <h2 className="mt-4 text-xl font-semibold text-(--text-main) sm:text-2xl">
        {greeting}{suffix}
      </h2>
      <p className="mt-1 text-sm text-(--text-muted) sm:text-base">
        {mealsToday.length > 0
          ? `You have ${mealsToday.length} meal${mealsToday.length > 1 ? "s" : ""} planned for today.`
          : "You have no meals planned today."
        }
      </p>
      <div className="mt-2 h-0.5 w-10 rounded-full bg-(--accent)" />

      <p className="mt-3 text-sm text-(--text-muted) leading-relaxed">
        Your meal plan is ready to go.
      </p>
    </section>
  );
};

