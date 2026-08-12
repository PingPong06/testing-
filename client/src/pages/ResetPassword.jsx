import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";
import toast from "react-hot-toast";

function ResetPassword() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

   console.log("Token from URL:", token);
if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
}

    try {
      const response =
        await resetPassword(token, password);

     toast.success(response.data.message);

      navigate("/login");

    }catch (error) {
    console.log("Reset password error:", error);
    console.log("Response:", error.response?.data);

    toast.error(
        error.response?.data?.message || "Password reset failed"
    );
}
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">
        Reset Password
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          className="w-full border p-3 rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;