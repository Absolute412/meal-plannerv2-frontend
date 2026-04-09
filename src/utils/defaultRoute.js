export const getDefaultRoute = (defaultView) => {
    switch (defaultView) {
        case "calendar": return "/calendar";
        case "meals": return "/meals";
        case "week":
            default: return "/dashboard";
    }
};
