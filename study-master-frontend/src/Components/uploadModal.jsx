import { useState } from 'react';

export default function UploadModal({ onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      setFile(null);
    } else {
      setError('');
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('syllabus', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        onUploadSuccess();
        onClose();
      } else {
        setError('Upload failed. Try again.');
      }
    } catch (error) {
      setError('Network error. Check if backend is running.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Upload Syllabus</h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            {file ? (
              <p className="text-green-600">{file.name}</p>
            ) : (
              <p className="text-gray-500">Click to select a PDF file</p>
            )}
          </label>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex-1 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button
            onClick={onClose}
            className="border rounded-lg px-4 py-2 flex-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}