
export const SearchBar = ({ value, setValue, placeholder }) => {

  return (
    <input 
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="
          w-full rounded-lg border border-(--line) bg-(--surface-elevated) p-2 text-sm text-(--text-main)
          placeholder:text-sm placeholder:text-(--text-muted) outline-none focus:border-(--accent) sm:w-72
        "
    />
  );
};