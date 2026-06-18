import { useEffect, useState } from "react";

import { getActivityHistory } from "../services/api";

function History() {

  const [history, setHistory] = useState([]);

  useEffect(() => {

    fetchHistory();

  }, []);

  const fetchHistory = async () => {

    try {

      const response =
        await getActivityHistory();

      setHistory(response.data);

    } catch (error) {

      console.error(error);

    }

  };

return (

  <div className="p-8">

    <h1 className="text-4xl font-bold mb-6">
      Inventory Activity History
    </h1>

    <div className="bg-white rounded-xl shadow-md overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Action</th>
            <th className="p-4 text-left">Description</th>
            <th className="p-4 text-left">Date & Time</th>
          </tr>

        </thead>

        <tbody>

          {history.map((item) => (

            <tr
              key={item.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="p-4">
                {item.id}
              </td>

              <td className="p-4">

                <span
                  className={
                    item.action === "CREATE"
                      ? "bg-green-100 text-green-700 px-2 py-1 rounded"
                      : item.action === "UPDATE"
                      ? "bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
                      : "bg-red-100 text-red-700 px-2 py-1 rounded"
                  }
                >
                  {item.action}
                </span>

              </td>

              <td className="p-4">
                {item.description}
              </td>

              <td className="p-4">
                {new Date(
                  item.created_at
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

export default History;