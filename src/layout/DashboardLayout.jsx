import { useState } from "react"
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex bg-transparent">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
            <Header isOpen={isOpen} setIsOpen={setIsOpen} />

            <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6">
                <Outlet />
            </div>
        </main>
    </div>
  )
}
