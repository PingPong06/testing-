import { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser } from "../services/api";
import toast from "react-hot-toast"
import { motion } from "framer-motion";

import { Navigate } from "react-router-dom";

const Users = () => {

  const role = localStorage.getItem("role");

if (role !== "ADMIN") {
  return <Navigate to="/" />;
}

  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
  });

const [showDeleteModal, setShowDeleteModal] =
  useState(false);

const [userToDelete, setUserToDelete] =
  useState(null);

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

 const handleDelete = async () => {
  try {

    await deleteUser(userToDelete);

    toast.success(
      "User deleted successfully"
    );

    setShowDeleteModal(false);

    // setUserToDelete(null);

    fetchUsers();

  } catch (error) {

    toast.error(
      "Failed to delete user"
    );

  }
};

  const handleCreateUser = async () => {
    try {

      console.log(formData);
      await createUser(formData);

      setFormData({
        username: "",
        Email:"",
        password: "",
        role: "USER",
      });

      fetchUsers();

      toast.success("User created successfully")
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating user");
    }
  };

 const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
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
  type="email"
  name="email"
  placeholder="Email"
  value={formData.email}
  onChange={handleChange}
  className="w-full border p-3 rounded"
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
                      onClick={() => {
  setUserToDelete(user.id);
  setShowDeleteModal(true);
}}
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

      {showDeleteModal && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
          y: 30,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.8,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        className="
        bg-white
        p-6
        rounded-2xl
        shadow-xl
        w-[90%]
        max-w-md
        "
      >

        <h2 className="text-xl font-bold mb-3">
          Delete User
        </h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the user?
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={() =>
              setShowDeleteModal(false)
            }
            className="
            px-4
            py-2
            rounded-lg
            bg-gray-200
            "
          >
            Cancel
          </button>

          <button
  onClick={handleDelete}
  className="
  px-4
  py-2
  rounded-lg
  bg-red-600
  text-white
  "
>
  Delete
</button>

        </div>

      </motion.div>

    </div>
  )}
    </div>
  );
};

export default Users;
