import { useState, useEffect } from "react";

function EditEmailModal({
  isOpen,
  onClose,
  onSave,
  currentEmail,
}) {

  const [email, setEmail] =
    useState("");

  useEffect(() => {

    setEmail(currentEmail || "");

  }, [currentEmail]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0
        bg-black/50
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          bg-white
          rounded-xl
          p-6
          w-[90%]
          max-w-md
        "
      >

        <h2
          className="
            text-xl
            font-semibold
            mb-4
          "
        >
          Edit Email
        </h2>

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="
            w-full
            border
            p-3
            rounded-lg
            mb-4
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
            onClick={() =>
              onSave(email)
            }
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

export default EditEmailModal;