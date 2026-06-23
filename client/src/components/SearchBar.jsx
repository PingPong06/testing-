function SearchBar({
  value,
  onChange
}) {
  return (
    <input
  type="text"
  value={value}
  onChange={onChange}
  placeholder="Search Product..."
  className="
    w-full
    p-3
    rounded-lg
    border-2
    border-slate-300
    bg-white
    shadow-sm
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-200
    focus:outline-none
    transition
  "
/>
  );
}

export default SearchBar;