import React from "react";

function DeleteConfirmationModal({ deleteNote, setShowDeleteConfirmation }) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md shadow-lg max-w-md">
        <p className="text-xl font-semibold mb-4">
          Are you sure you want to delete this note?
        </p>
        <div className="flex justify-end">
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md mr-2"
            onClick={deleteNote}
          >
            Confirm
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md"
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
