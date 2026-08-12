import { useState } from "react";
import toast from "react-hot-toast";
function ChangePasswordModal({
  isOpen,
  onClose,
  onSave,
}) {

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  if (!isOpen) return null;

const handleSubmit = () => {
    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
    }

    onSave(password);

    setPassword("");
    setConfirmPassword("");
};
  return (
    <div
      className="
      fixed inset-0
      bg-black/50
      flex items-center
      justify-center
      z-50
      "
    >

      <div
        className="
        bg-white
        p-6
        rounded-2xl
        shadow-xl
        w-[90%]
        max-w-md
        "
      >

        <h2
          className="
          text-2xl
          font-bold
          mb-4
          "
        >
          Change Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="
          w-full
          border
          rounded-lg
          p-3
          mb-4
          "
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          className="
          w-full
          border
          rounded-lg
          p-3
          mb-6
          "
        />

        <div
          className="
          flex
          justify-end
          gap-3
          "
        >

          <button
            onClick={onClose}
            className="
            px-4 py-2
            bg-gray-200
            rounded-lg
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="
            px-4 py-2
            bg-blue-600
            text-white
            rounded-lg
            "
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}

export default ChangePasswordModal; 