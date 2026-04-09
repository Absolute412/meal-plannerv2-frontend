import { createContext, useEffect, useMemo, useState } from "react";
import axios from "../api/axiosInstance";
import { useAuth } from "../hooks/useAuth";

export const MealContext = createContext();

export const MealProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [meals, setMeals] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [mealError, setMealError] = useState("");

  const normalizeError = (err, fallback) => {
    const detail = err?.response?.data?.detail;
    if (Array.isArray(detail)) {
      const message = detail
        .map((item) => item?.msg || item?.detail || item?.message)
        .filter(Boolean)
        .join(" ");
      if (message) return message;
    }
    if (detail && typeof detail === "object") {
      return detail.message || fallback;
    }
    return detail || err?.message || fallback;
  };

  const fetchMeals = async (mealDate) => {
    if (!isAuthenticated) {
      return;
    }

    setLoadingMeals(true);
    setMealError("");
    try {
      const params = mealDate ? { meal_date: mealDate } : {};
      const res = await axios.get("/meals/", { params });
      setMeals(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setMealError(normalizeError(err, "Failed to fetch meals."));
    } finally {
      setLoadingMeals(false);
    }
  };

  const addMeal = async (payload) => {
    setMealError("");
    try {
      const res = await axios.post("/meals/", payload);
      setMeals((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      const message = normalizeError(err, "Failed to add meal.");
      setMealError(message);
      throw new Error(message);
    }
  };

  const deleteMeal = async (mealId) => {
    setMealError("");
    try {
      await axios.delete(`/meals/${mealId}`);
      setMeals((prev) => prev.filter((meal) => meal.id !== mealId));
    } catch (err) {
      const message = normalizeError(err, "Failed to delete meal.");
      setMealError(message);
      throw new Error(message);
    }
  };

  const updateMeal = async (mealId, payload) => {
    setMealError("");
    try {
      const res = await axios.put(`/meals/${mealId}`, payload);
      setMeals((prev) =>
        prev.map((meal) => (meal.id === mealId ? res.data : meal))
      );
      return res.data;
    } catch (err) {
      const message = normalizeError(err, "Failed to update meal.");
      setMealError(message);
      throw new Error(message);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setMeals([]);
      setMealError("");
      return;
    }

    fetchMeals();
  }, [isAuthenticated, authLoading]);

  const value = useMemo(
    () => ({
      meals,
      loadingMeals,
      mealError,
      fetchMeals,
      addMeal,
      updateMeal,
      deleteMeal,
    }),
    [meals, loadingMeals, mealError]
  );

  return (
    <MealContext.Provider value={value}>
      {children}
    </MealContext.Provider>
  );
};
