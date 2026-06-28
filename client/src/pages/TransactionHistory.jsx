import { useEffect, useState } from "react";
import { getTransactionHistory, downloadTransactionExcel } from "../services/api";
import toast from "react-hot-toast";
import { FaFileExcel } from "react-icons/fa";
import { Capacitor } from "@capacitor/core";
import {
  Filesystem,
  Directory,
} from "@capacitor/filesystem";

function TransactionHistory() {

  const [transactions, setTransactions] = useState([]);
  const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {

    try {

      const response =
        await getTransactionHistory();

      setTransactions(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  const filteredTransactions = transactions.filter((item) => {

  const transactionDate =
    new Date(item.transaction_date);

  if (
    fromDate &&
    transactionDate < new Date(fromDate)
  ) {
    return false;
  }

  if (
    toDate &&
    transactionDate >
      new Date(toDate + "T23:59:59")
  ) {
    return false;
  }

  return true;
});

const sortedTransactions =
  [...filteredTransactions].sort((a, b) => {

    switch (sortBy) {

      case "latest":
        return (
          new Date(b.transaction_date) -
          new Date(a.transaction_date)
        );

      case "oldest":
        return (
          new Date(a.transaction_date) -
          new Date(b.transaction_date)
        );

      default:
        return 0;
    }
  });

  const handleExcelDownload = async () => {
  try {

    const response =
      await downloadTransactionExcel();

    // Browser
    if (!Capacitor.isNativePlatform()) {

      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "transaction_history.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      return;
    }

    // Android
    const bytes =
      new Uint8Array(response.data);

    let binary = "";

    bytes.forEach((b) => {
      binary +=
        String.fromCharCode(b);
    });

    const base64Data =
      btoa(binary);

    await Filesystem.writeFile({
      path:
        `transaction_history_${Date.now()}.xlsx`,
      data: base64Data,
      directory:
        Directory.Documents,
      recursive: true,
    });

    toast.success(
      "Excel saved successfully"
    );

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed to download Excel"
    );

  }
};

  return (
  <div className="p-8">

    <h1 className="text-4xl font-bold mb-6">
      Transaction History
    </h1>

    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-2">
  <label className="font-medium">
    From
  </label>

  <input
    type="date"
    value={fromDate}
    onChange={(e) =>
      setFromDate(e.target.value)
    }
    className="
      border
      rounded-lg
      px-4
      py-2
    "
  />
</div>

<div className="flex items-center gap-2">
  <label className="font-medium">
    To
  </label>

  <input
    type="date"
    value={toDate}
    onChange={(e) =>
      setToDate(e.target.value)
    }
    className="
      border
      rounded-lg
      px-4
      py-2
    "
  />
</div>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border rounded-lg px-4 py-2"
      >
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
      </select>

      <button
  onClick={handleExcelDownload}
  className="
  bg-green-600
  hover:bg-green-700
  text-white
  px-4
  py-2
  rounded-lg
  cursor-pointer
  "
>
  Export Excel
</button>
  </div>

    <div className="hidden md:block bg-white rounded-xl shadow-md">

      {/* {Desktop View} */}

  <table className="w-full">
        <thead className="bg-gray-100">

          <tr>
            <th className="p-4 text-left">Product</th>
            <th className="p-4 text-left">Size</th>
            <th className="p-4 text-left">Type</th>
            <th className="p-4 text-left">Quantity</th>
            {/* <th className="p-4 text-left">Remarks</th> */}
            <th className="p-4 text-left">Date</th>
          </tr>

        </thead>

        <tbody>

          {sortedTransactions.map((item) => (

            <tr
              key={item.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="p-4">
                {item.brand}
              </td>

              <td className="p-4">
                {item.size}
              </td>

              <td className="p-4">

                <span
                  className={
                    item.transaction_type === "IN"
                      ? "bg-green-100 text-green-700 px-2 py-1 rounded"
                      : "bg-red-100 text-red-700 px-2 py-1 rounded"
                  }
                >
                  {item.transaction_type}
                </span>

              </td>

              <td className="p-4">
                {item.quantity}
              </td>

              {/* <td className="p-4">
                {item.remarks}
              </td> */}

              <td className="p-4">
                {new Date(
                  item.transaction_date
                ).toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

    {/* {Mobile View} */}

    <div className="md:hidden space-y-4">

  {sortedTransactions.map((item) => (

    <div
      key={item.id}
      className="bg-white rounded-xl shadow-md p-4"
    >

      <div className="flex justify-between items-center mb-3">

        <h2 className="font-bold text-lg">
          {item.brand}
        </h2>

        <span
          className={
            item.transaction_type === "IN"
              ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
              : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold"
          }
        >
          {item.transaction_type}
        </span>

      </div>

      <div className="space-y-2 text-sm">

        <p className="text-gray-700">
          by <strong> {item.performed_by}</strong>
        </p>

        <p>
          <strong>Size:</strong> {item.size} mm
        </p>

        <p>
          <strong>Quantity:</strong> {item.quantity}
        </p>

        {/* <p>
          <strong>Remarks:</strong> {item.remarks}
        </p> */}

        <p>
          <strong>Date:</strong>{" "}
          {new Date(
            item.transaction_date
          ).toLocaleString()}
        </p>

      </div>

    </div>

  ))}

</div>

  </div>
);

}

export default TransactionHistory;