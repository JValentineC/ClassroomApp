import React from 'react';

interface FileModalProps {
  isOpen: boolean;
  fileUrl: string | null;
  onClose: () => void;
}

const FileModal: React.FC<FileModalProps> = ({ isOpen, fileUrl, onClose }) => {
  if (!isOpen || !fileUrl) return null;

  return (
    <dialog
      id="file_modal"
      className="modal fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
      open={isOpen}
    >
      <div className="modal-box bg-black border p-6 rounded-lg shadow-lg w-120">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">File</h3>
        {fileUrl ? <iframe src={fileUrl} className="w-full h-96"></iframe> : <p className="py-4">No file available</p>}
      </div>
    </dialog>
  );
};

export default FileModal;
