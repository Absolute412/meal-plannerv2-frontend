import { useContext } from "react";
import { MealContext } from "../context/MealContext";

export const useMeals = () => useContext(MealContext);
