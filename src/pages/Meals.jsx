import { useState } from "react"
import { SearchBar } from "../components/SearchBar";
import { Addmeal } from "../components/Addmeal";
import { MealList } from "../components/MealList";
import { FilterMenu } from "../components/FilterMenu";

export const Meals = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMeal, setEditingMeal] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: "all",
    types: [],
  });
  const [sortBy, setSortBy] = useState("date_desc");

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setIsOpen(true);
  };


  return (
    <div className="flex flex-col">
      <section className="mb-4">
        <h1 className="text-2xl font-bold text-(--text-main)">Meals</h1>
        <p className="mt-1 text-sm text-(--text-muted)">Add, edit, and manage all planned meals in one place.</p>
      </section>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <SearchBar 
            placeholder="Search meals..." 
            value={searchTerm} 
            setValue={setSearchTerm} 
          />
          <FilterMenu
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        <button 
          onClick={() => setIsOpen(true)}
          className="w-full rounded-lg bg-(--accent) px-3 py-2 text-sm font-semibold text-[#2f2710] transition hover:bg-(--accent-strong) sm:w-auto">
          Add meal
        </button>

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
                editingMeal={editingMeal}
                onSaved={() => {
                  setEditingMeal(null);
                  setIsOpen(false);
                }}
                onCancelEdit={() => {
                  setEditingMeal(null);
                  setIsOpen(false);
                }}
                onClose={() => {
                  {
                    setIsOpen(false);
                    setEditingMeal(null);
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <MealList
          searchTerm={searchTerm}
          filters={filters}
          sortBy={sortBy}
          onEditMeal={handleEditMeal}
        />
      </div>
    </div>
  )
}

