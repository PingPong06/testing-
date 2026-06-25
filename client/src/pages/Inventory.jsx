import { useState, useEffect } from "react";

import SearchBar from "../components/SearchBar";
import ProductTable from "../components/ProductTable";
import { login } from "../services/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  getProducts,
  deleteProduct,
  updateProduct,
  stockIn,
  stockOut,
} from "../services/api";

import Select from "react-select";

function Inventory() {
  // const [selectedProductId, setSelectedProductId] = useState(null);

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  fetchProducts();

}, [navigate]);

  const [showModal, setShowModal] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [stockModal, setStockModal] = useState(false);

  const [stockAction, setStockAction] = useState("");

  // const [selectedProduct, setSelectedProduct] = useState(null);

  const [quantity, setQuantity] = useState("");

  const [remarks, setRemarks] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);


  const displayProducts = selectedProductId
  ? products.filter(
      (product) => product.id === selectedProductId
    )
  : products;

 const fetchProducts = async () => {
  try {
    const response = await getProducts();

      // console.log("Inventory Data:", response.data);

      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // handle delete
  // console.log("selectedProductId =", selectedProductId);
  const handleDelete = async () => {
    // console.log(
    //   "selectedProductId =",
    //   selectedProductId
    // );

    try {
      await deleteProduct(selectedProductId);

      toast.success("Product Deleted");

      setShowDeleteModal(false);

      fetchProducts();
    } catch (error) {
      console.error(error);

      console.log(error.response);

      toast.error(error.response?.data?.message || "Delete Failed");
    }
  };

  // Edit Handler

  const handleEdit = (product) => {
    console.log(product);
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
        unit_price: editingProduct.unit_price,
        weight_per_unit: editingProduct.weight_per_unit,
      });

      toast.success("Product Updated");

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
        toast.success("Stock Added");
        await stockIn(data);

        setQuantity("");
        setRemarks("");
      } else {
        toast.success("Stock Removed");
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

      toast.error(error.response?.data?.message || "Transaction Failed");
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-6">Inventory</h1>

      <Select
        options={products.map((product) => ({
          value: product.id,
          label: `${product.brand} - ${product.pipe_type} - ${product.size} mm`,
        }))}
        placeholder="Search Product..."
        isSearchable
        isClearable
        onChange={(selected) => {
          setSelectedProductId(selected ? selected.value : null);
        }}
      />

      {/* Desktop Table */}
      <div className="hidden md:block">
        <ProductTable
          products={displayProducts}
          onDelete={(product) => {
            setSelectedProductId(product.id);
            setShowDeleteModal(true);
          }}
          onEdit={handleEdit}
          onStockIn={handleStockIn}
          onStockOut={handleStockOut}
        />
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 mt-4">
        {displayProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-bold text-lg">{product.brand}</h3>

            <div className="mt-2 space-y-1 text-sm">
              <p>
                <strong>Size:</strong> {product.size} mm
              </p>

              <p>
                <strong>Pipe Type:</strong> {product.pipe_type}
              </p>

              <p>
                <strong>Current Stock:</strong> {product.current_stock}
              </p>

              <p>
                <strong>Min Stock:</strong> {product.min_stock}
              </p>

              <p>
                <strong>Unit Price:</strong> ₹ {product.unit_price}
              </p>

              <p>
                <strong>Weight/Unit:</strong> {product.weight_per_unit} kg
              </p>

              {/* <p>
          <strong>Unit:</strong> Nos
        </p> */}

              {Number(product.current_stock) <= Number(product.min_stock) && (
                <p className="text-orange-600 font-semibold">⚠ Low Stock</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>

              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 rounded"
                onClick={() => handleStockIn(product)}
              >
                Stock In
              </button>

              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
                onClick={() => handleStockOut(product)}
              >
                Stock Out
              </button>

              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                onClick={() => {
                  console.log("Opening delete modal for ID:", product.id);

                  setSelectedProductId(product.id);
                  setShowDeleteModal(true);
                  console.log(product);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

            <label className="block mb-1 font-medium">Brand</label>

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

            <label className="block mb-1 font-medium">Size (mm)</label>

            <input
              type="number"
              className="w-full border p-2 rounded mb-3"
              value={editingProduct?.size || ""}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  size: e.target.value,
                })
              }
            />

            <label className="block mb-1 font-medium">Pipe Type</label>

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

            <label className="block mb-1 font-medium">Minimum Stock</label>

            <input
              type="number"
              className="w-full border p-2 rounded mb-3"
              value={editingProduct?.min_stock || ""}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  min_stock: e.target.value,
                })
              }
            />

            <label className="block mb-1 font-medium">Unit Price (₹)</label>

            <input
              type="number"
              step="0.01"
              className="w-full border p-2 rounded mb-3"
              value={editingProduct?.unit_price || ""}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  unit_price: e.target.value,
                })
              }
            />

            <label className="block mb-1 font-medium">
              Weight Per Unit (kg)
            </label>

            <input
              type="number"
              step="0.01"
              className="w-full border p-2 rounded mb-4"
              value={editingProduct?.weight_per_unit || ""}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  weight_per_unit: e.target.value,
                })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                onClick={handleSave}
              >
                Save
              </button>

              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {stockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full"
          >
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

            {/* <input
              type="text"
              placeholder="Remarks"
              className="w-full border p-2 rounded mb-4"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            /> */}

            <div className="flex justify-end gap-2">
              <button
                className={`text-white px-4 py-2 rounded ${
                  stockAction === "IN"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-yellow-500 hover:bg-yellow-600"
                } cursor-pointer`}
                onClick={handleStockSubmit}
              >
                Submit
              </button>

              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
                onClick={() => setStockModal(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="
        bg-white
        p-6
        rounded-2xl
        shadow-xl
        w-[90%]
        max-w-md
        "
            >
              <h2 className="text-xl font-bold mb-3">Delete Product</h2>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this product?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="
            px-4
            py-2
            rounded-lg
            bg-gray-200
            "
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="
  px-4
  py-2
  rounded-lg
  bg-red-600
  text-white
  "
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Inventory;
