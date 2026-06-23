import { useState } from "react";
import { addProduct } from "../services/api";

import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

function AddProduct() {

//   const role = localStorage.getItem("role");

// if (role !== "ADMIN") {
//   return <Navigate to="/" />;
// }

  const [formData, setFormData] = useState({
    brand: "",
    size: "",
    pipe_type: "",
    min_stock: "",
    unit_price:"",
    weight_per_unit:"",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  // after clicking on submit

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
  !formData.brand ||
  !formData.size ||
  !formData.pipe_type ||
  !formData.min_stock ||
  !formData.unit_price||
  !formData.weight_per_unit
) {
  toast.error("All fields are required");
  return;
}

    try {

      await addProduct(formData);

      console.log(formData);

      toast.success("Product Added Successfully");

      setFormData({
        brand: "",
        size: "",
        pipe_type: "",
        min_stock: "",
        unit_price:"",
        weight_per_unit:"",
      });

    } catch (error) {

  toast.error("Failed to Add Product");

  console.error(error);

}

  };
  console.log(formData);

  return (
  <div className="p-8 flex justify-center">

    <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg">

      <h1 className="text-4xl font-bold mb-6">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="size"
          placeholder="Size (in mm)"
          value={formData.size}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="pipe_type"
          placeholder="Pipe Type"
          value={formData.pipe_type}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="min_stock"
          min="0"
          placeholder="Min Stock"
          value={formData.min_stock}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="unit_price"
          step="0.01"
          placeholder="Unit Price"
          value={formData.unit_price}
          onChange={(e) =>
            setFormData({
              ...formData,
              unit_price: e.target.value,
            })
          }
          className="border p-3 rounded-lg"
        />

<input
          type="number"
          name="weight_per_unit"
          step="0.01"
          placeholder="Weight/Unit (in kg)"
          value={formData.weight_per_unit}
          onChange={(e) =>
            setFormData({
              ...formData,
              weight_per_unit: e.target.value,
            })
          }
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold cursor-pointer"
        >
          Add Product
        </button>

      </form>

    </div>
    

  </div>
);
}

export default AddProduct;