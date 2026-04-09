import { createContext, useEffect, useState } from "react";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [weekStart, setWeekStart] = useState(
        localStorage.getItem("weekStart") || "monday"
    );
    
    const [defaultView, setDefaultView] = useState(
        localStorage.getItem("defaultView") || "week"
    );

    useEffect(() => {
        localStorage.setItem("weekStart", weekStart);
        localStorage.setItem("defaultView", defaultView);
    }, [weekStart, defaultView]);
    
    return (
        <SettingsContext.Provider value={{weekStart, setWeekStart, defaultView, setDefaultView}}>
            {children}
        </SettingsContext.Provider>
    ); 
}