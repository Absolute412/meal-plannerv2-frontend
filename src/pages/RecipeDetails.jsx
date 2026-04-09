import axios from "../api/axiosInstance";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Addmeal } from "../components/Addmeal";
import { toast } from "react-toastify";
import { RecipeDetailsSkeleton } from "../components/RecipeDetailsSkeleton";

export const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loadingRecipes, setLoadingRecipes] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [retryKey, setRetryKey] = useState(0);
    const [editingMeal, setEditingMeal] = useState(null);
    const [isAddingGroceries, setIsAddingGroceries] = useState(false);


    useEffect(() => {
        let active = true;

        const fetchRecipe = async () => {
            try {
                setLoadingRecipes(true);
                setError(null);
                setRecipe(null);

                const res = await axios.get(`/recipes/${id}`);
                if (active) {
                    setRecipe(res.data || null);
                }
            } catch (err) {
                console.error(err);
                if (active) {
                    setError("You are offline or the server is unreachable");
                    setRecipe(null);
                }
            } finally {
                if (active) setLoadingRecipes(false);
            }
        };
        fetchRecipe();
        return () => (active = false);
    }, [id, retryKey]);

    const handleAddIngredients = async () => {
        if (!recipe?.ingredients?.length) {
            toast.error("No ingredients available to add.");
            return;
        }

        try {
            setIsAddingGroceries(true);
            const payload = recipe.ingredients.map((ing) => ({
                name: ing.name,
                measure: ing.measure || ""
            }));
            const res = await axios.post("/groceries/bulk", payload);
            const addedCount = res.data.added_count ?? res.data.items_added?.length ?? payload.length;
            const skippedCount = res.data.skipped_count ?? res.data.items_skipped?.length ?? 0;
            const message = skippedCount > 0
                ? `Added ${addedCount} item${addedCount === 1 ? "" : "s"}. Skipped ${skippedCount} duplicate${skippedCount === 1 ? "" : "s"}`
                : `Added ${addedCount} item${addedCount === 1 ? "" : "s"}`
            toast.success(message);
        } catch (err) {
            toast.error(err?.response?.data?.detail || "Could not add ingredients.");
        } finally {
            setIsAddingGroceries(false);
        }
    };

    if (!loadingRecipes && !recipe && !error) {
        return (
            <p className="text-center text-(--text-muted)">
                Recipe not found
            </p>
        );
    }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

        {error && !loadingRecipes && (
            <div>
                <p className="text-center text-red-500">
                    {error}
                </p>

                <button
                    disabled={loadingRecipes}
                    onClick={() => setRetryKey(prev => prev + 1)}
                    className="
                        px-4 py-2 bg-(--accent) hover:bg-(--accent-strong) disabled:opacity-50 
                        disabled:cursor-not-allowed text-(--main) rounded-lg"
                >
                    Retry
                </button>
            </div>
        )}

        {/* Skeleton */}
        {loadingRecipes ? (
            <RecipeDetailsSkeleton />
        ) : (
            <div className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-(--line) bg-(--surface-elevated) shadow-sm">
                    {recipe?.strMealThumb ? (
                        <img 
                            src={recipe.strMealThumb} 
                            alt={recipe.strMeal} 
                            className="h-72 w-full object-cover sm:h-80 md:h-105"
                        />
                    ) : (
                        <div className="h-72 w-full flex items-center justify-center bg-(--surface-muted) text-(--text-muted)">
                            No image available
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold text-(--text-main) md:text-4xl">
                        {recipe.strMeal || "Untitled recipe"}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        {recipe.strCategory && (
                            <span className="rounded-full border border-(--line) bg-(--surface-muted) px-3 py-1 font-semibold text-(--text-main)">
                                {recipe?.strCategory || "Unknown"}
                            </span>
                        )}
                        {recipe.strArea && (
                            <span className="rounded-full border border-(--line) bg-(--surface) px-3 py-1 text-(--text-muted)">
                                {recipe.strArea || "Unknown"}
                            </span>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-(--line) bg-(--surface) p-5 text-sm leading-relaxed text-(--text-main) shadow-sm">
                    <h2 className="mb-3 text-lg font-semibold text-(--text-main)">
                        Ingredients
                    </h2>

                    <ul className="max-h-56 overflow-y-auto pr-1 space-y-2 text-sm text-(--text-main) custom-scrollbar">
                        {recipe.ingredients?.map((ing, index) => (
                            <li key={index} className="flex items-center justify-between gap-4 rounded-xl border border-(--line) bg-(--surface-elevated) px-3 py-2">
                                <span className="font-medium">{ing.name}</span>
                                <span className="rounded-full border border-(--line) bg-(--surface-muted) px-2.5 py-0.5 text-xs text-(--text-muted)">{ing.measure}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-2xl border border-(--line) bg-(--surface) p-5 text-sm leading-relaxed text-(--text-main) shadow-sm">
                    <h2 className="mb-3 text-lg font-semibold text-(--text-main)">
                        Instructions
                    </h2>
                    <p className="whitespace-pre-line leading-relaxed">
                        {recipe.strInstructions}
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="
                        w-full sm:w-fit rounded-xl bg-(--accent) px-5 py-2.5 text-sm font-semibold
                        text-[#2f2710] transition hover:bg-(--accent-strong) hover:-translate-y-0.5"
                    >
                        Add to meal planner
                    </button>
                    <button className="
                        w-full sm:w-fit rounded-xl border border-(--line) bg-(--surface-elevated) px-5 py-2.5 text-sm font-semibold
                        text-(--text-main) transition hover:-translate-y-0.5 hover:bg-(--surface-muted)"
                        onClick={handleAddIngredients}
                        disabled={isAddingGroceries}
                    >
                        {isAddingGroceries ? "Adding..." : "Add ingredients to groceries"}
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
                                    presetTitle={recipe.strMeal}
                                    presetIngredients={recipe.ingredients || []}
                                    onSaved={() => {
                                        setEditingMeal(null);
                                        setIsOpen(false);
                                    }}
                                    onCancelEdit={() => {
                                        setEditingMeal(null);
                                        setIsOpen(false);
                                    }}
                                    onClose={() => {
                                        setEditingMeal(null);
                                        setIsOpen(false);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  )
}
