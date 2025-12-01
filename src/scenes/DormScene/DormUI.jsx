import { useMemo } from "react";

export default function DormUI({ question, choices, onSelect }) {
  if (!question) return null;

  const shuffledChoices = useMemo(() => {
    const shuffled = [...choices];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [choices]);

  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-end pb-10 pointer-events-auto">
      <div className="bg-white text-[#1e1e1e] font-bold border-2 border-[#1e1e1e] p-4 mb-4">
        {question}
      </div>

      <div className="flex gap-4">
        {shuffledChoices.map((choice, index) => (
          <button
            key={index}
            className="px-4 py-2 bg-white border-2 border-[#1e1e1e] text-[#1e1e1e] font-semibold"
            onClick={() => onSelect(choice)}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}
