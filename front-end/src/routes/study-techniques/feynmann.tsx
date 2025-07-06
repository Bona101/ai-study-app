import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/study-techniques/feynmann')({
  component: RouteComponent,
});

function exportContentToWord(elementId: string, filename = 'document.doc') {
    var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
                  "xmlns:w='urn:schemas-microsoft-com:office:word' " +
                  "xmlns='http://www.w3.org/TR/REC-html40'>" +
                  "<head><meta charset='utf-8'><title>Export HTML To Word</title>" +
                  "<style>" +
                  "body { font-family: Arial, sans-serif; }" +
                  "pre { font-family: monospace; white-space: pre-wrap; }" +
                  "</style>" +
                  "</head><body>";
    var postHtml = "</body></html>";
    
    var targetElement = document.getElementById(elementId);
    if (!targetElement) {
        console.error("Element with ID '" + elementId + "' not found.");
        return;
    }
    
    var html = preHtml + targetElement.innerHTML + postHtml;

    var blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    var url = URL.createObjectURL(blob);

    var downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);

    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.click();

    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
}


function RouteComponent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentFileId, setCurrentFileId] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const promptText = `looking to practice the feynman study technique. Create a simplified(feynmanised) version of this file`;
  const [promptStatus, setPromptStatus] = useState('');
  const [geminiResponse, setGeminiResponse] = useState('');

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

  const sendPrompt = async () => {
    setPromptStatus('Sending prompt...');
    setGeminiResponse('');


    try {
      const response = await fetch(`${backendUrl}/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: currentFileId,
          prompt: promptText,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPromptStatus('Prompt sent successfully!');
        setGeminiResponse(data.generatedContent);
      } else {
        setPromptStatus(`Prompt failed: ${data.error || 'Unknown error'}`);
        setGeminiResponse(`Error: ${data.details || data.error}`);
        console.error('Prompt error:', data);
      }
    } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setPromptStatus(`Network error during prompt: ${errorMessage}`);
      setGeminiResponse(`Network error: ${errorMessage}`);
      console.error('Fetch error during prompt:', error);
    }
  };

    const handleExport = () => {
        // You need to decide which element's content you want to export.
        // If you want to export the Gemini response:
        if (geminiResponse) {
            // Create a temporary div to put the response into for exportContentToWord
            // This is because geminiResponse is just a string, not an element itself.
            const tempDiv = document.createElement('div');
            tempDiv.id = 'geminiResponseContent'; // Give it an ID
            tempDiv.innerHTML = `<pre>${geminiResponse}</pre>`; // Wrap in pre to maintain formatting
            document.body.appendChild(tempDiv); // Temporarily append to body

            exportContentToWord('geminiResponseContent', 'Gemini_Response.doc');
            
            document.body.removeChild(tempDiv); // Remove it after export
        } else {
            alert("No Gemini response to export.");
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
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${isUploading || !selectedFile
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
        <div className={`mt-4 p-3 rounded-md ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
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

      {promptStatus && <div className="status">{promptStatus}</div>}

      {geminiResponse && (
                    <div className="response">
                        <h3>Gemini Response:</h3>
                        <pre>{geminiResponse}</pre>
                        <p>
                          {geminiResponse}
                        </p>
                        <button onClick={handleExport} style={{ marginTop: '10px' }}>Export Response to Word</button>
                    </div>
                )}

                <button onClick={sendPrompt} className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${isUploading || !selectedFile
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}>sendPrompt</button>
    </div>
  );
}


