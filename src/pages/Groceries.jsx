import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import { getTodayKey, addDays } from "../constants";
import { ConfirmationModal } from "../components/ConfirmationModal";

export const Groceries = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // preview state
  const [startDate, setStartDate] = useState(getTodayKey());
  const [endDate, setEndDate] = useState(addDays(getTodayKey(), 7));
  const [previewItems, setPreviewItems] = useState([]);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isSavingPreview, setIsSavingPreview] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchGroceries = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/groceries");
      setItems(res.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not load groceries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroceries();
  }, []);

  const handlePreview = async () => {
    if (!startDate || !endDate) {
      toast.error("Please pick a start and end date.");
      return;
    }

    if (startDate > endDate) {
      toast.error("Start date must be before or equal to end date.");
      return;
    }

    try {
      setIsPreviewing(true);
      const res = await axios.get("/groceries/preview", {
        params: { start: startDate, end: endDate },
      });
      setPreviewItems(res.data || []);
      setIsPreviewOpen(true);
      if ((res.data || []).length === 0) {
        toast.info("No ingredients found in that range.");
      }
    } catch(err) {
      toast.error(err?.response?.data?.detail || "Could not generate preview.");
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleSavePreview = async () => {
    if (previewItems.length === 0) return;

    try {
      setIsSavingPreview(true);
      const res = await axios.post("/groceries/bulk", previewItems);
      const addedCount = res.data.added_count ?? res.data.items_added?.length ?? previewItems.length;
      const skippedCount = res.data.skipped_count ?? res.data.items_skipped?.length ?? 0;

      toast.success(
        skippedCount > 0
        ? `Added ${addedCount} item${addedCount === 1 ? ""  : "s"}. Skipped ${skippedCount} duplicate${skippedCount === 1 ? ""  :"s"}`
        : `Added ${addedCount} item${addedCount === 1 ? "" : "s"}`
      );

      setPreviewItems([]);
      setIsPreviewOpen(false);
      await fetchGroceries();
    } catch(err) {
      toast.error(err?.response?.data?.detail || "Could not save preview");
    } finally {
      setIsSavingPreview(false);
    }
  };

  const handleClearPreview = () => {
    setPreviewItems([]);
    setIsPreviewOpen(true);
  };

  const handleDelete = async (itemId) => {
    try {
      setDeletingId(itemId);
      await axios.delete(`/groceries/${itemId}`);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success("Grocery removed.");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not delete grocery.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleClear = async () => {
    if (items.length === 0) return;
    try {
      setIsClearing(true);
      await axios.delete("/groceries");
      setItems([]);
      toast.success("Groceries cleared.");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not clear groceries.");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <section className="rounded-3xl border border-(--line) bg-(--surface-elevated) p-4 shadow-sm sm:p-6">
      {/* Preview controls */}
      <div className="mb-5 rounded-2xl border border-(--line) bg-(--surface) p-4">
        <h2 className="text-sm font-semibold text-(--text-main)">Generate grocery preview</h2>
        <p className="text-xs text-(--text-muted) mb-3">
          Pick a date range and preview ingredients from planned meals.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-xl border border-(--line) bg-(--surface-elevated) px-3 py-2 text-xs text-(--text-main)"
          />
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-xl border border-(--line) bg-(--surface-elevated) px-3 py-2 text-xs text-(--text-main)"
          />
          <button
            onClick={handlePreview}
            disabled={isPreviewing}
            className="
            rounded-xl bg-(--accent) px-4 py-2 text-xs font-semibold
            text-[#2f2710] transition hover:bg-(--accent-strong)"
          >
            {isPreviewing ? "Generating..." : "Generate Preview"}
          </button>
        </div>
      </div>

      {/* Preview list */}
      {isPreviewOpen && (
        <div className="mb-6 rounded-2xl border border-(--line) bg-(--surface) p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-(--text-main)">Preview (not saved)</h3>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSavePreview}
                disabled={isSavingPreview || previewItems.length === 0}
                className="
                rounded-xl border border-(--line) bg-(--surface-elevated) 
                px-3 py-2 text-xs font-semibold text-(--text-main) hover:bg-(--surface-muted)"
              >
                {isSavingPreview ? "Saving..." : "Add to groceries"}
              </button>
              <button
                onClick={handleClearPreview}
                disabled={previewItems.length === 0}
                className="
                rounded-xl border border-(--line) bg-(--surface-elevated) 
                px-3 py-2 text-xs font-semibold text-(--text-main) hover:bg-(--surface-muted)"
              >
                Clear preview
              </button>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="
                rounded-xl border border-(--line) bg-(--surface-elevated) 
                px-3 py-2 text-xs font-semibold text-(--text-main) hover:bg-(--surface-muted)"
              >
                Close
              </button>
            </div>
          </div>
          
          {previewItems.length === 0 ? (
            <p className="text-sm text-(--text-muted)">
              Preview cleared. Generate again to see ingredients.
            </p>
          ) : (
            <ul className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
              {previewItems.map((item, index) => (
                <li
                  key={`${item.name}-${item.measure}-${index}`}
                  className="
                  flex items-center justify-between gap-4 rounded-xl border border-(--line)
                  bg-(--surface-elevated) px-3 py-2 text-sm text-(--text-main)"
                >
                  <span className="font-medium">{item.name}</span>
                  {item.measure ? (
                    <span 
                      className="
                      rounded-full border border-(--line) bg-(--surface-muted) 
                      px-2.5 py-0.5 text-xs text-(--text-muted)"
                    >
                      {item.measure}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Existing groceries list */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-(--text-main)">Groceries</h1>
          <p className="text-sm text-(--text-muted)">
            {items.length} item{items.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          disabled={loading || items.length === 0 || isClearing}
          className="
            rounded-xl border border-(--line) bg-(--surface) px-3 py-2 text-xs font-semibold 
            text-(--text-main) transition hover:-translate-y-0.5 hover:bg-(--surface-muted) 
            disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isClearing ? "Clearing..." : "Clear all"}
        </button>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
        >
          <div
            className="pointer-events-auto flex w-full max-w-2xl items-center justify-center"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <ConfirmationModal
              title="Clear groceries"
              message="Are you sure you want to clear all groceries? This action cannot be undone."
              confirmText="Clear"
              onCancel={() => setIsOpen(false)}
              onConfirm ={async () => {
                await handleClear();
                setIsOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-(--text-muted)">Loading groceries...</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-(--line) bg-(--surface) p-4 text-sm text-(--text-muted)">
          No groceries yet. Add ingredients from a recipe to see them here.
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="
                flex items-center justify-between gap-4 rounded-xl border 
                border-(--line) bg-(--surface) px-3 py-2 text-sm text-(--text-main)"
            >
              <span className="font-medium">{item.name}</span>
              {item.measure ? (
                <span className="rounded-full border border-(--line) bg-(--surface-muted) px-2.5 py-0.5 text-xs text-(--text-muted)">
                  {item.measure}
                </span>
              ) : null}
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="
                  ml-auto rounded-lg border border-(--line) bg-(--surface-elevated) 
                  px-2.5 py-1.5 text-xs font-semibold text-(--text-main) transition hover:-translate-y-0.5 
                  hover:bg-(--surface-muted) disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId === item.id ? "Removing..." : "Remove"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
