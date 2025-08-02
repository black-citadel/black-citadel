import React, { useState } from 'react';

interface RevealableTextProps {
  value: string;
  isBase64?: boolean;
  hiddenText?: string;
}

export const RevealableText: React.FC<RevealableTextProps> = ({ 
  value, 
  isBase64 = false,
  hiddenText = '••••••••'
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const toggleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  const displayValue = isRevealed 
    ? (isBase64 ? atob(value) : value)
    : hiddenText;

  return (
    <div className="flex items-start gap-2">
      <span className="text-xs font-mono break-all flex-1">{displayValue}</span>
      <button 
        className="text-blue-600 text-xs hover:text-blue-700 font-medium flex-shrink-0"
        onClick={toggleReveal}
      >
        {isRevealed ? 'Hide' : 'Reveal'}
      </button>
    </div>
  );
};