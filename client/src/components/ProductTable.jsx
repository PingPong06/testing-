function ProductTable({ products, onDelete, onEdit, onStockIn, onStockOut }) {
  // console.log("PRODUCT TABLE LOADED");

const role = localStorage.getItem("role");
const isAdmin = role === "ADMIN";

  // console.log("isAdmin =", isAdmin);

  return (
    <div className="w-full overflow-x-auto">
    <table className="w-full bg-white rounded-xl shadow-md overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-4 text-left">Brand</th>
          <th className="p-4 text-left">Size (in mm)</th>
          <th className="p-4 text-left">Pipe Type</th>
          <th className="p-4 text-left">Current Stock</th>

          <th className="p-4 text-left">Min Stock</th>
          <th className="p-4 text-left">Weight/Unit (kg)</th>

          {isAdmin && <th className="p-4 text-left">Unit Price</th>}

          {isAdmin && <th className="p-4 text-left">Total Value</th>}
          <th className="p-4 text-left">Action</th>
        </tr>
      </thead>

      <tbody>
  {products.map((product) => (
    <tr
      key={product.id}
      className="border-b hover:bg-gray-50"
    >
      <td className="p-4">{product.brand}</td>

      <td className="p-4">{product.size}</td>

      <td className="p-4">{product.pipe_type}</td>

      <td className="p-4">
        {product.current_stock ?? 0}

        {Number(product.current_stock) <=
          Number(product.min_stock) && (
          <span> ⚠ Low Stock</span>
        )}
      </td>

      <td className="p-4">
        {product.min_stock ?? 0}
      </td>

      <td className="p-4">{product.weight_per_unit}</td>

      {isAdmin && (
        <td className="p-4">
          ₹
          {Number(
            product.unit_price ?? 0
          ).toLocaleString()}
        </td>
      )}

      {isAdmin && (
        <td className="p-4">
          ₹
          {(
            Number(product.unit_price ?? 0) *
            Number(product.current_stock ?? 0)
          ).toLocaleString()}
        </td>
      )}

      <td className="p-4">
        <button
          className="action-btn bg-blue-500 text-white px-3 py-1 rounded mr-2 cursor-pointer"
          onClick={() => onEdit(product)}
        >
          Edit
        </button>

        <button
          className="action-btn bg-red-500 text-white px-3 py-1 rounded mr-2 cursor-pointer"
          onClick={() => onDelete(product)}
        >
          Delete
        </button>

        <button
          className="action-btn bg-green-500 text-white px-3 py-1 rounded mr-2 cursor-pointer"
          onClick={() => onStockIn(product)}
        >
          Stock In
        </button>

        <button
          className="action-btn bg-yellow-500 text-white px-3 py-1 rounded cursor-pointer"
          onClick={() => onStockOut(product)}
        >
          Stock Out
        </button>
      </td>
    </tr>
  ))}
</tbody>
    </table>
    </div>
  );
}

export default ProductTable;
