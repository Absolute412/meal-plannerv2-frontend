import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { dateOptions, sortOptions, typeOptions } from "../constants";

export const FilterMenu = ({ filters, setFilters, sortBy, setSortBy }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("filter");

  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  return (
    <div
      ref={filterRef}
      className="relative"
    >
      <button 
        onClick={() => setFilterOpen((prev => !prev))}
        className="
        w-full rounded-lg bg-(--accent) px-3 py-2 text-sm font-semibold 
        text-[#2f2710] transition hover:bg-(--accent-strong) sm:w-auto"
      >
        <Icon icon="mi:filter" className="text-xl" />
      </button>

      {filterOpen && (
        <div 
          className="
            absolute right-0 sm:left-0 top-full z-20 mt-2 w-64 rounded-2xl border border-(--line)
            bg-(--surface-elevated) p-4 shadow-xl backdrop-blur
          "
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-xl border border-(--line) bg-(--surface) p-1 text-xs font-semibold uppercase tracking-wide text-(--text-muted)">
              <button
                type="button"
                onClick={() => setActiveTab("filter")}
                className={`flex-1 rounded-lg px-2.5 py-1.5 transition ${
                  activeTab === "filter"
                    ? "bg-(--accent-soft) text-(--accent-strong)"
                    : "hover:bg-(--surface-muted)"
                }`}
              >
                Filter
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sort")}
                className={`flex-1 rounded-lg px-2.5 py-1.5 transition ${
                  activeTab === "sort"
                    ? "bg-(--accent-soft) text-(--accent-strong)"
                    : "hover:bg-(--surface-muted)"
                }`}
              >
                Sort
              </button>
            </div>

            {activeTab === "filter" ? (
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-(--text-muted)">Date range</p>
                  <div className="mt-2 space-y-2 text-sm">
                    {dateOptions.map((date) => (
                      <label key={date.value} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="dateRange"
                          value={date.value}
                          checked={filters.dateRange === date.value}
                          onChange={() =>
                            setFilters((prev) => ({ ...prev, dateRange: date.value }))
                          }
                          className="peer sr-only"
                        />
                        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-(--line) bg-(--surface) transition peer-checked:border-(--accent-strong) peer-checked:bg-(--accent)">
                          <span className="h-2 w-2 rounded-full bg-white opacity-0 transition peer-checked:opacity-100" />
                        </span>
                        <span>{date.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-(--line)" />

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-(--text-muted)">Meal type</p>
                  <div className="mt-2 space-y-2 text-sm">
                    {typeOptions.map((type) => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={type}
                          checked={filters.types.includes(type)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFilters((prev) => ({
                              ...prev,
                              types: checked
                                ? [...prev.types, type]
                                : prev.types.filter((item) => item !== type),
                            }));
                          }}
                          className="peer sr-only"
                        />
                        <span className="flex h-4 w-4 items-center justify-center rounded border border-(--line) bg-(--surface) transition peer-checked:border-(--accent-strong) peer-checked:bg-(--accent)">
                          <span className="h-2 w-2 rounded-sm bg-white opacity-0 transition peer-checked:opacity-100" />
                        </span>
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-(--text-muted)">Sort by</p>
                <div className="mt-2 space-y-2 text-sm">
                  {sortOptions.map((option) => (
                    <label key={option.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={sortBy === option.value}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="peer sr-only"
                      />
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-(--line) bg-(--surface) transition peer-checked:border-(--accent-strong) peer-checked:bg-(--accent)">
                        <span className="h-2 w-2 rounded-full bg-white opacity-0 transition peer-checked:opacity-100" />
                      </span>
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


