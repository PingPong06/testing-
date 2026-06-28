import { useEffect, useState } from "react";
import Select from "react-select";
import { getProducts, getReportData } from "../services/api";
import { downloadReportPDF } from "../services/api";
import { downloadReportExcel } from "../services/api";

import { FaFilePdf, FaFileExcel } from "react-icons/fa";

import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

function Reports() {
  const [products, setProducts] = useState([]);

  const [brands, setBrands] = useState([]);
  const [pipeTypes, setPipeTypes] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedPipeType, setSelectedPipeType] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [transactionType, setTransactionType] = useState(null);
  const [reportData, setReportData] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("");

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await getProducts();

        setProducts(response.data);

        const uniqueBrands = [...new Set(response.data.map((p) => p.brand))];

        const uniquePipeTypes = [
          ...new Set(response.data.map((p) => p.pipe_type)),
        ];

        const uniqueSizes = [...new Set(response.data.map((p) => p.size))];

        setBrands(
          uniqueBrands.map((brand) => ({
            value: brand,
            label: brand,
          })),
        );

        setPipeTypes(
          uniquePipeTypes.map((type) => ({
            value: type,
            label: type,
          })),
        );

        setSizes(
          uniqueSizes.map((size) => ({
            value: size,
            label: size,
          })),
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchFilters();
  }, []);

  const [filters, setFilters] = useState({
    brand: "",
    pipeType: "",
    size: "",
    fromDate: "",
    toDate: "",
    sortBy: "date",
    order: "DESC",
  });

  const handlePreview = async () => {
    try {
      const filters = {
        brand: selectedBrand?.value || "",
        pipeType: selectedPipeType?.value || "",
        size: selectedSize?.value || "",
        transactionType: transactionType?.value || "",

        fromDate,
        toDate,

        sortBy,
        order,
      };

      const response = await getReportData(filters);

      // console.log(response.data);

      setReportData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const filters = {
        brand: selectedBrand?.value || "",
        pipeType: selectedPipeType?.value || "",
        size: selectedSize?.value || "",
        transactionType:
          transactionType?.value || "",

        fromDate,
        toDate,

        sortBy,
        order,
      };

      const response = await downloadReportPDF(filters);

      if (!Capacitor.isNativePlatform()) {

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.download = "inventory-report.pdf";

      link.click();

      return;
    }

     // Android App
    const base64 = btoa(
      new Uint8Array(response.data)
        .reduce(
          (data, byte) =>
            data + String.fromCharCode(byte),
          ""
        )
    );

    const file = await Filesystem.writeFile({
      path: "inventory-report.pdf",
      data: base64,
      directory: Directory.Documents,
    });

    await Share.share({
      title: "Inventory Report",
      url: file.uri,
    });

  } catch (error) {
    console.error(error);
  }
};

  const handleDownloadExcel = async () => {
    try {
      const filters = {
        brand: selectedBrand?.value || "",

        pipeType: selectedPipeType?.value || "",

        size: selectedSize?.value || "",

        transactionType:
          transactionType?.value || "",

        fromDate,
        toDate,
        sortBy,
        order,
      };

      if (!Capacitor.isNativePlatform()) {

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.download = "inventory-report.xlsx";

      link.click();

      return;
    }

    const file = await Filesystem.writeFile({
      path: "inventory-report.xlsx",
      data: base64,
      directory: Directory.Documents,
    });

    await Share.share({
      title: "Inventory Excel Report",
      url: file.uri,
    });

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Transaction Reports</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            options={brands}
            value={selectedBrand}
            onChange={setSelectedBrand}
            placeholder="Select Brand (Optional)"
            isSearchable
          />

          <Select
            options={pipeTypes}
            value={selectedPipeType}
            onChange={setSelectedPipeType}
            placeholder="Select Pipe Type (Optional)"
            isSearchable
          />

          <Select
            options={sizes}
            value={selectedSize}
            onChange={setSelectedSize}
            placeholder="Select Size (in mm) (Optional)"
            isSearchable
          />

          <Select
            value={transactionType}
            onChange={setTransactionType}
            placeholder="Transaction Type"
            options={[
              { value: "ALL", label: "All" },
              { value: "IN", label: "IN" },
              { value: "OUT", label: "OUT" },
            ]}
          />

          <div>
            <label className="block text-sm text-gray-600 mb-1">From</label>

            <input
              type="date"
              className="border rounded-lg p-3"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">To</label>
            <input
              type="date"
              className="border rounded-lg p-3"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <select
            // defaultValue=""
            className="border rounded-lg p-3"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="" disabled>
              Sort By
            </option>

            <option value="date">Transaction Date</option>

            <option value="brand">Brand</option>

            <option value="pipe_type">Pipe Type</option>

            <option value="size">Size (in mm)</option>

            <option value="quantity">Quantity</option>
          </select>

          <select
            // defaultValue=""
            className="border rounded-lg p-3"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="" disabled>
              Order
            </option>

            <option value="DESC">Descending</option>

            <option value="ASC">Ascending</option>
          </select>

          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={handlePreview}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg cursor-pointer"
            >
              Preview Report
            </button>

            <button
              onClick={handleDownloadPDF}
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <FaFilePdf size={18} />
              Download PDF
            </button>

            <button
              onClick={handleDownloadExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <FaFileExcel size={18} />
              Download Excel
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Report Preview</h2>

          {reportData.length === 0 ? (
            <p className="text-gray-500">No report generated yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Date</th>

                    <th className="text-left p-2">Brand</th>

                    <th className="text-left p-2">Pipe Type</th>

                    <th className="text-left p-2">Size (in mm)</th>

                    <th className="text-left p-2">Type</th>

                    <th className="text-left p-2">Quantity</th>

                    <th className="text-left p-2">Unit Price</th>

                    <th className="text-left p-2">Weight per unit (in kg)</th>

                    <th className="text-left p-2">Performed By</th>
                  </tr>
                </thead>

                <tbody>
                  {reportData.map((row) => (
                    <tr key={row.id} className="border-b">
                      <td className="p-2">
                        {new Date(row.transaction_date).toLocaleDateString()}
                      </td>

                      <td className="p-2">{row.brand}</td>

                      <td className="p-2">{row.pipe_type}</td>

                      <td className="p-2">{row.size}</td>

                      <td className="p-2">{row.transaction_type}</td>

                      <td className="p-2">{row.quantity}</td>

                      <td className="p-2">{row.unit_price}</td>

                      <td className="p-2">{row.weight_per_unit}</td>

                      <td className="p-2">{row.performed_by}</td>
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

export default Reports;
