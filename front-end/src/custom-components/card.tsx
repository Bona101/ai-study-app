import React, { useState } from 'react';
// No need to import a separate Flashcard.css if all styles are inline with Tailwind
// import './Flashcard.css';

interface FlashcardProps {
    question: string;
    answer: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ question, answer }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div
            className={`
                relative w-100 h-48 cursor-pointer
                shadow-lg rounded-lg transition-transform duration-600 ease-in-out
                transform-gpu perspective-1000
                ${isFlipped ? 'rotate-y-180' : ''}
            `}
            onClick={handleFlip}
            style={{ transformStyle: 'preserve-3d' }} // Required for 3D flip
        >
            {/* Front of the card */}
            <div
                className={`
                    absolute w-full h-full flex justify-center items-center
                    bg-white text-gray-800 text-2xl text-center p-5
                    rounded-lg backface-hidden
                `}
            >
                {question}  
            </div>

            {/* Back of the card */}
            <div
                className={`
                    absolute w-full h-full flex justify-center items-center
                    bg-gray-800 text-white text-2xl text-center p-5
                    rounded-lg backface-hidden
                    rotate-y-180
                `}
            >
                {answer}
            </div>
        </div>
    );
};

export default Flashcard;