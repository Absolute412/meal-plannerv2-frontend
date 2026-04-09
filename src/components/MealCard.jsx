import { MEAL_STYLES } from "../constants";

export const MealCard = ({
  title,
  subtitle,
  badge,
  tag,
  accent,
  countLabel,
  children,
  className = "",
}) => {
  const tagInitial = tag?.trim().charAt(0).toUpperCase();
  const accentValue = accent || tag || "";

  const key = Object.keys(MEAL_STYLES).find(k =>
    accentValue.toLowerCase().includes(k)
  ) || "summary";

  const style = MEAL_STYLES[key];
  const showAccent = Boolean(accentValue);
  const isTodayAccent = accentValue.toLowerCase().includes("today") || (tag || "").toLowerCase().includes("summary");
  const badgeClassName = isTodayAccent
    ? "border-sky-200 bg-sky-100 text-sky-800 dark:border-sky-500/40 dark:bg-sky-900/40 dark:text-sky-200"
    : "border-(--accent) bg-(--accent-soft) text-(--accent-strong)";

  return (
    <article
      className={`relative flex h-52.5 flex-col overflow-hidden rounded-2xl border border-(--line) bg-(--surface-elevated) p-3.5 text-(--text-main) shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:h-55 ${className}`}
    >
      {showAccent ? (
        <>
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r ${style.accent}`}
          />
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl ${style.glow}`}
          />
        </>
      ) : null}

      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3
            className={`text-sm font-bold uppercase tracking-[0.12em] sm:text-base ${style.title}`}
          >
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-xs text-(--text-muted) sm:text-sm">{subtitle}</p>
          ) : null}
        </div>

        {badge ? (
          <div className={`flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-full border text-center leading-tight ${badgeClassName}`}>
            <span className="text-xs font-bold">
              {badge.day}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wide">
              {badge.weekday}
            </span>
          </div>
        ) : tagInitial ? (
          <div
            className={`
              flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-(--line) 
              text-xs font-bold text-(--text-main) shadow-sm ${style.label}
            `}
          >
            {tagInitial}
          </div>
        ) : null}
      </header>

      {(tag || countLabel) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {tag ? (
            <span 
              className={`
                rounded-full border border-(--line) px-3 py-1 text-[11px] font-semibold tracking-wide text-(--text-main) shadow-sm
                ${style.label}
              `}
            >
              {tag}
            </span>
          ) : (
            <span />
          )}
          {countLabel ? (
            <span className="rounded-full border border-(--line) bg-(--surface) px-3 py-1 text-xs font-semibold text-(--text-main) sm:text-sm">
              {countLabel}
            </span>
          ) : null}
        </div>
      )}

      <div className="min-h-0 flex-1">{children}</div>
    </article>
  );
};
