// Dashborad greetings
export const dateStr = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  day: "2-digit",
  month: "short"
});

export const formatted = dateStr.replace(/^(\w+)\s/, "$1, ");

export const getGreeting = (date = new Date()) => {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

// Meallist format date and day
export const formatDate = (value) => {
  if (!value) return "No date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export const formatDay = (value) => {
  const date = new Date(value);
  
  if (Number.isNaN(date.getTime())) return "Unknown day";

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
};

export const formatAsKey = (value) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Meals today
export const getTodayKey = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
};

export const formatBadgeDate = (date = new Date()) => ({
  day: date.getDate(),
  weekday: date.toLocaleDateString(undefined, { weekday: "short" }),
});

// Upcoming meals date
export const formatUpcomingDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

// calendar/week
export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getWeekDays = (weekStart) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (weekStart === "monday") {
    return [...days.slice(1), days[0]];
  }

  return days;
};

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const toDateKey = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

export const buildMonthGrid = (monthDate) => {
  const year = monthDate.getFullYear();
  const monthIndex = monthDate.getMonth();

  const firstOfMonth = new Date(year, monthIndex, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, monthIndex, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return {
      date,
      key: toDateKey(date),
      inCurrentMonth: date.getMonth() === monthIndex,
    };
  });
};

export const buildWeek = (date = new Date(), weekStart = "sunday") => {
    const start = new Date(date);

    const dayIndex = start.getDay();
    const weekStartIndex = weekStart === "monday" ? 1 : 0;  // 0 = Sun...6 = Sat

    // Shift back to the chosen week start
    const diff = (dayIndex - weekStartIndex + 7) % 7;
    start.setDate(start.getDate() - diff);

    const labels = getWeekDays(weekStart);

    return Array.from({ length: 7}, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);

        return {
            date: d,
            key: toDateKey(d),
            label: labels[i],
        };
    });
};

// Groceries
export const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);

  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${d.getFullYear()}-${month}-${day}`;
};