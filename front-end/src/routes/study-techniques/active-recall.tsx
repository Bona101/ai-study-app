import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import FlashcardApp from '@/custom-components/card-interface';

export const Route = createFileRoute('/study-techniques/active-recall')({
  component: activeRecallComponent,
})

function activeRecallComponent() {
  const [pastedText, setPastedText] = useState<string>('');
  const [importSection, setImportSection] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentFileId, setCurrentFileId] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [flashcards, setFlashcards] = useState<{ id: number; question: string; answer: string }[]>([])
  const uniqueRandomCharacters = "faafafdf7cddaa9"

  const promptText = `
  create flashcards from this file. start a question with Q[${uniqueRandomCharacters}] and answer with A[${uniqueRandomCharacters}].
  the only place you should write this code ie - 'faafafdf7cddaa9', is when writing a question or an answer.
  
  Your response should only contain the questions and answers. No prior text. 
  No text after the questions and answers.
  
    so your output will look something like this if you were creating 2 flashcards(this is just a random example with random questions and answers):
  """
  Q[faafafdf7cddaa9]: What is a biscuit?
  A[faafafdf7cddaa9]: A biscuit is a snack

  Q[faafafdf7cddaa9]: What is a house?
  A[faafafdf7cddaa9]: A house is a building
  """
  
  Notice how the entire response begins with a question (in this case - 'Q[faafafdf7cddaa9]: What is a biscuit?') ie - no prior text, and ends with an answer (in this case - 'A[faafafdf7cddaa9]: A house is a building') ie - no ending text after the last answer.
  So essentially the first characters in your response should be 'Q[faafafdf7cddaa9]: [Some question]' and the last characters should be 'A[faafafdf7cddaa9]: [Some answer]'`;
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
        setOutput(`File uploaded!`);
        console.log('Upload success:', data);
      } else {
        setOutput(`Error: ${data.error || 'Unknown upload error'}`);
        setIsError(true);
        console.error('Upload error:', data);
      }

      sendPrompt(data.fileId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setOutput(`Network error during upload: ${errorMessage}`);
      setIsError(true);
      console.error('Fetch error during upload:', error);
    } finally {
      setIsUploading(false);
    }



  };

  const sendPrompt = async (id: string) => {
    setPromptStatus('Sending prompt...');
    setGeminiResponse('');


    try {
      const response = await fetch(`${backendUrl}/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: id,
          prompt: promptText,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPromptStatus('Prompt sent successfully!');
        const resp = data.generatedContent;
        console.log(resp)
        setGeminiResponse(resp);
        const fc = parseFlashcardString(resp);
        console.log(fc);
        setFlashcards([...fc]);
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

  const formatFlashcardsForExport = (flashcards: any[]) => {
    return flashcards.map(card => `${card.question}\t${card.answer}`).join('\n');
  };

  const handleExportFlashcards = () => {
    if (flashcards.length === 0) {
      alert("No flashcards to export!");
      return;
    }

    const formattedData = formatFlashcardsForExport(flashcards);
    const blob = new Blob([formattedData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards.txt'; // Or .csv if you use commas
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  const handleImportFlashcards = () => {
    if (!pastedText.trim()) {
      alert("Please paste text to import!");
      return;
    }

    try {
      const importedFlashcards = parseImportedFlashcards(pastedText);
      if (importedFlashcards.length > 0) {
        setFlashcards(importedFlashcards);
        setOutput('Flashcards imported successfully!');
        setIsError(false);
        setPastedText(''); // Clear textarea after import
      } else {
        setOutput('No valid flashcards found in the pasted text. Ensure correct format (Question\\tAnswer).');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error parsing imported flashcards:', error);
      setOutput('Error importing flashcards. Please check the format.');
      setIsError(true);
    }
  };

  const parseImportedFlashcards = (text: string) => {
    const parsed = [];
    let idCounter = 1;
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    for (const line of lines) {
      // Assuming tab-separated values (TSV) for Q\tA
      const parts = line.split('\t');
      if (parts.length >= 2) {
        parsed.push({
          id: idCounter++,
          question: parts[0].trim(),
          answer: parts[1].trim()
        });
      }
    }
    return parsed;
  };


  const displayImportSection = () => {
    setImportSection(true);
  }
  const displayUploadSection = () => {
    setImportSection(false);
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
      {!flashcards[0] ? (

        importSection ? (<div>
          {/* // ... after the file upload and prompt status elements */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Import Flashcards from Text</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={6}
              placeholder="Paste your flashcards here (e.g., Question\tAnswer\nQuestion2\tAnswer2)"
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
            ></textarea>
            <div className=''>

              <button
                onClick={handleImportFlashcards}
                disabled={!pastedText.trim()}
                className={`mt-4 w-full py-2 px-4 rounded-md font-medium transition-colors ${!pastedText.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
              >
                Import Flashcards
              </button>
            </div>
            <button onClick={displayUploadSection} className='border p-3'>{"<- Upload File"}</button>
          </div>
        </div>


        ) :
          (<div>
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

            {/* {currentFileId && (
            <div className="mt-4 p-3 bg-gray-100 rounded-md">
              <p className="text-sm font-medium text-gray-700">File ID:</p>
              <p className="text-sm text-gray-600 break-all">{currentFileId}</p>
            </div>
          )} */}
{/* 
            {output && (
              <div className={`mt-4 p-3 rounded-md ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                <p className="text-sm">{output}</p>
              </div>
            )} */}

            {selectedFile && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-medium text-blue-700">Selected File:</p>
                <p className="text-sm text-blue-600">{selectedFile.name}</p>
                <p className="text-xs text-blue-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            )}

            {promptStatus && <div className="status">{promptStatus === "Sending prompt..." ? '' : promptStatus}</div>}
            {(output === "Uploading file..." || promptStatus === "Sending prompt...") &&
              <div className='bg-gray-200 text-gray-400 p-3 rounded-lg my-3'>
                Loading...
              </div>
            }

            <button onClick={displayImportSection} className='border p-3' disabled={output === "Uploading file..." || promptStatus === "Sending prompt..."}>{"Import flashcards ->"}</button>
            {/* // ... after the file upload and prompt status elements */}
            {/* <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Import Flashcards from Text</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={6}
              placeholder="Paste your flashcards here (e.g., Question\tAnswer\nQuestion2\tAnswer2)"
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
            ></textarea>
            <button
              onClick={handleImportFlashcards}
              disabled={!pastedText.trim()}
              className={`mt-4 w-full py-2 px-4 rounded-md font-medium transition-colors ${!pastedText.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
            >
              Import Flashcards
            </button>
          </div> */}

            {geminiResponse && (
              <div className="response">
                <h3>Gemini Response:</h3>
                {/* <pre>{geminiResponse}</pre> */}
                {/* <p>
                          {geminiResponse}
                        </p> */}
                {/* <button onClick={handleExport} style={{ marginTop: '10px' }}>Export Response to Word</button> */}
              </div>
            )}

            {/* <button onClick={sendPrompt} className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${isUploading || !selectedFile
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}>sendPrompt</button> */}

          </div>)) : (

        (<div>
          <FlashcardApp cards={flashcards} />
          <button
            onClick={handleExportFlashcards}
            className="mt-4 w-full py-2 px-4 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-colors"
          >
            Export Flashcards
          </button>
        </div>
        ))}
      {/* {flashcards[0] && (<FlashcardApp cards={flashcards}/>)} */}


    </div>
  );
}

function parseFlashcardString(str: string) {
  const flashcards = [];
  let idCounter = 1;
  let currentQuestion = null; // To hold a question until its answer is found

  // Split the string into individual lines and filter out empty lines
  const lines = str.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // Define the unique characters used in your prompt
  const uniqueRandomCharacters = "faafafdf7cddaa9";
  const qPrefix = `Q[${uniqueRandomCharacters}]:`;
  const aPrefix = `A[${uniqueRandomCharacters}]:`;

  for (const line of lines) {
    if (line.startsWith(qPrefix)) {
      // This is a question line
      const content = line.substring(qPrefix.length).trim();
      currentQuestion = {
        id: idCounter,
        question: content,
        answer: "" // Placeholder, will be filled by the next 'A' line
      };
    } else if (line.startsWith(aPrefix) && currentQuestion) {
      // This is an answer line and we have a pending question
      const content = line.substring(aPrefix.length).trim();
      currentQuestion.answer = content;
      flashcards.push(currentQuestion);
      idCounter++; // Increment ID after a full card is formed
      currentQuestion = null; // Reset for the next pair
    }
  }

  return flashcards;
}





