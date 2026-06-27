import { useState, useEffect } from "react";

function EditUsernameModal({
  isOpen,
  onClose,
  onSave,
  currentUsername,
}) {

  const [username, setUsername] =
    useState("");

  useEffect(() => {
    setUsername(currentUsername || "");
  }, [currentUsername]);

  if (!isOpen) return null;

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
          rounded-xl
          w-[90%]
          max-w-md
          shadow-lg
        "
      >

        <h2
          className="
            text-2xl
            font-semibold
            mb-4
          "
        >
          Edit Username
        </h2>

        <input
          type="text"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          placeholder="Enter new username"
          className="
            w-full
            border
            border-gray-300
            rounded-lg
            p-3
            mb-4
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
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
              px-4
              py-2
              bg-gray-200
              rounded-lg
              hover:bg-gray-300
            "
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSave(username)
            }
            className="
              px-4
              py-2
              bg-blue-600
              text-white
              rounded-lg
              hover:bg-blue-700
            "
          >
            Save
          </button>

        </div>

      </div>
    </div>
  );
}

export default EditUsernameModal;