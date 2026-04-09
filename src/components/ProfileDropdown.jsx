import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProfileDropdown = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const navigate = useNavigate()

    const avatarLabel = useMemo(() => {
        const base = (user?.username || user?.email || "").trim();
        return base ? base.charAt(0).toUpperCase() : "?";
    }, [user]);

    const handleLogout = () => {
        setIsOpen(false);
        logout();
        navigate("/login", { replace: true });
    };

    useEffect(() => {
        const handlePointerDown = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("pointerdown", handlePointerDown, true);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown, true);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

  return (
    <div className="relative inline-flex" ref={dropdownRef}>
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className="
            rounded-lg flex items-center gap-2 cursor-pointer 
            transition-transform duration-200 px-2 py-1 w-full"
            aria-expanded={isOpen}
            aria-label="Open user menu"
        >
            <div className="h-10 w-10 rounded-lg border border-(--line) bg-(--accent-soft) flex items-center justify-center text-sm font-bold text-(--text-main)">
                {avatarLabel}
            </div>
            <div className="hidden md:flex flex-col text-left">
                <h1 className="text-sm font-bold text-(--text-main)">{user?.username || "Username"}</h1>
                <p className="text-xs font-semibold text-(--text-muted)">{user?.email || "email"}</p>
            </div>
        </button>

        {isOpen && (
            <div className={`
                absolute right-0 mt-12 min-w-full w-max bg-(--surface-elevated) rounded-2xl
                p-3 sm:p-4 text-sm z-50 shadow-xl border border-black/5 backdrop-blur-md
                transform transition-all duration-200 ease-out origin-top-right
                ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
            `}>
                <div className="flex items-center gap-2 px-3 py-2 mb-1">
                    <div className="flex flex-col text-left">
                        <h1 className="text-sm font-bold text-(--text-main)">{user?.username || "Username"}</h1>
                        <p className="text-xs font-semibold text-(--text-muted)">{user?.email || "email"}</p>
                    </div>
                </div>

                <div className="h-px bg-black/10 dark:bg-white/10 my-1"/>

                <div className="flex flex-col gap-2">
                    <Link 
                        to="/profile" 
                        onClick={() => setIsOpen(false)}
                        className="
                            flex items-center justify-start gap-3 w-full px-3 py-2 text-sm font-medium text-(--text-main)
                            hover:bg-(--surface-muted) rounded-lg transition-colors
                        ">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5">
                            <Icon icon="mdi:account-outline" className="text-lg"/>
                        </span> 
                        Profile
                    </Link>
                    <Link 
                        to="/settings" 
                        onClick={() => setIsOpen(false)}
                        className="
                            flex items-center justify-start gap-3 w-full px-3 py-2 text-sm font-medium text-(--text-main)
                            hover:bg-(--surface-muted) rounded-lg transition-colors
                        ">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5">
                            <Icon icon="line-md:cog-loop" className="text-lg"/>
                        </span> 
                        Settings
                    </Link>

                    <div className="h-px bg-black/10 dark:bg-white/10 my-1"/>
                    <button 
                        onClick={handleLogout}
                        className="
                        flex items-center justify-start gap-3 w-full px-3 py-2 text-sm font-semibold text-rose-700
                        bg-rose-100 hover:bg-rose-200 dark:border-rose-800 dark:bg-rose-950/40 
                        dark:text-rose-200 dark:hover:bg-rose-900/60 rounded-lg transition-colors"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg dark:bg-rose-800/40">
                            <Icon icon="mdi:logout" className="text-lg"/>
                        </span>
                        Logout
                    </button>
                </div>
            </div>
        )}
    </div>
  )
}
