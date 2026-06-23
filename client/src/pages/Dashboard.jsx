import { useEffect, useState } from "react";
import { getDashboardStats, getProducts } from "../services/api";
import Select from "react-select";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  Boxes,
  AlertTriangle,
  ArrowLeftRight,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { LabelList } from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({
    total_products: 0,
    total_stock: 0,
    low_stock_count: 0,
    total_transactions: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [products, setProducts] = useState([]);

  const [brands, setBrands] = useState([]);
  const [pipeTypes, setPipeTypes] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedPipeType, setSelectedPipeType] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [stockDetails, setStockDetails] = useState(null);

  const [lowStockData, setLowStockData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {

        setLoading(true);

    const response = await getDashboardStats();
    setStats(response.data);

    const productsResponse = await getProducts();
    setProducts(productsResponse.data);

        const uniqueBrands = [
          ...new Set(productsResponse.data.map((p) => p.brand)),
        ];

        setBrands(
          uniqueBrands.map((brand) => ({
            value: brand,
            label: brand,
          })),
        );

        setChartData(
          productsResponse.data
            .filter((product) => Number(product.current_stock) > 0)
            .sort((a, b) => Number(b.current_stock) - Number(a.current_stock))
            .slice(0, 10)
            .map((product) => ({
              name: `${product.brand} ${product.size}`,
              stock: Number(product.current_stock),
              minStock: Number(product.min_stock),
            })),
        );

        setLowStockData(
          productsResponse.data.filter(
            (product) =>
              Number(product.current_stock) <= Number(product.min_stock),
          ),
        );
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
      finally {
    setLoading(false);
  }
    };

    fetchDashboard();
  }, []);

  const handleBrandChange = (selected) => {
    setSelectedBrand(selected);

    setSelectedPipeType(null);
    setSelectedSize(null);
    setStockDetails(null);

    const types = [
      ...new Set(
        products
          .filter((p) => p.brand === selected.value)
          .map((p) => p.pipe_type),
      ),
    ];

    setPipeTypes(
      types.map((type) => ({
        value: type,
        label: type,
      })),
    );

    setSizes([]);
  };

  const handlePipeTypeChange = (selected) => {
    setSelectedPipeType(selected);

    setSelectedSize(null);
    setStockDetails(null);

    const filteredSizes = [
      ...new Set(
        products
          .filter(
            (p) =>
              p.brand === selectedBrand.value && p.pipe_type === selected.value,
          )
          .map((p) => p.size),
      ),
    ];

    setSizes(
      filteredSizes.map((size) => ({
        value: size,
        label: size,
      })),
    );
  };

  const handleSizeChange = (selected) => {
    setSelectedSize(selected);

    const product = products.find(
      (p) =>
        p.brand === selectedBrand.value &&
        p.pipe_type === selectedPipeType.value &&
        p.size === selected.value,
    );

    setStockDetails(product);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

      <motion.div
  initial={{
    opacity: 0,
    y: -20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 0.5,
  }}
  className="
  bg-gradient-to-r
  from-blue-600
  to-indigo-700
  text-white
  rounded-2xl
  p-6
  mb-8
  shadow-lg
  "
>
  <h2 className="text-2xl font-bold">
   Welcome, {localStorage.getItem("username")?.charAt(0).toUpperCase() + localStorage.getItem("username")?.slice(1)}
  </h2>

  <p className="mt-2 opacity-90">
    Manage inventory, stock movement and reporting for Esscon.
  </p>
</motion.div>


<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

  <motion.div
  whileHover={{
    y: -8,
    scale: 1.05,
  }}
  whileTap={{
    scale: 0.95,
  }}
  transition={{
    type: "spring",
    stiffness: 300,
  }}
>
  <Link
    to="/add-product"
    className="
    block
    bg-white
    rounded-2xl
    shadow-lg
    p-5
    text-center
    "
  >
    <div className="text-3xl mb-2">➕</div>
    <p className="font-semibold">
      Add Product
    </p>
  </Link>
  </motion.div>

  <motion.div
  whileHover={{
    y: -8,
    scale: 1.05,
  }}
  whileTap={{
    scale: 0.95,
  }}
  transition={{
    type: "spring",
    stiffness: 300,
  }}
>
  <Link
    to="/inventory"
    className="
    block
    bg-white
    rounded-2xl
    shadow-lg
    p-5
    text-center
    "
  >
    <div className="text-3xl mb-2">📥</div>
    <p className="font-semibold">
      Stock In
    </p>
  </Link>
  </motion.div>

  <motion.div
  whileHover={{
    y: -8,
    scale: 1.05,
  }}
  whileTap={{
    scale: 0.95,
  }}
  transition={{
    type: "spring",
    stiffness: 300,
  }}
>
  <Link
    to="/inventory"
    className="
    block
    bg-white
    rounded-2xl
    shadow-lg
    p-5
    text-center
    "
  >
    <div className="text-3xl mb-2">📤</div>
    <p className="font-semibold">
      Stock Out
    </p>
  </Link>
  </motion.div>

  <motion.div
  whileHover={{
    y: -8,
    scale: 1.05,
  }}
  whileTap={{
    scale: 0.95,
  }}
  transition={{
    type: "spring",
    stiffness: 300,
  }}
>
  <Link
    to="/reports"
    className="
    block
    bg-white
    rounded-2xl
    shadow-lg
    p-5
    text-center
    "
  >
    <div className="text-3xl mb-2">📊</div>
    <p className="font-semibold">
      Reports
    </p>
  </Link>
  </motion.div>

  </div>
      
{/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  <Link
    to="/add-product"
    className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition text-center"
  >
    ➕ Add Product
  </Link>

  <Link
    to="/inventory"
    className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition text-center"
  >
    📥 Stock In
  </Link>

  <Link
    to="/inventory"
    className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition text-center"
  >
    📤 Stock Out
  </Link>

  <Link
    to="/reports"
    className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition text-center"
  >
    📊 Reports
  </Link>
</div> */}
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Products */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
  <div className="flex justify-between items-center">
    <div>
      <h3 className="text-gray-500 text-sm">
        Total Products
      </h3>

      <p className="text-3xl font-bold mt-2">
        {stats.total_products}
      </p>
    </div>

    <div className="bg-blue-100 p-3 rounded-xl">
  <Package
    size={28}
    className="text-blue-600"
  />
</div>
  </div>
</div>

        {/* Total Stock */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
  <div className="flex justify-between items-center">
    <div>
      <h3 className="text-gray-500 text-sm">
        Total Stock
      </h3>

      <p className="text-3xl font-bold mt-2">
        {stats.total_stock}
      </p>
    </div>

    <div className="bg-green-100 p-3 rounded-xl">
  <Boxes
    size={28}
    className="text-green-600"
  />
</div>
  </div>
</div>

        {/* Low Stock */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
  <div className="flex justify-between items-center">
    <div>
      <h3 className="text-gray-500 text-sm">
        Low Stock Items
      </h3>

      <p className="text-3xl font-bold mt-2">
        {stats.low_stock_count}
      </p>
    </div>

    <div className="bg-red-100 p-3 rounded-xl">
  <AlertTriangle
    size={28}
    className="text-red-600"
  />
</div>
  </div>
</div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
  <div className="flex justify-between items-center">
    <div>
      <h3 className="text-gray-500 text-sm">
        Today's Transactions
      </h3>

      <p className="text-3xl font-bold mt-2">
        {stats.total_transactions}
      </p>
    </div>

    <div className="bg-purple-100 p-3 rounded-xl">
  <ArrowLeftRight
    size={28}
    className="text-purple-600"
  />
</div>
  </div>
</div>
</div>

<div className="
bg-white
rounded-2xl
shadow-lg
p-6
mb-8
hover:shadow-xl
transition-all
duration-200">
        <h2 className="text-xl font-bold mb-4">
🔍 Product Search
</h2>

        <div className="grid lg:grid-cols-3 gap-6">
          <Select
            options={brands}
            value={selectedBrand}
            onChange={handleBrandChange}
            placeholder="Search Brand..."
            isSearchable
          />

          <Select
            options={pipeTypes}
            value={selectedPipeType}
            onChange={handlePipeTypeChange}
            placeholder="Search Pipe Type..."
            isSearchable
            isDisabled={!selectedBrand}
          />

          <Select
            options={sizes}
            value={selectedSize}
            onChange={handleSizeChange}
            placeholder="Search Size..."
            isSearchable
            isDisabled={!selectedPipeType}
          />
        </div>
      </div>

      {stockDetails && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-3">Product Details</h2>

          <p>
            <strong>Brand:</strong> {stockDetails.brand}
          </p>

          <p>
            <strong>Pipe Type:</strong> {stockDetails.pipe_type}
          </p>

          <p>
            <strong>Size:</strong> {stockDetails.size}
          </p>

          <p>
            <strong>Current Stock:</strong> {stockDetails.current_stock}
          </p>

          <p>
            <strong>Min Stock:</strong> {stockDetails.min_stock}
          </p>

          <p>
  <strong>Unit Price:</strong>
  ₹{stockDetails.unit_price}
</p>

<p>
  <strong>Total Value:</strong>
  ₹{
    (
      Number(stockDetails.current_stock) *
      Number(stockDetails.unit_price)
    ).toLocaleString()
  }
</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">

        {/* Chart */}
        <div className="hidden md:block bg-white rounded-2xl shadow-lg p-6 lg:col-span-2 hover:shadow-xl transition-all duration-200">
          <h2 className="text-2xl font-bold mb-4">
  📊 Top 10 Products By Stock
</h2>

          <ResponsiveContainer width="100%" height={450}>
            <BarChart layout="vertical" data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />

              <YAxis type="category" dataKey="name" width={80} />

              <Tooltip />
              <Bar
  dataKey="stock"
  fill="#3B82F6"
  radius={[0, 6, 6, 0]}
>
  <LabelList dataKey="stock" position="right" />
</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl
transition-all
duration-200">
          <h2 className="text-2xl font-bold mb-4">
  ⚠ Low Stock Products
</h2>

          {lowStockData.length === 0 ? (
            <p className="text-green-600 font-semibold">
              All products are above minimum stock.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Brand</th>

                    <th className="text-left p-3">Size</th>

                    <th className="text-left p-3">Pipe Type</th>

                    <th className="text-left p-3">Current Stock</th>

                    <th className="text-left p-3">Min Stock</th>

                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {lowStockData.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="p-3">{product.brand}</td>

                      <td className="p-3">{product.size}</td>

                      <td className="p-3">{product.pipe_type}</td>

                      <td className="p-3">{product.current_stock}</td>

                      <td className="p-3">{product.min_stock}</td>

                      <td className="p-3 text-red-600 font-semibold">
                        Needs Restocking
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>
      </div>
    // </div>
  );
}

export default Dashboard;
