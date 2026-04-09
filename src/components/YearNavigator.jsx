import { Icon } from "@iconify/react";

export const YearNavigator = ({ year, onPrevYear, onNextYear }) => {
    return (
        <div className="flex items-center gap-3 self-end xl:self-auto">
            <button
                onClick={onPrevYear}
                className="
                    rounded-full border border-(--line) bg-(--surface) p-2 
                    text-(--text-main) transition hover:bg-(--surface-muted)"
                aria-label="Previous year"
            >
                <Icon icon="iconamoon:arrow-left-2-duotone" className="text-lg" />
            </button>

            <p className="min-w-14 text-center text-2xl font-bold text-(--text-main)">
                {year}
            </p>

            <button
                onClick={onNextYear}
                className="
                    rounded-full border border-(--line) bg-(--surface) p-2 
                    text-(--text-main) transition hover:bg-(--surface-muted)"
                aria-label="Next year"
            >
                <Icon icon="iconamoon:arrow-right-2-duotone" className="text-lg" />
            </button>
        </div>
    );
};
