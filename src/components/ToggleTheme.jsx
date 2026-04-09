import { Icon } from "@iconify/react";
import { useTheme } from "../hooks/useTheme";

export const ToggleTheme = ({ compact = false }) => {
    const { isDark, setIsDark } = useTheme();
    const toggleTheme = () => setIsDark(!isDark);

  return (
    <div
      className={`relative overflow-hidden transition-[width] duration-300 ease-in-out ${
        compact ? "w-12 h-10" : "w-full"
      }`}
    >
      <button
        type="button"
        onClick={toggleTheme}
        className={`
          flex items-center justify-center rounded-xl border border-(--line) 
          bg-(--surface-elevated) text-(--text-main) transition-[opacity,transform] duration-300 
          hover:bg-(--surface-muted)
          ${
            compact
              ? "opacity-100 scale-100 relative w-full h-full"
              : "pointer-events-none opacity-0 scale-95 absolute inset-0"
          }
        `}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <Icon
          icon={isDark ? "ph:moon-stars-fill" : "ph:sun-fill"}
          className="text-xl text-(--accent)"
        />
      </button>

      <div
        className={`
          flex items-center justify-between rounded-xl border border-(--line) bg-(--surface-muted) 
          px-2 py-1 transition-[opacity,transform] duration-300 min-h-10
          ${
            compact
              ? "pointer-events-none opacity-0 scale-95 absolute inset-0"
              : "opacity-100 scale-100 relative"
          }
        `}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-(--surface-elevated)">
            <Icon
              icon={isDark ? "ph:moon-stars-fill" : "ph:sun-fill"}
              className="text-base text-(--accent)"
            />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-(--text-main)">Theme</p>
            <p className="text-xs text-(--text-muted) whitespace-nowrap">
              {isDark ? "Dark mode" : "Light mode"}
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isDark}
            onChange={toggleTheme}
            aria-label="Toggle dark mode"
          />
          <div className="h-5 w-11 rounded-full bg-gray-300 transition-colors duration-300 peer-checked:bg-(--accent) dark:bg-gray-600"></div>
          <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 peer-checked:translate-x-6"></div>
        </label>
      </div>
    </div>
  );
}
