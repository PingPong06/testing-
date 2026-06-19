import { useState, useEffect } from "react";

import SearchBar from "../components/SearchBar";
import ProductTable from "../components/ProductTable";
import { login } from "../services/api";

import {
  getProducts,
  deleteProduct,
  updateProduct,
  stockIn,
  stockOut,
} from "../services/api";

function Inventory() {
  const [search, setSearch] = useState("");

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const [showModal, setShowModal] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [stockModal, setStockModal] = useState(false);

  const [stockAction, setStockAction] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [quantity, setQuantity] = useState("");

  const [remarks, setRemarks] = useState("");

  //fetch products

  const fetchProducts = async () => {
    try {
      const response = await getProducts(search);

      // console.log("Inventory Data:", response.data);

      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // handle delete

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);

      // Refresh table after delete
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // Edit Handler

  const handleEdit = (product) => {
    setEditingProduct(product);

    setShowModal(true);
  };

  // Save Handler

  const handleSave = async () => {
    try {
      await updateProduct(editingProduct.id, {
        brand: editingProduct.brand,
        size: editingProduct.size,
        pipe_type: editingProduct.pipe_type,
        min_stock: editingProduct.min_stock,
      });

      setShowModal(false);

      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // Stock in

  const handleStockIn = (product) => {
    setSelectedProduct(product);

    setStockAction("IN");

    setStockModal(true);
  };

  // Stock Out

  const handleStockOut = (product) => {
    setSelectedProduct(product);

    setStockAction("OUT");

    setStockModal(true);
  };

  // handles aftermath of stock in or out

  const handleStockSubmit = async () => {
    try {
      const data = {
  product_id: selectedProduct.id,
  quantity: Number(quantity),
  remarks,
  performed_by: localStorage.getItem("username"),
};

        // console.log(data);

      if (stockAction === "IN") {
        await stockIn(data);

        setQuantity("");
        setRemarks("");
      } else {
        await stockOut(data);

        setQuantity("");
        setRemarks("");
      }

      setStockModal(false);

      setQuantity("");

      setRemarks("");

      fetchProducts();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Transaction Failed");
    }
  };

//   // const response = await login({
//   // username,
//   // password,
// });

// const handleLogin = async (e) => {

//   e.preventDefault();

//   try {

//     const response = await login({
//       username,
//       password,
//     });

//     localStorage.setItem(
//       "token",
//       response.data.token
//     );

//     console.log("TOKEN SAVED");

//     window.alert(
//       "Login Successful"
//     );

//   } catch (error) {

//     window.alert(
//       error.response?.data?.message ||
//       "Login Failed"
//     );

//     console.error(error);

//   }

// };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">Inventory</h1>
      <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
      <ProductTable
        products={products}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onStockIn={handleStockIn}
        onStockOut={handleStockOut}
      />

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

            <input
              className="w-full border p-2 rounded mb-3"
              value={editingProduct?.brand || ""}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  brand: e.target.value,
                })
              }
            />

            <input
              className="w-full border p-2 rounded mb-3"
              value={editingProduct?.size || ""}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  size: e.target.value,
                })
              }
            />

            <input
              className="w-full border p-2 rounded mb-3"
              value={editingProduct?.pipe_type || ""}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  pipe_type: e.target.value,
                })
              }
            />

            <input
              className="w-full border p-2 rounded mb-4"
              value={editingProduct?.min_stock || ""}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  min_stock: e.target.value,
                })
              } 
            />

            <div className="flex justify-end gap-2">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Save
              </button>

              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {stockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Stock {stockAction}</h2>

            <p className="mb-4 text-gray-600">
              Product: {selectedProduct?.brand}
            </p>

            <input
              type="number"
              placeholder="Quantity"
              className="w-full border p-2 rounded mb-3"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <input
              type="text"
              placeholder="Remarks"
              className="w-full border p-2 rounded mb-4"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                className={`text-white px-4 py-2 rounded ${
                  stockAction === "IN"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
                onClick={handleStockSubmit}
              >
                Submit
              </button>

              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                onClick={() => setStockModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
