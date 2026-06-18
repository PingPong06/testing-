import { useState } from "react";
import { addProduct } from "../services/api";

function AddProduct() {

  const [formData, setFormData] = useState({
    brand: "",
    size: "",
    pipe_type: "",
    min_stock: "",
    unit_price:"",
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
  !formData.unit_price
) {
  window.alert("All fields are required");
  return;
}

    try {

      await addProduct(formData);

      console.log(formData);

      window.alert("Product Added Successfully");

      setFormData({
        brand: "",
        size: "",
        pipe_type: "",
        min_stock: "",
        unit_price:"",
      });

    } catch (error) {

  window.alert(
    error.response?.data?.message ||
    "Something went wrong"
  );

  console.error(error);

}

  };

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
          type="text"
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

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold"
        >
          Add Product
        </button>

      </form>

    </div>

  </div>
);
}

export default AddProduct;