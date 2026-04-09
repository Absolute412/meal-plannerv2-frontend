import { Icon } from "@iconify/react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToggleTheme } from "./ToggleTheme";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <Icon icon="cuida:dashboard-outline" />
  },
  {
    name: "Meals",
    path: "/meals",
    icon: <Icon icon="ep:food" />
  },
  {
    name: "Recipes",
    path: "/recipes",
    icon: <Icon icon="hugeicons:cook-book" />
  },
  {
    name: "Calendar",
    path: "/calendar",
    icon: <Icon icon="lucide:calendar-1" />
  },
  {
    name: "Week view",
    path: "/week-plan",
    icon: <Icon icon="mdi:timetable" />
  },
  {
    name: "Groceries",
    path: "/groceries",
    icon: <Icon icon="boxicons:groceries" />
  },
]

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {isOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/45 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-(--line) bg-(--surface-elevated)
          shadow-lg transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none lg:overflow-visible
          lg:transition-[width] lg:duration-300 lg:ease-in-out
          w-64
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
      <div 
        className={`
          flex items-center justify-between lg:justify-start gap-2 p-4 lg:relative lg:overflow-hidden lg:min-h-17
          lg:transition-[padding,gap] lg:duration-300 lg:ease-in-out
        `}
      >
        <h1
          className={`
            text-xl font-bold text-black transition-[opacity,max-width,transform] duration-300 ease-in-out dark:text-white 
            ${collapsed
              ? "lg:max-w-0 lg:overflow-hidden lg:opacity-0 lg:translate-x-0"
              : "lg:max-w-40 lg:opacity-100 lg:translate-x-0"
            }`}
        >
          Menu
        </h1>
        
        {/* Collapse button */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className={`
            hidden h-9 w-9 items-center justify-center rounded 
            bg-(--surface-muted) transition-[transform,opacity] duration-300 
            ease-in-out lg:inline-flex lg:opacity-100
            ${collapsed
              ? "lg:scale-105 lg:relative ml-auto -translate-x-1.5"
              : "lg:scale-100 lg:ml-auto"
            }
          `}
        >
          <Icon 
            icon={collapsed ? "lucide:skip-forward" : "lucide:skip-back"} 
            className="text-xl hover:text-(--accent) transition-transform duration-300 ease-in-out" 
          />
        </button>

        {/* Mobile close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-lg border border-(--line) bg-(--surface-muted) p-1 text-(--text-main) lg:hidden"
        >
          <Icon 
            icon="iconamoon:close-fill" 
            className="text-xl font-bold"
          />
        </button>

      </div>
      {/* Navigation */}
      <div className="relative space-y-2 p-4 lg:transition-[padding] lg:duration-300 lg:ease-in-out">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
               transition-[background-color,color,transform] duration-300 
               ${
                isActive
                  ? collapsed
                    ? "bg-(--accent) text-[#2f2710] shadow-sm ring-1 ring-(--accent)"
                    : "bg-(--accent) text-[#2f2710]"
                  : "text-(--text-main) hover:bg-(--surface-muted)"
              }`
            }
          >
            <span
              className={`text-xl transition-transform duration-300 ease-in-out ${
                collapsed ? "lg:scale-105" : "lg:scale-100"
              }`}
            >
              {item.icon}
            </span>
            <span
              className={`font-bold text-base whitespace-nowrap transition-[opacity,max-width] duration-300 ease-in-out ${
                collapsed
                  ? "lg:max-w-0 lg:overflow-hidden lg:opacity-0"
                  : "lg:max-w-40 lg:opacity-100"
              }`}
            >
              {item.name}
            </span>

            {collapsed && (
              <div 
              className={`
                hidden lg:block absolute left-full rounded-md px-2 py-1 ml-4 bg-(--accent) dark:text-(--surface-muted) text-sm
                invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100
                group-hover:translate-x-0 whitespace-nowrap
              `}
              >
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </div>
      <div 
        className={`
          mt-auto flex flex-col gap-2 p-4 lg:relative lg:overflow-hidden lg:transition-[padding,gap] lg:duration-300 lg:ease-in-out 
        `}
      >
        <div className="hidden lg:flex w-full">
          <ToggleTheme compact={collapsed} />
        </div>
        <div className="flex lg:hidden">
          <ToggleTheme />
        </div>
        <div>
          <button
            onClick={handleLogout}
            className={`
              hidden lg:flex w-full items-center gap-2 rounded-xl border border-rose-300 bg-rose-100 
              text-sm font-semibold text-rose-700 transition duration-200 hover:bg-rose-200
              dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-900/60
              px-3 py-2 justify-between
              ${collapsed ? "lg:relative" : ""}
            `}
          >
            <span
              className={`font-bold text-base whitespace-nowrap transition-[opacity,max-width,transform] duration-300 ease-in-out ${
                collapsed
                  ? "lg:max-w-0 lg:overflow-hidden lg:opacity-0 lg:translate-x-0"
                  : "lg:max-w-40 lg:opacity-100 lg:translate-x-0"
              }`}
            >
              Logout
            </span>
            <span 
              className={`text-xl transition-[transform,opacity] duration-300 
                ease-in-out lg:inline-flex lg:opacity-100 ${
                collapsed
                  ? "lg:scale-105 lg:relative lg:-translate-x-1.5"
                  : "lg:scale-100"
              }`}
            >
              <Icon icon="material-symbols:logout" className="text-xl" />
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="
              w-full rounded-xl border border-rose-300 bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700
              transition duration-200 hover:bg-rose-200 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200
              dark:hover:bg-rose-900/60 lg:hidden
            "
          >
            Logout
          </button>
        </div>
      </div>
      </aside>
    </>
  );
};
