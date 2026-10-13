import React from 'react';

export const GrecaBar: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full h-4 bg-[#a62b2b] flex items-center justify-center overflow-hidden select-none ${className}`}>
      <div className="w-full flex justify-around items-center opacity-90">
        {Array.from({ length: 12 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 24 12"
            className="h-3 w-6 fill-[#d99b26]"
            preserveAspectRatio="none"
          >
            <path d="M0 0h19.1v4h-9.55v4h9.55v4H0V0z" />
          </svg>
        ))}
      </div>
    </div>
  );
};
