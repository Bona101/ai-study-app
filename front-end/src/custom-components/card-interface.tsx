import React, { useState } from 'react';
import Flashcard from './card'; // Assuming 'card.tsx' or 'card.jsx' is your Flashcard component


const FlashcardApp: React.FC<{ cards: { id: number; question: string; answer: string }[] }> = ({ cards }) => { // Added React.FC for TypeScript
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    // Effect to reset currentCardIndex if cards array changes significantly (e.g., becomes empty)
    // or if the previously displayed index is out of bounds for new cards
    React.useEffect(() => {
        if (cards.length === 0) {
            setCurrentCardIndex(0); // Reset to 0 or handle "no cards" state
        } else if (currentCardIndex >= cards.length) {
            setCurrentCardIndex(cards.length - 1); // Clamp index if it's too high for new array
        }
    }, [cards, currentCardIndex]); // Depend on cards array and currentCardIndex

    const handleNext = () => {
        if (currentCardIndex < cards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
        }
    };

    const currentCard = cards[currentCardIndex];

    // Handle case where there are no cards or currentCard is undefined
    if (!currentCard) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center
                            bg-[var(--color-background)] text-[var(--color-foreground)] p-4">
                <p className="text-xl">No flashcards generated yet. Upload a file and send a prompt!</p>
            </div>
        );
    }


    return (
        <div
            className="
                min-h-screen flex flex-col items-center justify-center
                bg-[var(--color-background)] text-[var(--color-foreground)]
                p-4
            "
        >
            <Flashcard
                question={currentCard?.question}
                answer={currentCard?.answer}
            />
            <div className="flex gap-4 mt-8"> {/* Added gap and top margin */}
                <button
                    onClick={handlePrevious}
                    disabled={currentCardIndex === 0}
                    className={`
                        py-2 px-6 rounded-md text-lg
                        bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)]
                        hover:bg-[var(--color-secondary-foreground)] hover:text-[var(--color-secondary)]
                        transition-colors duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentCardIndex === cards.length - 1}
                    className={`
                        py-2 px-6 rounded-md text-lg
                        bg-[var(--color-primary)] text-[var(--color-primary-foreground)]
                        hover:bg-[var(--color-primary-foreground)] hover:text-[var(--color-primary)]
                        transition-colors duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default FlashcardApp;