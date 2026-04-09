import { useEffect, useMemo, useState } from "react";
import { useMeals } from "../hooks/useMeals";
import { toast } from "react-toastify";
import { initialForm } from "../constants";
import { Icon } from "@iconify/react";

export const Addmeal = ({ 
    editingMeal, 
    presetTitle = "", 
    presetMealType = "", 
    presetMealDate = "", 
    presetIngredients,
    onSaved, 
    onCancelEdit ,
    onClose
}) => {
    const { addMeal, updateMeal } =useMeals();
    const [form, setForm] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const stablePresetIngredients = useMemo(() => 
        presetIngredients ?? [],
     [presetIngredients]
    );
    const todayDate = new Date();
    const today = todayDate.toISOString().split("T")[0];
    const maxFutureDate = new Date(todayDate);
    maxFutureDate.setDate(maxFutureDate.getDate() + 360);
    const maxFutureDateString = maxFutureDate.toISOString().split("T")[0];

    useEffect(() => {
        if (!editingMeal) {
            setForm({
                ...initialForm,
                title: presetTitle || "",
                meal_type: presetMealType || "Breakfast",
                meal_date: presetMealDate || "",
                ingredients: stablePresetIngredients
            });
            return;
        }

        setForm({
            title: editingMeal.title || "",
            meal_type: editingMeal.meal_type || "Breakfast",
            meal_date: editingMeal.meal_date || "",
            ingredients: editingMeal.ingredients || [],
        });
    }, [editingMeal, presetTitle, presetMealType, presetMealDate, stablePresetIngredients]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (!editingMeal?.id && form.meal_date && form.meal_date < today) {
                toast.error("You cannot add a meal in the past.");
                return
            }

            if (form.meal_date && form.meal_date > maxFutureDateString) {
                toast.error("Meal date cannot be more than 360 days in the future");
                return
            }

            const payload = {
                title: form.title.trim(),
                meal_type: form.meal_type,
                meal_date: form.meal_date || null,
                ingredients: form.ingredients || []
            };

            if (editingMeal?.id) {
                await updateMeal(editingMeal.id, payload);
                toast.success("Meal updated.");
            } else {
                await addMeal(payload);
                toast.success("Meal added.");
            }

            setForm(initialForm);
            onSaved?.()
        } catch (err) {
            toast.error(err.message || "Could not save meal.")
        } finally {
            setSubmitting(false);
        }
    };

  return (
    <section 
        className="
        w-full max-w-sm mx-auto rounded-2xl border border-(--line) bg-(--surface-elevated) 
        p-5 shadow-sm transition duration-300 hover:shadow-md relative"
    >
        <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-(--surface-mid) hover:bg-(--surface-muted)">
            <Icon icon="material-symbols:close-rounded" />
        </button>

        <h2 className="mb-4 text-lg font-semibold text-(--text-main)">
            {editingMeal ? "Edit Meal" : "Add New Meal"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="mb-1 text-sm font-medium text-(--text-main)">Meal Title</label>
                <input 
                    name="title" 
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Grilled chicken salad"
                    className="
                    w-full rounded-xl border border-(--line) bg-(--surface-elevated) 
                    px-3 py-2.5 text-sm text-(--text-main) outline-none transition 
                    duration-200 focus:border-(--accent) focus:ring-4 focus:ring-[#f0c04033]"
                />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-(--text-main)">Meal Type</label>
                    <select 
                        name="meal_type"
                        value={form.meal_type}
                        onChange={handleChange}
                        className="
                        w-full rounded-xl border border-(--line) bg-(--surface-elevated) 
                        px-3 py-2.5 text-sm text-(--text-main) outline-none transition 
                        duration-200 focus:border-(--accent) focus:ring-4 focus:ring-[#f0c04033]"
                    >
                        <option>Breakfast</option>
                        <option>Lunch</option>
                        <option>Dinner</option>
                        <option>Snack</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-(--text-main)">Meal Date</label>
                    <input 
                        type="date" 
                        name="meal_date"
                        value={form.meal_date}
                        onChange={handleChange}
                        min={!editingMeal ? today : undefined}
                        max={maxFutureDateString}
                        className="
                        w-full rounded-xl border border-(--line) bg-(--surface-elevated) 
                        px-3 py-2.5 text-sm text-(--text-main) outline-none transition 
                        duration-200 focus:border-(--accent) focus:ring-4 focus:ring-[#f0c04033]"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
                <button
                    type="submit"
                    disabled={submitting}
                    className="
                    flex-1 rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold
                    text-[#2f2710] transition duration-200 hover:-translate-y-0.5 
                    hover:bg-(--accent-strong) disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {submitting ? "Saving..." : editingMeal ? "Save Changes" : "Add Meal"}
                </button>

                {editingMeal && (
                    <button
                        type="button"
                        onClick={() => {
                            setForm(initialForm);
                            onCancelEdit?.();
                        }}
                        className="
                        rounded-xl border border-(--line) bg-(--surface-elevated) 
                        px-4 py-2.5 text-sm font-semibold text-(--text-main) transition
                        duration-200 hover:bg-(--surface-muted)"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    </section>
  )
}


