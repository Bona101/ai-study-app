import React, { useState, useEffect } from 'react';

// Define the types for the props of ScalableText component
interface ScalableTextProps {
  text: string | null | undefined; // Text can be string, null, or undefined
  maxFontSize?: number;
  minFontSize?: number;
  thresholdLength?: number;
  reductionPerChar?: number;
  className?: string; // Optional CSS classes
}

/**
 * React component that dynamically adjusts its font size based on text length.
 * As text length increases beyond a threshold, the font size decreases linearly.
 *
 * @param {ScalableTextProps} props
 */
function ScalableText({ 
  text, 
  maxFontSize = 24, 
  minFontSize = 14, 
  thresholdLength = 50, 
  reductionPerChar = 0.1, 
  className = '' 
}: ScalableTextProps): JSX.Element { // Specify return type for functional component
  const [fontSize, setFontSize] = useState<number>(maxFontSize); // Explicitly type useState

  useEffect(() => {
    // Ensure text is a string before proceeding
    if (typeof text !== 'string' || text === null || text === undefined) {
      setFontSize(maxFontSize);
      return;
    }

    const textLength: number = text.length; // Explicitly type textLength

    if (textLength <= thresholdLength) {
      // If text is short or within threshold, use max font size
      setFontSize(maxFontSize);
    } else {
      // Calculate how much length exceeds the threshold
      const excessLength: number = textLength - thresholdLength;
      // Calculate the total reduction needed
      const calculatedReduction: number = excessLength * reductionPerChar;
      
      // Determine the new font size
      let newSize: number = maxFontSize - calculatedReduction;
      
      // Ensure the new font size doesn't go below the minimum
      newSize = Math.max(minFontSize, newSize);
      
      // (Optional) Ensure it doesn't accidentally exceed maxFontSize, though logic should prevent this
      newSize = Math.min(maxFontSize, newSize); 

      setFontSize(newSize);
    }
  }, [text, maxFontSize, minFontSize, thresholdLength, reductionPerChar]); // Recalculate if any of these props change

  return (
    <div 
      className={className} 
      style={{ 
        fontSize: `${fontSize}px`, 
        transition: 'font-size 0.2s ease-out' 
      }}
    >
      {text}
    </div>
  );
}

export default ScalableText;