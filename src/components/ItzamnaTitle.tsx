import React from 'react';

export interface ItzamnaTitleProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSubtitle?: boolean;
}

/**
 * ItzamnaTitle: Título canónico oficial con tipografía pixel art sólida retro.
 * - Restaura el texto original nítido sin patrones de dithering.
 * - Paleta oficial: #9E2A2B (Rojo Maya), #2A7B4C (Verde Jade), #FFFDF2 (Crema Sagrado).
 */
export const ItzamnaTitle: React.FC<ItzamnaTitleProps> = ({
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  // Dimensions based on size tier
  const config = {
    sm: {
      svgWidth: 160,
      svgHeight: showSubtitle ? 32 : 18,
      itzamnaY: 14,
      itzamnaSize: 11,
      itzamnaLetterSpacing: 1.5,
      academiaY: 28,
      academiaSize: 6.5,
      academiaLetterSpacing: 3,
      shadowOffset: 1.5,
    },
    md: {
      svgWidth: 240,
      svgHeight: showSubtitle ? 48 : 26,
      itzamnaY: 20,
      itzamnaSize: 17,
      itzamnaLetterSpacing: 2,
      academiaY: 40,
      academiaSize: 9.5,
      academiaLetterSpacing: 4.5,
      shadowOffset: 2.5,
    },
    lg: {
      svgWidth: 320,
      svgHeight: showSubtitle ? 64 : 36,
      itzamnaY: 28,
      itzamnaSize: 24,
      itzamnaLetterSpacing: 2.5,
      academiaY: 54,
      academiaSize: 12.5,
      academiaLetterSpacing: 6,
      shadowOffset: 3.5,
    },
  }[size];

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        width={config.svgWidth}
        height={config.svgHeight}
        viewBox={`0 0 ${config.svgWidth} ${config.svgHeight}`}
        className="overflow-visible [image-rendering:pixelated]"
        shapeRendering="crispEdges"
      >
        {/* --- TEXTO 1: ITZAMNA --- */}
        {/* Sombra 16-bit inferior */}
        <text
          x={config.svgWidth / 2}
          y={config.itzamnaY + config.shadowOffset}
          textAnchor="middle"
          fill="#4a0f10"
          fontSize={config.itzamnaSize}
          letterSpacing={config.itzamnaLetterSpacing}
          fontFamily="'Press Start 2P', monospace"
          fontWeight="bold"
        >
          ITZAMNA
        </text>

        {/* Borde/Trazo perimetral estilo cartucho retro */}
        <text
          x={config.svgWidth / 2}
          y={config.itzamnaY}
          textAnchor="middle"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          fontSize={config.itzamnaSize}
          letterSpacing={config.itzamnaLetterSpacing}
          fontFamily="'Press Start 2P', monospace"
          fontWeight="bold"
        >
          ITZAMNA
        </text>

        {/* Cara frontal sólida limpia (Sin Dithering) en Blanco Crema #FFFDF2 */}
        <text
          x={config.svgWidth / 2}
          y={config.itzamnaY}
          textAnchor="middle"
          fill="#FFFDF2"
          fontSize={config.itzamnaSize}
          letterSpacing={config.itzamnaLetterSpacing}
          fontFamily="'Press Start 2P', monospace"
          fontWeight="bold"
        >
          ITZAMNA
        </text>

        {/* --- TEXTO 2: ACADEMIA --- */}
        {showSubtitle && (
          <>
            {/* Sombra inferior en Verde Jade Oscuro */}
            <text
              x={config.svgWidth / 2}
              y={config.academiaY + (config.shadowOffset - 0.5)}
              textAnchor="middle"
              fill="#0f331e"
              fontSize={config.academiaSize}
              letterSpacing={config.academiaLetterSpacing}
              fontFamily="'Press Start 2P', monospace"
              fontWeight="bold"
            >
              ACADEMIA
            </text>

            {/* Borde perimetral 1px */}
            <text
              x={config.svgWidth / 2}
              y={config.academiaY}
              textAnchor="middle"
              fill="none"
              stroke="#000000"
              strokeWidth="1.5"
              fontSize={config.academiaSize}
              letterSpacing={config.academiaLetterSpacing}
              fontFamily="'Press Start 2P', monospace"
              fontWeight="bold"
            >
              ACADEMIA
            </text>

            {/* Cara frontal sólida limpia en Verde Jade #2A7B4C */}
            <text
              x={config.svgWidth / 2}
              y={config.academiaY}
              textAnchor="middle"
              fill="#2A7B4C"
              fontSize={config.academiaSize}
              letterSpacing={config.academiaLetterSpacing}
              fontFamily="'Press Start 2P', monospace"
              fontWeight="bold"
            >
              ACADEMIA
            </text>
          </>
        )}
      </svg>
    </div>
  );
};
