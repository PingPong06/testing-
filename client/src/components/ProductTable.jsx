function ProductTable({ products, onDelete, onEdit, onStockIn, onStockOut }) {
  // console.log("PRODUCT TABLE LOADED");

  const isAdmin = !!localStorage.getItem("token");

  // console.log("isAdmin =", isAdmin);

  return (
    <table className="w-full bg-white rounded-xl shadow-md overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-4 text-left">Brand</th>
          <th className="p-4 text-left">Size (in mm)</th>
          <th className="p-4 text-left">Pipe Type</th>
          <th className="p-4 text-left">Current Stock</th>
          <th className="p-4 text-left">Unit</th>

          <th className="p-4 text-left">Min Stock</th>

          {isAdmin && <th className="p-4 text-left">Unit Price</th>}

          {isAdmin && <th className="p-4 text-left">Total Value</th>}
          <th className="p-4 text-left">Action</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="border-b hover:bg-gray-50">
            <td className="p-4">{product.brand}</td>

            <td className="p-4">{product.size}</td>

            <td className="p-4">{product.pipe_type}</td>

            <td className="p-4">
              {product.current_stock}

              {Number(product.current_stock) <= Number(product.min_stock) && (
                <span> ⚠ Low Stock</span>
              )}
            </td>

            {isAdmin && (
              <td className="p-4">
                ₹{Number(product.unit_price).toLocaleString()}
              </td>
            )}

            {isAdmin && (
              <td className="p-4">
                ₹
                {(
                  Number(product.unit_price) * Number(product.current_stock)
                ).toLocaleString()}
              </td>
            )}

            {isAdmin && (
              <td className="p-4">
                ₹{Number(product.unit_price).toLocaleString()}
              </td>
            )}

            {isAdmin && (
              <td className="p-4">
                ₹
                {(
                  Number(product.unit_price) * Number(product.current_stock)
                ).toLocaleString()}
              </td>
            )}

            <td>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                onClick={() => onEdit(product)}
              >
                Edit
              </button>

              <button
                className="bg-red-500 text-white px-3 py-1 rounded mr-2"
                onClick={() => onDelete(product.id)}
              >
                Delete
              </button>

              <button
                className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                onClick={() => onStockIn(product)}
              >
                Stock In
              </button>

              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => onStockOut(product)}
              >
                Stock Out
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductTable;
