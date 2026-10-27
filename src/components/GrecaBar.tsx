import React from 'react';

export interface GrecaBarProps {
  className?: string;
  height?: 'sm' | 'md';
  animated?: boolean;
}

/**
 * GrecaBar: Cenefa ceremonial con grecas mayas escalonadas (xicalcoliuhqui).
 * Paleta oficial: #9E2A2B (Rojo Carmesí) y #FFFDF2 (Crema) / #2A7B4C (Verde Jade).
 */
export const GrecaBar: React.FC<GrecaBarProps> = ({
  className = '',
  height = 'md',
  animated = true,
}) => {
  const hClass = height === 'sm' ? 'h-3' : 'h-4';
  const svgH = height === 'sm' ? 'h-2.5' : 'h-3';

  return (
    <div
      className={`w-full ${hClass} bg-[#9E2A2B] flex items-center justify-center overflow-hidden select-none border-y border-[#4a1213] ${
        animated ? 'animate-greca-arcade' : ''
      } ${className}`}
    >
      <div className="w-full flex justify-around items-center px-1">
        {Array.from({ length: 14 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 24 12"
            className={`${svgH} w-5 shrink-0 fill-[#FFFDF2]`}
            preserveAspectRatio="none"
          >
            {/* Greca escalonada maya clásica */}
            <path d="M0 0h20v3h-10v3h10v6H0v-3h15V6H0V0z" />
          </svg>
        ))}
      </div>
    </div>
  );
};
