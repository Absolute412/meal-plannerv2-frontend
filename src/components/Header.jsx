import { Icon } from "@iconify/react";
import { ProfileDropdown } from "./ProfileDropdown";

export const Header = ({ isOpen, setIsOpen }) => {

  return (
    <header className="sticky top-0 z-40 border-b border-(--line) bg-(--surface-elevated)/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-lg border border-(--line) bg-(--surface-muted) p-2 text-(--text-main) lg:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
            <Icon
                icon={isOpen ? "iconamoon:close-fill" : "stash:burger-classic-duotone"} 
                className="text-xl font-bold"
            />
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white border-(--accent) sm:text-2xl border-b-2">Meal Planner.</h1>
        
        <ProfileDropdown />
      </div>
    </header>
  );
};

