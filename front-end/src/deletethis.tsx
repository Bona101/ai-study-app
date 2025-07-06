import React, { useState } from 'react';
import './App.css'; // You can create this for basic styling

// Define the export function outside the component if it doesn't need component state,
// or inside if it needs access to props/state (though not in this specific case).
// For simplicity, we'll put it directly in App.js for now.

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


function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFileId, setUploadedFileId] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    const [promptText, setPromptText] = useState('');
    const [promptStatus, setPromptStatus] = useState('');
    const [geminiResponse, setGeminiResponse] = useState('');

    const API_BASE_URL = 'http://localhost:5000'; // Make sure this matches your backend PORT

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const uploadFile = async () => {
        setUploadStatus('Uploading...');
        setUploadedFileId(''); // Clear previous ID
        setPromptText(''); // Clear previous prompt text
        setGeminiResponse(''); // Clear previous response
        setPromptStatus(''); // Clear previous prompt status

        if (!selectedFile) {
            setUploadStatus('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('mediaFile', selectedFile);

        try {
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setUploadedFileId(data.fileId);
                setUploadStatus(`File uploaded successfully! File ID: ${data.fileId}`);
            } else {
                setUploadStatus(`Upload failed: ${data.error || 'Unknown error'}`);
                console.error('Upload error:', data);
            }
        } catch (error) {
            setUploadStatus(`Network error during upload: ${error.message}`);
            console.error('Fetch error during upload:', error);
        }
    };

    const sendPrompt = async () => {
        setPromptStatus('Sending prompt...');
        setGeminiResponse('');

        if (!uploadedFileId) {
            setPromptStatus('Please upload a file first.');
            return;
        }

        if (!promptText.trim()) {
            setPromptStatus('Please enter a prompt.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/prompt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileId: uploadedFileId,
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
            setPromptStatus(`Network error during prompt: ${error.message}`);
            setGeminiResponse(`Network error: ${error.message}`);
            console.error('Fetch error during prompt:', error);
        }
    };

    // New handler for the export button
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
        <div className="App">
            <div className="container">
                <h1>Gemini File Interaction</h1>

                <div className="form-group">
                    <label htmlFor="mediaFile">Upload Media File:</label>
                    <input type="file" id="mediaFile" accept="image/*,video/*,audio/*" onChange={handleFileChange} />
                    <button onClick={uploadFile} disabled={!selectedFile}>Upload File</button>
                    {uploadStatus && <div className="status">{uploadStatus}</div>}
                </div>

                <hr />

                <h2>Prompt Gemini with Uploaded File</h2>
                <div className="form-group">
                    <label htmlFor="fileId">Uploaded File ID:</label>
                    <input type="text" id="fileId" value={uploadedFileId} readOnly placeholder="File ID will appear here after upload" />
                </div>
                <div className="form-group">
                    <label htmlFor="promptText">Your Prompt:</label>
                    <textarea
                        id="promptText"
                        rows="5"
                        placeholder="Describe what's in the image/video, ask a question, etc."
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                    ></textarea>
                </div>
                <button onClick={sendPrompt} disabled={!uploadedFileId || !promptText.trim()}>Send Prompt</button>
                
                {promptStatus && <div className="status">{promptStatus}</div>}
                {geminiResponse && (
                    <div className="response">
                        <h3>Gemini Response:</h3>
                        <pre id="geminiResponsePre">{geminiResponse}</pre> {/* Give the pre tag an ID */}
                        <button onClick={handleExport} style={{ marginTop: '10px' }}>Export Response to Word</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;