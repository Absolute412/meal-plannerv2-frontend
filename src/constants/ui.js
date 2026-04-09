export const MEAL_STYLES = {
  summary: {
    title: "text-sky-700 dark:text-sky-200",
    label: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
    accent: "from-sky-300/70 via-sky-200/40 to-transparent dark:from-sky-400/30 dark:via-sky-300/15",
    glow: "bg-sky-200/60 dark:bg-sky-400/20",
    dot: "bg-(--accent)"
  },
  breakfast: {
    title: "text-amber-700 dark:text-amber-200",
    label: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    accent: "from-amber-300/70 via-amber-200/40 to-transparent dark:from-amber-400/30 dark:via-amber-300/15",
    glow: "bg-amber-200/60 dark:bg-amber-400/20",
    dot: "bg-amber-400"
  },
  lunch: {
    title: "text-emerald-700 dark:text-emerald-200",
    label: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    accent: "from-emerald-300/70 via-emerald-200/40 to-transparent dark:from-emerald-400/30 dark:via-emerald-300/15",
    glow: "bg-emerald-200/60 dark:bg-emerald-400/20",
    dot: "bg-emerald-400"
  },
  dinner: {
    title: "text-indigo-700 dark:text-indigo-200",
    label: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
    accent: "from-indigo-300/70 via-indigo-200/40 to-transparent dark:from-indigo-400/30 dark:via-indigo-300/15",
    glow: "bg-indigo-200/60 dark:bg-indigo-400/20",
    dot: "bg-indigo-400"
  },
  snack: {
    title: "text-rose-700 dark:text-rose-200",
    label: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
    accent: "from-rose-300/70 via-rose-200/40 to-transparent dark:from-rose-400/30 dark:via-rose-300/15",
    glow: "bg-rose-200/60 dark:bg-rose-400/20",
    dot: "bg-rose-400"
  }
}

export const getMealStyle = (value = "") => {
  const key = value.trim().toLowerCase();

  return MEAL_STYLES[key] || MEAL_STYLES.snack;
};

export const typeLabelClass = (type) => getMealStyle(type).label;
export const cardAccentClass = (type) => getMealStyle(type).accent;
export const cardGlowClass = (type) => getMealStyle(type).glow;
export const titleToneClass = (type) => getMealStyle(type).title;
export const typeDotClass = (type) => getMealStyle(type).dot;

export const normalizeType = (value = "") => {
  const normalized = value.toLowerCase();
  if (normalized.includes("breakfast")) return "Breakfast";
  if (normalized.includes("lunch")) return "Lunch";
  if (normalized.includes("dinner")) return "Dinner";
  if (normalized.includes("snack")) return "Snack";
  return null;
};
