import { useState } from "react";
import { motion } from "framer-motion";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName = "this item",
}) {
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  const canDelete = input.trim().toLowerCase() === "delete";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
      >
        <h2 className="text-2xl font-bold text-red-700 mb-4">
          Delete Learning Path
        </h2>

        <p className="text-gray-700 mb-6">
          This action cannot be undone.
          <br />
          To delete <strong>"{itemName}"</strong>,<br />
          type <strong>delete</strong> below:
        </p>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type 'delete' to confirm"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-red-500 outline-none mb-6"
        />

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={!canDelete}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              canDelete
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
