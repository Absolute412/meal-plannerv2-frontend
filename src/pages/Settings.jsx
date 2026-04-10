import { useTheme } from "../hooks/useTheme";
import { useSettings } from "../hooks/useSettings";
// import { useState } from "react";

export const Settings = () => {
  const { isDark, setIsDark } = useTheme();
  const { weekStart, setWeekStart, defaultView, setDefaultView } = useSettings();
  
  // const [notifications, setNotifications] = useState(true);

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-(--text-main)">Settings</h1>
        <p className="text-sm text-(--text-muted)">Customize your experience.</p>
      </div>

      <section className="rounded-3xl border border-(--line) bg-(--surface-elevated) p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-(--text-main)">Appearance</h2>
        <p className="text-sm text-(--text-muted)">Theme and display preferences.</p>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-(--line) bg-(--surface) px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-(--text-main)">Dark mode</p>
              <p className="text-xs text-(--text-muted)">Toggle the dark theme.</p>
            </div>
            <label className="relative inline-flex items-center">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isDark}
              onChange={() => setIsDark(!isDark)}
              aria-label="Toggle dark mode"
            />
            <div className="h-6 w-12 rounded-full bg-gray-300 transition-colors duration-300 peer-checked:bg-(--accent) dark:bg-gray-600"></div>
            <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 peer-checked:translate-x-6"></div>
          </label>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-(--line) bg-(--surface-elevated) p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-(--text-main)">Planner</h2>
        <p className="text-sm text-(--text-muted)">Defaults for your meal planning.</p>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-(--line) bg-(--surface) px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-(--text-main)">Week starts on</p>
              <p className="text-xs text-(--text-muted)">Choose the first day of your week.</p>
            </div>
            <select
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
              className="rounded-xl border border-(--line) bg-(--surface) px-3 py-2 text-sm text-(--text-main)"
            >
              <option value="monday">Monday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-(--line) bg-(--surface) px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-(--text-main)">Default view</p>
              <p className="text-xs text-(--text-muted)">Open the planner in your preferred view.</p>
            </div>
            <select
              value={defaultView}
              onChange={(e) => setDefaultView(e.target.value)}
              className="rounded-xl border border-(--line) bg-(--surface) px-3 py-2 text-sm text-(--text-main)"
            >
              <option value="week">Dashboard</option>
              <option value="calendar">Calendar</option>
              <option value="meals">Meals list</option>
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-(--line) bg-(--surface-elevated) p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-(--text-main)">Notifications</h2>
        <p className="text-sm text-(--text-muted)">Coming in V2.</p>

        <div className="mt-4">
          <div className="flex items-center justify-between rounded-2xl border border-(--line) bg-(--surface) px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-(--text-main)">Meal reminders</p>
              <p className="text-xs text-(--text-muted)">Reminders aren't available yet. We'll enable this in V2.</p>
            </div>
            <span className="rounded-full border border-(--line) bg-(--surface-elevated) px-3 py-1 text-xs text-(--text-muted)">
              Coming soon
            </span>
            {/* <label className="relative inline-flex items-center">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                aria-label="Toggle meal reminders"
              />
              <div className="h-6 w-12 rounded-full bg-gray-300 transition-colors duration-300 peer-checked:bg-(--accent) dark:bg-gray-600"></div>
              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 peer-checked:translate-x-6"></div>
            </label> */}
          </div>
        </div>
      </section>
    </div>
  );
}
