import { useEffect, useState } from "react";

import { getActivityHistory } from "../services/api";

function History() {

  const [history, setHistory] = useState([]);
  const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [sortBy, setSortBy] = useState("latest"); 
const [actionFilter, setActionFilter] = useState("");

  useEffect(() => {

    fetchHistory();

  }, []);

  const fetchHistory = async () => {
  try {
    const response = await getActivityHistory();

    console.log(response.data);

    setHistory(response.data);
  } catch (error) {
    console.error(error);
  }
};

  const filteredHistory = history.filter((item) => {

  const historyDate =
    new Date(item.created_at);

    if (
  actionFilter &&
  item.action !== actionFilter
) {
  return false;
}

  if (
    fromDate &&
    historyDate < new Date(fromDate)
  ) {
    return false;
  }

  if (
    toDate &&
    historyDate >
      new Date(toDate + "T23:59:59")
  ) {
    return false;
  }

  return true;
});

const sortedHistory =
  [...filteredHistory].sort((a, b) => {

    switch (sortBy) {

      case "latest":
        return (
          new Date(b.created_at) -
          new Date(a.created_at)
        );

      case "oldest":
        return (
          new Date(a.created_at) -
          new Date(b.created_at)
        );

      case "action_asc":
        return a.action.localeCompare(
          b.action
        );

      case "action_desc":
        return b.action.localeCompare(
          a.action
        );

      default:
        return 0;
    }
  });

return (

  <div className="p-4 md:p-8">

    <h1 className="text-2xl md:text-4xl font-bold mb-6">
      Inventory Activity History
    </h1>

    <div className="flex flex-wrap gap-4 mb-6">

  <input
    type="date"
    value={fromDate}
    onChange={(e) =>
      setFromDate(e.target.value)
    }
    className="border rounded-lg px-4 py-2"
  />

  <input
    type="date"
    value={toDate}
    onChange={(e) =>
      setToDate(e.target.value)
    }
    className="border rounded-lg px-4 py-2"
  />

  <select
    value={sortBy}
    onChange={(e) =>
      setSortBy(e.target.value)
    }
    className="border rounded-lg px-4 py-2"
  >
    <option value="latest">
      Latest First
    </option>

    <option value="oldest">
      Oldest First
    </option>

    <option value="action_asc">
       A-Z
    </option>

    <option value="action_desc">
      Z-A
    </option>

  </select>
  <select
  value={actionFilter}
  onChange={(e) => setActionFilter(e.target.value)}
  className="border rounded-lg px-4 py-2"
>
  <option value="">All Actions</option>
  <option value="CREATE">CREATE</option>
  <option value="UPDATE">UPDATE</option>
  <option value="DELETE">DELETE</option>
</select>

</div>

    <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
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

          {sortedHistory.map((item) => (

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
    <div className="md:hidden space-y-4">

  {sortedHistory.map((item) => (
    // console.log(item);
    <div
      key={item.id}
      className="bg-white rounded-xl shadow-md p-4"
    >

      <div className="flex justify-between items-center mb-3">

        <h2 className="font-bold text-lg">
          #{item.id}
        </h2>

        <span
          className={
            item.action === "CREATE"
              ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
              : item.action === "UPDATE"
              ? "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold"
              : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold"
          }
        >
          {item.action}
        </span>

      </div>

      <div className="space-y-2 text-sm">

        <p>
          <strong>Description:</strong>
        </p>

        <p className="text-gray-700">
          {item.description}
        </p>

        <p className="text-gray-700">
          by <strong> {item.username}</strong>
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {new Date(item.created_at).toLocaleString()}
        </p>

      </div>

    </div>

  ))}

</div>

  </div>

);

}

export default History;