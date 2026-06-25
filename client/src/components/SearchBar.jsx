function SearchBar({
  value,
  onChange,
  products,
}) {
  return (
    <>
      <input
        type="text"
        list="product-suggestions"
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

      <datalist id="product-suggestions">
        {products.map((product) => (
          <option
            key={product.id}
            value={`${product.brand} ${product.pipe_type} ${product.size}`}
          />
        ))}
      </datalist>
    </>
  );
}

export default SearchBar;