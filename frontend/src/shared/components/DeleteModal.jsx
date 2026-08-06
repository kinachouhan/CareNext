import React from "react";

const DeleteModal = ({ open, onClose, onDelete }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-96">

        <h2 className="text-xl font-bold">
          Delete Product
        </h2>

        <p className="mt-3 text-gray-500">
          Are you sure?
        </p>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="border px-5 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-5 py-2 rounded-lg"
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  );
};

export default DeleteModal;