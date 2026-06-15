import React from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

const DeleteProject = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 w-96 text-center shadow-lg relative">
        {/* Close (X) Icon */}
        <button
          className="absolute top-2 right-2 text-black hover:text-black text-2xl"
          onClick={onClose}
        >
          <IoCloseCircleOutline />
        </button>

        <h2 className="text-2xl font-semibold">Delete Project</h2>
        <p className="text-gray-500 mt-2">
          Are you sure you want to delete this Project?
        </p>

        <div className="flex justify-center gap-8 mt-4">
          <button
            className="my-bg text-white px-16 py-2 rounded-md"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="bg-white text-black border border-black px-16 py-2 rounded-md"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProject;
