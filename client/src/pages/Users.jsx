import { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser } from "../services/api";

import { Navigate } from "react-router-dom";

const Users = () => {

  const role = localStorage.getItem("role");

if (role !== "ADMIN") {
  return <Navigate to="/" />;
}

  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "USER",
  });

  const fetchUsers = async () => {
    try {
      const response = await getUsers();

      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);

      fetchUsers();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Error deleting user");
    }
  };

  const handleCreateUser = async () => {
    try {
      await createUser(formData);

      setFormData({
        username: "",
        password: "",
        role: "USER",
      });

      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Error creating user");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Users Management</h1>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Create User</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({
                ...formData,
                username: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>

            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value,
                })
              }
              className="border p-2 rounded w-full"
            >
              <option value="USER">USER</option>

              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <button
            onClick={handleCreateUser}
            className="bg-blue-600 text-white rounded px-4 py-2 cursor-pointer"
          >
            Create User
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Username</th>

              <th className="text-left p-3">Role</th>

              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-3">{user.username}</td>

                <td className="p-3">{user.role}</td>

                <td className="p-3">
                  {user.role === "ADMIN" ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Protected
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
