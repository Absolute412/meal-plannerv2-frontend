import axios from "../api/axiosInstance";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use"
import { SearchBar } from "../components/SearchBar";
import { Link } from "react-router-dom";
import { RecipeSkeleton } from "./RecipeSkeleton";
import { DEFAULT_QUERY } from "../constants";

export const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const searchRecipes = async (query) => {
    const res = await axios.get("/recipes/search", { params: {q: query} });
    return res.data;
  };

  useEffect(() => {
    let active = true;

    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        let data;

        if (debouncedSearchTerm.trim() !== "") {
          // Search mode
          data = await searchRecipes(debouncedSearchTerm);
        } else {
          data = await searchRecipes(DEFAULT_QUERY);
        }

        if (active) {
          setRecipes(data || []);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          if (!err.response) {
            setError("Network error. Check your connection.");
          } else {
            setError("Something went wrong. Try again.");
          }
          setRecipes([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchRecipes();
    return () => (active = false);
  }, [debouncedSearchTerm, retryKey]);

  return (
    <div className='flex flex-col space-y-4'>
      <section className='space-y-2'>
        <h1 className="text-2xl font-bold text-(--text-main)">Recipes</h1>
        <p className="mt-1 text-sm text-(--text-muted)">Browse through famous recipes</p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar 
          placeholder="Search recipes..." 
          value={searchTerm} 
          setValue={(val) => {
            setSearchTerm(val);
            setHasSearched(val.trim() !== "");
          }} 
        />
      </div>

      {!hasSearched && !loading && !error && (
        <p className="text-sm font-semibold text-(--text-muted)">
          Start typing to search recipes
        </p>
      )}

      {!loading && !error && recipes.length === 0 && searchTerm.trim() !== "" && (
        <div className="mt-20 flex items-center justify-center">
          <p className="text-xl text-(--text-main)">Recipe not found</p>
        </div>
      )}

      {error && !loading && (
        <div className="mt-20 flex flex-col items-center justify-center gap-2">
          <p className="text-center text-red-500">
            {error}
          </p>

          <button
            disabled={loading}
            onClick={() => setRetryKey(prev => prev + 1)}
            className="
              px-4 py-2 bg-(--accent) hover:bg-(--accent-strong) disabled:opacity-50 
              disabled:cursor-not-allowed text-(--main) rounded-lg"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <RecipeSkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recipes.map((recipe) => {
            if (!recipe?.idMeal) return null;

            const hasThumb = recipe?.strMealThumb;

            return (
              <Link 
                to={`/recipes/${recipe.idMeal}`}
                key={recipe.idMeal}
                className="rounded-xl border border-(--line) bg-(--surface-elevated) overflow-hidden hover:scale-[1.02] transition"
              >
                {hasThumb ? (
                  <img 
                    src={recipe.strMealThumb} 
                    alt={recipe.strMeal || "Recipe"} 
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="h-40 w-full bg-(--surface-muted) flex items-center justify-center text-xs text-(--text-muted)">
                    No image
                  </div>
                )}

                <div className="p-3">
                  <p className="text-sm font-semibold text-(--text-main) line-clamp-2">
                    {recipe.strMeal || "Untitled recipe"}
                  </p>

                  <p className="w-fit rounded-full p-1 text-xs font-semibold bg-(--accent-soft)">
                    {recipe.strCategory || "Unknown"}
                  </p>
                </div>
              </Link>
            )  
          })}
        </div>
      )}
    </div>
  )
}
