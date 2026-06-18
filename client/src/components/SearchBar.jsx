function SearchBar({
  value,
  onChange
}) {
  return (
    <input
      type="text"
      placeholder="Search Product"
      value={value}
      onChange={onChange}
    />
  );
}

export default SearchBar;