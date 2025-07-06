import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/study-techniques/active-recall')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentFileId, setCurrentFileId] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const backendUrl = 'http://localhost:5000';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const uploadFile = async (): Promise<void> => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('mediaFile', selectedFile); // 'mediaFile' must match the name in upload.single()

    setOutput('Uploading file...');
    setCurrentFileId('Uploading...');
    setIsUploading(true);
    setIsError(false);

    try {
      const response = await fetch(`${backendUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentFileId(data.fileId);
        setOutput(`File uploaded to Gemini! File ID: ${data.fileId}`);
        console.log('Upload success:', data);
      } else {
        setOutput(`Error: ${data.error || 'Unknown upload error'}`);
        setIsError(true);
        console.error('Upload error:', data);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setOutput(`Network error during upload: ${errorMessage}`);
      setIsError(true);
      console.error('Fetch error during upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">File Upload</h2>
      
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*,audio/*,video/*,application/pdf"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isUploading}
        />
      </div>

      <button
        onClick={uploadFile}
        disabled={isUploading || !selectedFile}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
          isUploading || !selectedFile
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Upload File'}
      </button>

      {currentFileId && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="text-sm font-medium text-gray-700">File ID:</p>
          <p className="text-sm text-gray-600 break-all">{currentFileId}</p>
        </div>
      )}

      {output && (
        <div className={`mt-4 p-3 rounded-md ${
          isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          <p className="text-sm">{output}</p>
        </div>
      )}

      {selectedFile && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm font-medium text-blue-700">Selected File:</p>
          <p className="text-sm text-blue-600">{selectedFile.name}</p>
          <p className="text-xs text-blue-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
        </div>
      )}
    </div>
  );
}

