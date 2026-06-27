import { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser, updateUsername, updateUserPassword, updateUserEmail } from "../services/api";
import toast from "react-hot-toast"
import { motion } from "framer-motion";
import EditEmailModal from "../components/EditEmailModal";
import { Navigate } from "react-router-dom";
import {
  FaEdit,
  FaEllipsisV,
  FaKey,
  FaTrash,
  FaShieldAlt,
} from "react-icons/fa";
import EditUsernameModal
from "../components/EditUsernameModal";
import ChangePasswordModal
from "../components/ChangePasswordModal";

const Users = () => {

  const role = localStorage.getItem("role");

// if (role !== "ADMIN") {
//   return <Navigate to="/" />;
// }

  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [editingUsername, setEditingUsername] =
  useState(null);

const [editingEmail, setEditingEmail] =
  useState(null);

// const [showPasswordModal, setShowPasswordModal] =
//   useState(false);

// const [userToChangePassword,
//   setUserToChangePassword] =
//   useState(null);

  const currentUserId = Number(localStorage.getItem("userId"));

const isSuperAdmin = currentUserId === 1;

const [showDeleteModal, setShowDeleteModal] =
  useState(false);

const [userToDelete, setUserToDelete] =
  useState(null);

  const [openMenu, setOpenMenu] =
  useState(null);

  const [
  showEditEmailModal,
  setShowEditEmailModal,
] = useState(false);

const [showEditUsernameModal, setShowEditUsernameModal] =
  useState(false);

  const [
  showPasswordModal,
  setShowPasswordModal
] = useState(false);

const [
  userToChangePassword,
  setUserToChangePassword
] = useState(null);

const [
  selectedUser,
  setSelectedUser,
] = useState(null);



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

      // console.log(formData);
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

const handleEditUsername = (user) => {

  // console.log("Edit clicked:", user);

  setSelectedUser(user);

  setShowEditUsernameModal(true);

};

const handleChangePassword = (
  user
) => {

  setUserToChangePassword(user);

  setShowPasswordModal(true);

};  
const handleEditEmail = (user) => {

  setSelectedUser(user);

  setShowEditEmailModal(true);

};

const handleSaveEmail =
async (newEmail) => {

  try {

    await updateUserEmail(
      selectedUser.id,
      newEmail
    );

    toast.success(
      "Email updated successfully"
    );

    fetchUsers();

    setShowEditEmailModal(false);

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Update failed"
    );

  }

};

const handleSaveUsername =
async (newUsername) => {

  try {

    await updateUsername(
      selectedUser.id,
      newUsername
    );

    toast.success(
      "Username updated successfully"
    );

    fetchUsers();

    setShowEditUsernameModal(false);

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Update failed"
    );

  }

};

const handleSavePassword =
async (newPassword) => {

  try {

    await updateUserPassword(
      userToChangePassword.id,
      newPassword
    );

    toast.success(
      "Password updated successfully"
    );

    setShowPasswordModal(false);

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Failed to update password"
    );

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

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Username</th>

              <th className="text-left p-3">Role</th>

              <th className="text-left p-3">e-mail</th>

              <th className="p-3 w-12"></th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (

              <tr key={user.id} className="border-b">
                <td className="p-3 flex items-center gap-2">
  <span>{user.username}</span>
</td>

                <td className="p-3">{user.role}</td>

                <td className="p-3">
  {user.email || "No Email"}
</td>

              <td className="relative p-3">

  <button
    onClick={() =>
      setOpenMenu(
        openMenu === user.id
          ? null
          : user.id
      )
    }
    className="
      p-2
      hover:bg-gray-100
      rounded-full
    "
  >
    <FaEllipsisV />
  </button>

  {openMenu === user.id && (

    <div
      className="
        absolute
        right-0
        mt-2
        w-48
        bg-white
        border
        rounded-lg
        shadow-lg
        z-50
      "
    >

      <button
  onClick={() => {
    handleEditUsername(user);
    setOpenMenu(null);
  }}
  className="
    w-full
    px-4
    py-2
    flex
    items-center
    gap-2
    hover:bg-gray-100
  "
>
  <FaEdit />
  Edit Username
</button>

      <button
        onClick={() => {
          handleEditEmail(user);
          setOpenMenu(null);
        }}
        className="
          w-full
          px-4
          py-2
          flex
          items-center
          gap-2
          hover:bg-gray-100
        "
      >
        <FaEdit />
        Edit Email
      </button>

      <button
        onClick={() => {
          handleChangePassword(user);
          setOpenMenu(null);
        }}
        className="
          w-full
          px-4
          py-2
          flex
          items-center
          gap-2
          hover:bg-gray-100
        "
      >
        <FaKey />
        Change Password
      </button>

      {!isSuperAdmin ||
      user.id === currentUserId ? (

        <div
          className="
            px-4
            py-2
            flex
            items-center
            gap-2
            text-green-600
          "
        >
          <FaShieldAlt />
          Protected
        </div>

      ) : (

        <button
          onClick={() => {
            setUserToDelete(user.id);
            setShowDeleteModal(true);
            setOpenMenu(null);
          }}
          className="
            w-full
            px-4
            py-2
            flex
            items-center
            gap-2
            text-red-600
            hover:bg-red-50
          "
        >
          <FaTrash />
          Delete User
        </button>

      )}

    </div>

  )}

</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="md:hidden space-y-4">

  {users.map((user) => (

    <div
      key={user.id}
      className="
        bg-white
        rounded-2xl
        shadow-md
        p-4
        relative
      "
    >

      {/* Header */}
      <div className="flex justify-between items-start">

        <div className="flex-1">

          <h3 className="text-lg font-bold">
            {user.username}
          </h3>

          <p className="text-sm text-blue-600 font-medium">
            {user.role}
          </p>

          <p className="text-sm text-gray-600 break-all mt-1">
            {user.email || "No Email"}
          </p>

        </div>

        <button
          onClick={() =>
            setOpenMenu(
              openMenu === user.id
                ? null
                : user.id
            )
          }
          className="
            p-2
            hover:bg-gray-100
            rounded-full
          "
        >
          <FaEllipsisV />
        </button>

      </div>

      {/* Dropdown */}
      {openMenu === user.id && (

        <div
          className="
            mt-4
            border-t
            pt-3
            space-y-2
          "
        >

          <button
            onClick={() => {
              handleEditUsername(user);
              setOpenMenu(null);
            }}
            className="w-full text-left py-2"
          >
            ✏️ Edit Username
          </button>

          <button
            onClick={() => {
              handleEditEmail(user);
              setOpenMenu(null);
            }}
            className="w-full text-left py-2"
          >
            📧 Edit Email
          </button>

          <button
            onClick={() => {
              handleChangePassword(user);
              setOpenMenu(null);
            }}
            className="w-full text-left py-2"
          >
            🔑 Change Password
          </button>

          {!isSuperAdmin ||
          user.id === currentUserId ? (

            <div className="text-green-600 py-2">
              🛡️ Protected
            </div>

          ) : (

            <button
              onClick={() => {
                setUserToDelete(user.id);
                setShowDeleteModal(true);
                setOpenMenu(null);
              }}
              className="
                w-full
                text-left
                py-2
                text-red-600
              "
            >
              🗑️ Delete User
            </button>

          )}

        </div>

      )}

    </div>   

  ))}

</div>      {/* MOBILE CONTAINER ENDS */}
    
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


  <EditEmailModal
  isOpen={showEditEmailModal}
  onClose={() =>
    setShowEditEmailModal(false)
  }
  onSave={handleSaveEmail}
  currentEmail={selectedUser?.email}
/>

<EditUsernameModal
  isOpen={showEditUsernameModal}
  onClose={() =>
    setShowEditUsernameModal(false)
  }
  onSave={handleSaveUsername}
  currentUsername={
    selectedUser?.username
  }
/>

<ChangePasswordModal
  isOpen={showPasswordModal}
  onClose={() =>
    setShowPasswordModal(false)
  }
  onSave={handleSavePassword}
/>
    </div>
   
 );
};



export default Users;
