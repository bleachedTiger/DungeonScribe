import { ConfirmDialogState } from "../types";

function ConfirmDialog({ message, onConfirm, onCancel }:ConfirmDialogState) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <p className="text-white mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}


export default ConfirmDialog;