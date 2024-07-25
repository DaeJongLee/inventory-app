import React from 'react';

interface LocationButtonProps {
  id: string;
  onClick: (id: string) => void;
  isHighlighted: boolean;
}

const LocationButton: React.FC<LocationButtonProps> = ({ id, onClick, isHighlighted }) => {
  const baseClasses = "p-2 text-center font-bold transition-all duration-300";
  const highlightClasses = isHighlighted ? "animate-pulse bg-yellow-300" : "bg-gray-200 hover:bg-gray-300";

  return (
    <button
      onClick={() => onClick(id)}
      className={`${baseClasses} ${highlightClasses}`}
    >
      {id}
    </button>
  );
};

export default LocationButton;