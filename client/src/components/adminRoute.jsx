import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log("Role in AdminRoute:", role);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (
    role !== "SUPER_ADMIN"
  ) {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;