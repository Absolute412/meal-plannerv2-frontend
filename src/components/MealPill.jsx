import { toast } from "react-toastify";
import { typeLabelClass } from "../constants";

export const MealPill = ({
    meal,
    isMobile,
    draggingMealId,
    selectedMealToMove,
    setDraggingMealId,
    setSelectedMealToMove,
}) => {
    return (
        <li
            draggable={!isMobile}
            onDragStart={(e) => {
                if (!isMobile) {
                    e.dataTransfer.setData("mealId", meal.id);
                    e.dataTransfer.effectAllowed = "move";
                    setDraggingMealId(meal.id);
                }
            }}
            onDragEnd={() => {
                if (!isMobile) setDraggingMealId(null);
            }}
            onClick={(e) => {
                e.stopPropagation();
                if (isMobile) {
                    if (selectedMealToMove === meal.id) {
                        setSelectedMealToMove(null);
                        return;
                    }
                    setSelectedMealToMove(meal.id);
                    toast.info("Select a day to move this meal");
                }
            }}
            className={`
                cursor-grab truncate rounded-md px-1.5 py-0.5 
                text-[10px] sm:text-[11px] font-semibold 
                ${typeLabelClass(meal.meal_type)} 
                ${draggingMealId === meal.id ? "opacity-60" : ""}
                ${selectedMealToMove === meal.id ? "ring-2 ring-(--accent) opacity-80 scale-[1.02]" : ""}
            `}
            title={`${meal.meal_type}: ${meal.title}`}
            role="button"
        >
            {meal.meal_type}: {meal.title}
        </li>
    );
};
