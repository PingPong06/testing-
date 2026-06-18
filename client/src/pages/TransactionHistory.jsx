import { useEffect, useState } from "react";
import { getTransactionHistory } from "../services/api";

function TransactionHistory() {

  const [transactions, setTransactions] = useState([]);

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

  return (
  <div className="p-8">

    <h1 className="text-4xl font-bold mb-6">
      Inventory Transactions
    </h1>

    <div className="bg-white rounded-xl shadow-md overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>
            <th className="p-4 text-left">Product</th>
            <th className="p-4 text-left">Size</th>
            <th className="p-4 text-left">Type</th>
            <th className="p-4 text-left">Quantity</th>
            <th className="p-4 text-left">Remarks</th>
            <th className="p-4 text-left">Date</th>
          </tr>

        </thead>

        <tbody>

          {transactions.map((item) => (

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

              <td className="p-4">
                {item.remarks}
              </td>

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

  </div>
);

}

export default TransactionHistory;