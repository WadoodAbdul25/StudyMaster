import { useState } from 'react';
import { apiRequest } from '../api';

export default function UploadModal({ courseId, token, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or DOCX file');
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

    if (!courseId || !token) {
      setError('Choose a course and sign in before uploading.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const document = await apiRequest(`/courses/${courseId}/documents`, {
        token,
        method: 'POST',
        body: formData,
      });

      if (document?._id) {
        await apiRequest(`/documents/${document._id}/process`, {
          token,
          method: 'POST',
        });
      }

      onUploadSuccess();
      onClose();
    } catch (error) {
      setError(error.message || 'Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center sm:p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Upload Syllabus</h2>
        
        <div className="mb-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center sm:p-8">
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="block cursor-pointer">
            {file ? (
              <p className="break-words text-sm font-bold text-green-600">{file.name}</p>
            ) : (
              <p className="text-sm font-semibold text-slate-500">Tap to select a PDF or DOCX file</p>
            )}
          </label>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="rounded-lg bg-violet-600 px-4 py-3 font-bold text-white disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-3 font-bold text-slate-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
