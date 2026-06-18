import { useEffect, useState } from "react";
import { getDashboardStats, getProducts } from "../services/api";
import Select from "react-select";

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

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
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
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">PVC Inventory Dashboard</h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Product Search</h2>

        <div className="grid md:grid-cols-3 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-500 text-sm">Total Products</h3>
          <p className="text-3xl font-bold mt-2">{stats.total_products}</p>
        </div>

        {/* Total Stock */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-500 text-sm">Total Stock</h3>
          <p className="text-3xl font-bold mt-2">{stats.total_stock}</p>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-500 text-sm">Low Stock Items</h3>
          <p className="text-3xl font-bold mt-2 text-red-500">
            {stats.low_stock_count}
          </p>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-500 text-sm">Total Transactions</h3>
          <p className="text-3xl font-bold mt-2">{stats.total_transactions}</p>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-4">
          <h2 className="text-2xl font-bold mb-4">Top 10 Products By Stock</h2>

          <ResponsiveContainer width="100%" height={450}>
            <BarChart layout="vertical" data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />

              <YAxis type="category" dataKey="name" width={150} />

              <Tooltip />
              <Bar dataKey="stock">
                <LabelList dataKey="stock" position="right" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-4">
          <h2 className="text-2xl font-bold mb-4">Low Stock Products</h2>

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
  );
}

export default Dashboard;
